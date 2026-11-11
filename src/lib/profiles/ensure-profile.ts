import { createAdminClient } from '@/lib/supabase/admin';
import { normalizePlanId } from '@/config/pricing.config';

interface AuthUserProfile {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

type ProfileShape = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  currency: string;
  plan: string;
  credits_balance: number;
};

export async function ensureUserProfile(
  user: AuthUserProfile
): Promise<ProfileShape & { plan: ReturnType<typeof normalizePlanId> }> {
  const metadata = user.user_metadata || {};

  const fallback: ProfileShape = {
    id: user.id,
    first_name: typeof metadata.first_name === 'string' ? metadata.first_name : null,
    last_name: typeof metadata.last_name === 'string' ? metadata.last_name : null,
    currency: typeof metadata.currency === 'string' ? metadata.currency : 'XOF',
    plan: 'free',
    credits_balance: 0,
  };

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    console.error('🚨 [ensureUserProfile] createAdminClient a échoué :', err);
    return { ...fallback, plan: normalizePlanId(fallback.plan) };
  }

  // ─── 1. Lire le profil existant ───
  let profile: ProfileShape | null = null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, currency, plan, credits_balance')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('🚨 [ensureUserProfile] SELECT profile error :', error);
    } else {
      profile = data as ProfileShape | null;
    }
  } catch (err) {
    console.error('🚨 [ensureUserProfile] Exception SELECT profile :', err);
  }

  // ─── 2. Créer le profil s'il n'existe pas ───
  if (!profile) {
    if (!user.email) {
      console.error('🚨 [ensureUserProfile] User sans email, impossible de créer le profil.');
      return { ...fallback, plan: normalizePlanId(fallback.plan) };
    }

    try {
      const { data, error } = await supabase
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

      if (error || !data) {
        console.error('🚨 [ensureUserProfile] INSERT profile error :', error);
        return { ...fallback, plan: normalizePlanId(fallback.plan) };
      }
      profile = data as ProfileShape;
    } catch (err) {
      console.error('🚨 [ensureUserProfile] Exception INSERT profile :', err);
      return { ...fallback, plan: normalizePlanId(fallback.plan) };
    }
  } else {
    // ─── ✅ FIX CAUSE RACINE PRÉNOM ───
    // Le profil existe, mais first_name est vide → on hydrate depuis user_metadata
    const metaFirst = typeof metadata.first_name === 'string' ? metadata.first_name.trim() : '';
    const metaLast = typeof metadata.last_name === 'string' ? metadata.last_name.trim() : '';
    const metaCurrency = typeof metadata.currency === 'string' ? metadata.currency : '';

    const needsFirstName = !profile.first_name && metaFirst;
    const needsLastName = !profile.last_name && metaLast;
    const needsCurrency = !profile.currency && metaCurrency;

    if (needsFirstName || needsLastName || needsCurrency) {
      const updates: Record<string, string> = {};
      if (needsFirstName) updates.first_name = metaFirst;
      if (needsLastName) updates.last_name = metaLast;
      if (needsCurrency) updates.currency = metaCurrency;

      try {
        const { error: updErr } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);

        if (updErr) {
          console.error('🚨 [ensureUserProfile] UPDATE profil partiel error :', updErr);
        } else {
          profile = { ...profile, ...updates };
        }
      } catch (err) {
        console.error('🚨 [ensureUserProfile] Exception UPDATE profil :', err);
      }
    }
  }

  // ─── 3. Bonus démo (welcome_bonus) ───
  const plan = normalizePlanId(profile.plan);

  if (plan === 'free') {
    try {
      const { data: welcomeTx, error: readErr } = await supabase
        .from('credit_transactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'welcome_bonus')
        .maybeSingle();

      if (readErr) {
        console.error('🚨 [ensureUserProfile] SELECT welcome_bonus error :', readErr);
      } else if (!welcomeTx) {
        const currentBalance = profile.credits_balance ?? 0;
        const welcomeAmount = Math.max(0, 10 - currentBalance);

        if (welcomeAmount > 0) {
          const newBalance = currentBalance + welcomeAmount;
          const { error: balanceErr } = await supabase
            .from('profiles')
            .update({ credits_balance: newBalance })
            .eq('id', user.id);

          if (balanceErr) {
            console.error('🚨 [ensureUserProfile] UPDATE credits_balance error :', balanceErr);
          } else {
            profile = { ...profile, credits_balance: newBalance };
          }
        }

        const { error: txErr } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: user.id,
            type: 'welcome_bonus',
            amount: welcomeAmount,
            balance_after: profile.credits_balance ?? currentBalance,
            description:
              welcomeAmount > 0
                ? 'Bonus Démo unique à la création du compte'
                : 'Bonus Démo déjà présent dans le solde initial',
          });

        if (txErr) {
          console.error('🚨 [ensureUserProfile] INSERT welcome_bonus error :', txErr);
        }
      }
    } catch (err) {
      console.error('🚨 [ensureUserProfile] Exception welcome_bonus :', err);
    }
  }

  return { ...profile, plan };
}