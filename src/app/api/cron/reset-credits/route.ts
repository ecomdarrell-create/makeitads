import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRICING_CONFIG, type PlanId } from '@/config/pricing.config';

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

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      console.warn('Cron reset-credits : secret invalide');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('=== CRON RESET CREDITS DEMARRE ===');

    const supabaseAdmin = getSupabaseAdmin();

    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, plan, credits_balance')
      .in('plan', ['pro', 'premium', 'enterprise']);

    if (fetchError) {
      console.error('Erreur fetch profils:', fetchError);
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      console.log('Aucun utilisateur payant à reset');
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'Aucun utilisateur payant',
      });
    }

    console.log(`${profiles.length} utilisateurs payants trouves`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const profile of profiles) {
      try {
        const plan = profile.plan as PlanId;
        const planConfig = PRICING_CONFIG[plan];
        const monthlyCredits = planConfig.monthlyCredits;

        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            credits_balance: monthlyCredits,
            last_credits_reset: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error(`Erreur update ${profile.email}:`, updateError);
          errorCount++;
          errors.push(`${profile.email}: ${updateError.message}`);
          continue;
        }

        await supabaseAdmin.from('credit_transactions').insert({
          user_id: profile.id,
          type: 'monthly_reset',
          amount: monthlyCredits,
          balance_after: monthlyCredits,
          description: `Renouvellement mensuel automatique — Plan ${plan}`,
        });

        successCount++;
        console.log(`✓ ${profile.email} → ${monthlyCredits} credits`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur inconnue';
        console.error(`Erreur traitement ${profile.email}:`, msg);
        errorCount++;
        errors.push(`${profile.email}: ${msg}`);
      }
    }

    console.log(`=== RESET TERMINE : ${successCount} succes, ${errorCount} erreurs ===`);

    return NextResponse.json({
      success: true,
      processed: profiles.length,
      successCount,
      errorCount,
      errors: errors.slice(0, 10),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur cron reset-credits:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}