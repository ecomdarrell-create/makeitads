import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// ✅ Récompense progressive selon le plan payé par le filleul
// (utilisé aussi par le webhook Chariow)
export const REFERRAL_REWARDS: Record<string, number> = {
  pro: 10,
  premium: 25,
  enterprise: 50,
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createAdminClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function generateReferralCode(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ============================================
// GET — Retourne le code de parrainage du user
// ============================================
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('referral_code, referral_count')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({
        success: true,
        referral_code: null,
        referral_count: 0,
      });
    }

    let code = profile.referral_code;
    const count = profile.referral_count || 0;

    // Génère un code unique si le user n'en a pas encore
    if (!code) {
      const admin = getSupabaseAdmin();
      let attempts = 0;
      do {
        code = generateReferralCode();
        attempts++;
        const { data: existing } = await admin
          .from('profiles')
          .select('id')
          .eq('referral_code', code)
          .maybeSingle();
        if (!existing) break;
      } while (attempts < 5);

      await admin.from('profiles').update({ referral_code: code }).eq('id', user.id);
    }

    return NextResponse.json({
      success: true,
      referral_code: code,
      referral_count: count,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[referral GET]', message);
    return NextResponse.json({
      success: true,
      referral_code: null,
      referral_count: 0,
    });
  }
}

// ============================================
// POST — Enregistre le LIEN de parrainage
// ⚠️ PAS de crédit tout de suite. Le crédit tombe
// quand le filleul paye un plan (voir webhook Chariow).
// ============================================
export async function POST(req: NextRequest) {
  try {
    // ✅ 1) Vérifie que l'appelant est bien un user connecté
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { referral_code, referee_id } = await req.json();

    if (!referral_code || !referee_id) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    // ✅ 2) L'appelant doit être le filleul lui-même
    if (user.id !== referee_id) {
      return NextResponse.json({ error: 'Action non autorisée' }, { status: 403 });
    }

    const admin = getSupabaseAdmin();

    // ─── 1. Trouve le parrain par son code ───
    const { data: referrer } = await admin
      .from('profiles')
      .select('id, referral_count')
      .eq('referral_code', referral_code.toUpperCase().trim())
      .maybeSingle();

    if (!referrer) {
      return NextResponse.json({ error: 'Code parrain invalide' }, { status: 404 });
    }

    // ─── 2. Bloque l'auto-parrainage ───
    if (referrer.id === referee_id) {
      return NextResponse.json(
        { error: 'Impossible de se parrainer soi-même' },
        { status: 400 }
      );
    }

    // ─── 3. Vérifie que le filleul existe et n'a pas déjà de parrain ───
    const { data: referee } = await admin
      .from('profiles')
      .select('id, created_at, referred_by')
      .eq('id', referee_id)
      .maybeSingle();

    if (!referee) {
      return NextResponse.json({ error: 'Filleul introuvable' }, { status: 404 });
    }

    if (referee.referred_by) {
      return NextResponse.json(
        { error: 'Ce compte a déjà été parrainé' },
        { status: 400 }
      );
    }

    // ─── 4. Anti-fraude : le filleul doit s'être inscrit il y a moins de 30 min ───
    const minutesSinceCreation =
      (Date.now() - new Date(referee.created_at).getTime()) / 60000;

    if (minutesSinceCreation > 30) {
      return NextResponse.json(
        { error: 'Ce compte est trop ancien pour être parrainé' },
        { status: 400 }
      );
    }

    // ─── 5. Anti-fraude : le filleul ne doit pas déjà être dans referrals ───
    const { data: existingReferral } = await admin
      .from('referrals')
      .select('id')
      .eq('referee_id', referee_id)
      .maybeSingle();

    if (existingReferral) {
      return NextResponse.json(
        { error: 'Ce compte a déjà été parrainé' },
        { status: 400 }
      );
    }

    // ─── 6. Enregistre le LIEN (sans crédit pour l'instant) ───
    await admin
      .from('profiles')
      .update({ referred_by: referrer.id })
      .eq('id', referee_id);

    await admin.from('referrals').insert({
      referrer_id: referrer.id,
      referee_id,
      status: 'pending',      // en attente du 1er paiement du filleul
      credits_awarded: 0,     // sera crédité par le webhook Chariow
    });

    console.log(
      `[referral] Lien enregistré : parrain ${referrer.id} → filleul ${referee_id}`
    );

    return NextResponse.json({
      success: true,
      status: 'pending',
      message:
        'Parrainage enregistré. Le parrain recevra ses crédits dès votre premier paiement.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[referral POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}