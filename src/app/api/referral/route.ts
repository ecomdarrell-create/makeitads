import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const REFERRAL_CREDITS = 10;

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

// GET — Retourne le code de parrainage
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

    if (profileError) {
      console.error('[referral GET] profileError:', profileError);
      return NextResponse.json({
        success: true,
        referral_code: null,
        referral_count: 0,
        warning: 'Colonnes parrainage non configurées dans Supabase',
      });
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 });
    }

    let code = profile.referral_code;
    let count = profile.referral_count || 0;

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

      const { error: updateError } = await admin
        .from('profiles')
        .update({ referral_code: code })
        .eq('id', user.id);

      if (updateError) {
        console.error('[referral GET] updateError:', updateError);
        return NextResponse.json({
          success: true,
          referral_code: null,
          referral_count: count,
          warning: 'Colonne referral_code non configurée',
        });
      }
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
      warning: 'Erreur de chargement',
    });
  }
}

// POST — Enregistre un parrainage (appelé au signup)
export async function POST(req: NextRequest) {
  try {
    const { referral_code, referee_id } = await req.json();

    if (!referral_code || !referee_id) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    const { data: referrer } = await admin
      .from('profiles')
      .select('id, referral_count, credits_balance')
      .eq('referral_code', referral_code.toUpperCase().trim())
      .maybeSingle();

    if (!referrer) {
      return NextResponse.json({ error: 'Code parrain invalide' }, { status: 404 });
    }

    if (referrer.id === referee_id) {
      return NextResponse.json(
        { error: 'Impossible de se parrainer soi-même' },
        { status: 400 }
      );
    }

    const { data: referee } = await admin
      .from('profiles')
      .select('id, created_at')
      .eq('id', referee_id)
      .maybeSingle();

    if (!referee) {
      return NextResponse.json({ error: 'Filleul introuvable' }, { status: 404 });
    }

    const createdAt = new Date(referee.created_at).getTime();
    const now = Date.now();
    const minutesSinceCreation = (now - createdAt) / 1000 / 60;

    if (minutesSinceCreation > 30) {
      return NextResponse.json(
        { error: 'Ce compte est trop ancien pour être parrainé' },
        { status: 400 }
      );
    }

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

    const newBalance = (referrer.credits_balance || 0) + REFERRAL_CREDITS;
    const newCount = (referrer.referral_count || 0) + 1;

    await admin
      .from('profiles')
      .update({
        credits_balance: newBalance,
        referral_count: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', referrer.id);

    await admin
      .from('profiles')
      .update({ referred_by: referrer.id })
      .eq('id', referee_id);

    await admin.from('referrals').insert({
      referrer_id: referrer.id,
      referee_id,
      credits_awarded: REFERRAL_CREDITS,
    });

    await admin.from('credit_transactions').insert({
      user_id: referrer.id,
      type: 'referral_bonus',
      amount: REFERRAL_CREDITS,
      balance_after: newBalance,
      description: 'Bonus parrainage — Un nouvel utilisateur a rejoint via ton lien',
    });

    console.log(`[referral] +${REFERRAL_CREDITS} crédits pour ${referrer.id}`);

    return NextResponse.json({
      success: true,
      credits_awarded: REFERRAL_CREDITS,
      new_balance: newBalance,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[referral POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}