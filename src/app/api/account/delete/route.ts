import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createAdminClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1) Vérifie session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // 2) Récupère les raisons
    const { reasons, comment } = await req.json();
    if (!Array.isArray(reasons) || reasons.length === 0) {
      return NextResponse.json({ error: 'Raisons manquantes' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    // 3) Récupère le profil pour garder des infos avant suppression
    const { data: profile } = await admin
      .from('profiles')
      .select('first_name, last_name, email, plan, credits_balance')
      .eq('id', user.id)
      .maybeSingle();

    // 4) Envoie une notif à l'admin (toi) avec les raisons
    try {
      // Trouve l'user_id de l'admin
      const { data: adminProfile } = await admin
        .from('profiles')
        .select('id')
        .eq('email', 'ecomdarrell@gmail.com')
        .maybeSingle();

      if (adminProfile?.id) {
        const reasonsText = reasons
          .map((r: string) => REASON_LABELS[r] || r)
          .join(' · ');

        await admin.from('notifications').insert({
          user_id: adminProfile.id,
          event_key: `account_deleted_${user.id}_${Date.now()}`,
          type: 'account_deleted',
          category: 'account',
          title: `🚨 Compte supprimé : ${profile?.email || user.email}`,
          message: `Raisons : ${reasonsText}${comment ? ` | Commentaire : "${comment}"` : ''}`,
          action_label: 'Voir les détails',
          action_path: '/dashboard/admin',
          metadata: {
            deleted_user_id: user.id,
            email: profile?.email || user.email,
            plan: profile?.plan,
            credits_at_deletion: profile?.credits_balance,
            reasons,
            comment: comment || null,
          },
        });
      }
    } catch (notifErr) {
      console.error('[account/delete] Erreur notif admin:', notifErr);
      // On continue quand même
    }

    // 5) Supprime l'utilisateur (cascade supprime profiles + strategies)
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('[account/delete] Erreur:', deleteError);
      return NextResponse.json(
        { error: `Impossible de supprimer le compte : ${deleteError.message}` },
        { status: 500 }
      );
    }

    console.log(`[account/delete] ✅ Compte supprimé : ${user.email}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[account/delete] Exception:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

const REASON_LABELS: Record<string, string> = {
  too_expensive: 'Trop cher',
  not_using: 'Pas assez utilisé',
  missing_features: 'Fonctionnalités manquantes',
  switching: 'Passe à un concurrent',
  technical: 'Problèmes techniques',
  other: 'Autre',
};