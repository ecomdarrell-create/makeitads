import { createAdminClient } from '@/lib/supabase/admin';
import { normalizePlanId } from '@/config/pricing.config';

interface AuthUserProfile {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

export async function ensureUserProfile(user: AuthUserProfile) {
  const supabase = createAdminClient();
  const metadata = user.user_metadata || {};

  const { data: existingProfile, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, currency, plan, credits_balance')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  let profile = existingProfile;

  if (!profile) {
    if (!user.email) {
      throw new Error('Impossible de créer le profil : le compte Auth ne contient pas d’adresse email.');
    }

    const { data: createdProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        first_name: typeof metadata.first_name === 'string' ? metadata.first_name : null,
        last_name: typeof metadata.last_name === 'string' ? metadata.last_name : null,
        currency: typeof metadata.currency === 'string' ? metadata.currency : 'XOF',
        plan: normalizePlanId(typeof metadata.plan_type === 'string' ? metadata.plan_type : 'free'),
        credits_balance: 0,
      })
      .select('id, first_name, last_name, currency, plan, credits_balance')
      .single();

    if (insertError || !createdProfile) throw insertError || new Error('Impossible de créer le profil utilisateur');
    profile = createdProfile;
  }

  const plan = normalizePlanId(profile.plan);
  if (plan === 'free') {
    const { data: welcomeTransaction, error: transactionReadError } = await supabase
      .from('credit_transactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('type', 'welcome_bonus')
      .maybeSingle();

    if (transactionReadError) throw transactionReadError;

    if (!welcomeTransaction) {
      const currentBalance = profile.credits_balance || 0;
      const welcomeAmount = Math.max(0, 10 - currentBalance);
      const newBalance = currentBalance + welcomeAmount;

      if (welcomeAmount > 0) {
        const { error: balanceError } = await supabase
          .from('profiles')
          .update({ credits_balance: newBalance })
          .eq('id', user.id);

        if (balanceError) throw balanceError;
      }

      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          type: 'welcome_bonus',
          amount: welcomeAmount,
          balance_after: newBalance,
          description: welcomeAmount > 0
            ? 'Bonus Démo unique à la création du compte'
            : 'Bonus Démo déjà présent dans le solde initial',
        });

      if (transactionError) {
        await supabase.from('profiles').update({ credits_balance: profile.credits_balance || 0 }).eq('id', user.id);
        throw transactionError;
      }

      profile = { ...profile, credits_balance: newBalance };
    }
  }

  return { ...profile, plan };
}