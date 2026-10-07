import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================
// CLIENT SUPABASE ADMIN
// ============================================

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Variables Supabase manquantes');
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ============================================
// GET /api/cron/check-expired
// ============================================

export async function GET(req: NextRequest) {
  try {
    // Sécurité cron
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('=== CRON CHECK EXPIRED DEMARRE ===');

    const supabaseAdmin = getSupabaseAdmin();
    const now = new Date().toISOString();

    // Trouver tous les profils avec plan payant expiré
    const { data: expiredProfiles, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, plan, credits_balance, plan_expires_at')
      .in('plan', ['pro', 'premium', 'enterprise'])
      .not('plan_expires_at', 'is', null)
      .lt('plan_expires_at', now);

    if (fetchError) {
      console.error('Erreur fetch profils expires:', fetchError);
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }

    if (!expiredProfiles || expiredProfiles.length === 0) {
      console.log('Aucun plan expire');
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'Aucun plan expiré',
      });
    }

    console.log(`${expiredProfiles.length} plans expires trouves`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const profile of expiredProfiles) {
      try {
        // Retour au plan free + crédits à 0 + expiration à null
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            plan: 'free',
            credits_balance: 0,
            plan_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error(`Erreur downgrade ${profile.email}:`, updateError);
          errorCount++;
          errors.push(`${profile.email}: ${updateError.message}`);
          continue;
        }

        // Log transaction
        await supabaseAdmin.from('credit_transactions').insert({
          user_id: profile.id,
          type: 'plan_expired',
          amount: 0,
          balance_after: 0,
          description: `Abonnement ${profile.plan} expiré le ${profile.plan_expires_at} — retour au plan Démo`,
        });

        successCount++;
        console.log(`${profile.email} → downgrade vers free`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur inconnue';
        console.error(`Erreur traitement ${profile.email}:`, msg);
        errorCount++;
        errors.push(`${profile.email}: ${msg}`);
      }
    }

    console.log(`=== CHECK TERMINE : ${successCount} downgrades, ${errorCount} erreurs ===`);

    return NextResponse.json({
      success: true,
      processed: expiredProfiles.length,
      successCount,
      errorCount,
      errors: errors.slice(0, 10),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur cron check-expired:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}