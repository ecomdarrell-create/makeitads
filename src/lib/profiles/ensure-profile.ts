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

  // ─── 2. Créer le profil s'il n'existe pas (avec 0 crédits) ───
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
          credits_balance: 0,  // ✅ 0 crédits — plus de free tier
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
    // ─── Hydratation du profil existant (prénom/nom/devise) ───
    const metaFirst = typeof metadata.first_name === 'string' ? metadata.first_name.trim() : '';
    const metaLast = typeof metadata.last_name === 'string' ? metadata.last_name.trim() : '';
    const metaCurrency = typeof metadata.currency === 'string' ? metadata.currency : '';

    // ✅ Fallback Google OAuth : extrait depuis full_name si pas de first_name
    const fullName = typeof metadata.full_name === 'string' ? metadata.full_name.trim() : (typeof metadata.name === 'string' ? metadata.name.trim() : '');
    const fullNameFirst = fullName ? fullName.split(' ')[0] : '';
    const fullNameLast = fullName ? fullName.split(' ').slice(1).join(' ') : '';

    const needsFirstName = !profile.first_name && (metaFirst || fullNameFirst);
    const needsLastName = !profile.last_name && (metaLast || fullNameLast);
    const needsCurrency = !profile.currency && metaCurrency;

    if (needsFirstName || needsLastName || needsCurrency) {
      const updates: Record<string, string> = {};
      if (needsFirstName) updates.first_name = metaFirst || fullNameFirst;
      if (needsLastName) updates.last_name = metaLast || fullNameLast;
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

  // ─── 3. Plus de welcome_bonus : aucune distribution automatique de crédits ───
  // Le plan free reste à 0 crédits jusqu'à ce que l'utilisateur paie.

  const plan = normalizePlanId(profile.plan);
  return { ...profile, plan };
}