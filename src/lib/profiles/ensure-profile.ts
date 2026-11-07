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

/**
 * Récupère (ou crée) le profil utilisateur.
 * ⚠️ Ne throw JAMAIS : en cas d'erreur, on retourne un fallback pour ne pas
 * crasher le dashboard (un Server Component qui throw = page blanche).
 */
export async function ensureUserProfile(user: AuthUserProfile): Promise<ProfileShape & { plan: ReturnType<typeof normalizePlanId> }> {
  const metadata = user.user_metadata || {};

  // Fallback en cas d'erreur DB totale
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
  }

  // ─── 3. Bonus démo (welcome_bonus) — idempotent et safe ───
  const plan = normalizePlanId(profile.plan);

  if (plan === 'free') {
    try {
      // Vérifie si le bonus a déjà été appliqué
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

        // Si on est déjà à 10+ crédits, on marque comme "bonus déjà appliqué"
        // en insérant une transaction à 0 (pour ne plus repasser ici)
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

        // Insertion de la transaction (amount 0 si bonus déjà couvert)
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
          // On ne rollback PAS le balance (déjà commité), mais on log.
          // Au pire, la transaction sera rejouée au prochain login — pas de crash.
        }
      }
    } catch (err) {
      console.error('🚨 [ensureUserProfile] Exception welcome_bonus :', err);
    }
  }

  return { ...profile, plan };
}