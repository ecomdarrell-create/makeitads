import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';
import { ReferralClient } from './ReferralClient';

export default async function ReferralPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // S'assurer que le profil existe
  await ensureUserProfile(user);

  // Récupérer les champs de parrainage (avec fallback si erreur)
  let referralCode: string | null = null;
  let referralCount = 0;

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('referral_code, referral_count')
      .eq('id', user.id)
      .maybeSingle();

    if (!profileError && profile) {
      referralCode = profile.referral_code || null;
      referralCount = profile.referral_count || 0;
    }
  } catch (e) {
    console.warn('Colonnes parrainage non disponibles:', e);
  }

  // Récupérer les parrainages (avec fallback si table inexistante)
  let enrichedReferrals: Array<{
    id: string;
    credits_awarded: number;
    created_at: string;
    referee_name: string;
    referee_email: string;
  }> = [];

  try {
    const { data: referrals, error: refError } = await supabase
      .from('referrals')
      .select('id, credits_awarded, created_at, referee_id')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!refError && referrals && referrals.length > 0) {
      const refereeIds = referrals.map((r) => r.referee_id);
      const { data: referees } = await supabase
        .from('profiles')
        .select('id, first_name, email')
        .in('id', refereeIds);

      const refereeMap = new Map((referees || []).map((r) => [r.id, r]));

      enrichedReferrals = referrals.map((r) => {
        const referee = refereeMap.get(r.referee_id);
        return {
          id: r.id,
          credits_awarded: r.credits_awarded,
          created_at: r.created_at,
          referee_name: referee?.first_name || 'Utilisateur',
          referee_email: referee?.email || '',
        };
      });
    }
  } catch (e) {
    console.warn('Table referrals non disponible:', e);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-6">
      <BackButton href="/dashboard" label="Retour au dashboard" />

      <div className="mb-5">
        <h1 className="mb-1 text-base font-semibold text-[#111827] sm:text-lg">
          Parrainage
        </h1>
        <p className="text-xs text-slate-600 sm:text-sm">
          Invite tes amis et gagne des crédits gratuits.
        </p>
      </div>

      <ReferralClient
        initialCode={referralCode}
        initialCount={referralCount}
        referrals={enrichedReferrals}
      />
    </div>
  );
}