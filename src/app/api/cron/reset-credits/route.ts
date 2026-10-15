import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRICING_CONFIG, type PlanId } from '@/config/pricing.config';
import { sendEmail } from '@/lib/emails/send';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - THIRTY_DAYS_MS).toISOString();

    // 1) Récupère tous les users payants avec plan actif
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, first_name, plan, credits_balance, last_credits_reset, plan_expires_at')
      .in('plan', ['pro', 'premium', 'enterprise'])
      .not('plan_expires_at', 'is', null)
      .gt('plan_expires_at', now.toISOString());

    if (fetchError) {
      console.error('Erreur fetch profils:', fetchError);
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      console.log('Aucun utilisateur payant actif');
      return NextResponse.json({ success: true, processed: 0 });
    }

    // 2) Filtre en JS : uniquement les users dont le dernier reset > 30 jours (ou jamais reset)
    const eligible = profiles.filter((p) => {
      if (!p.last_credits_reset) return true;
      return new Date(p.last_credits_reset).toISOString() <= thirtyDaysAgo;
    });

    if (eligible.length === 0) {
      console.log('Aucun utilisateur éligible au renouvellement');
      return NextResponse.json({ success: true, processed: 0, eligible: 0 });
    }

    console.log(`${eligible.length} / ${profiles.length} utilisateurs éligibles`);

    let successCount = 0;
    let errorCount = 0;
    let emailsSent = 0;
    const errors: string[] = [];

    for (const profile of eligible) {
      try {
        const plan = profile.plan as PlanId;
        const monthlyCredits = PRICING_CONFIG[plan].monthlyCredits;

        // 3) Reset strict à monthlyCredits (choix B1)
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            credits_balance: monthlyCredits,
            last_credits_reset: now.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error(`Erreur update ${profile.email}:`, updateError);
          errorCount++;
          errors.push(`${profile.email}: ${updateError.message}`);
          continue;
        }

        // 4) Insert transaction → déclenche le trigger notify (notif in-app auto)
        await supabaseAdmin.from('credit_transactions').insert({
          user_id: profile.id,
          type: 'monthly_reset',
          amount: monthlyCredits,
          balance_after: monthlyCredits,
          description: `Renouvellement mensuel automatique — Plan ${plan}`,
        });

        // 5) Envoi email
        if (profile.email) {
          const emailOk = await sendEmail({
            to: profile.email,
            subject: `Vos ${monthlyCredits} crédits mensuels sont disponibles`,
            title: `Vos ${monthlyCredits} crédits mensuels ont été renouvelés`,
            previewText: `Vos ${monthlyCredits} crédits mensuels sont prêts`,
            bodyHtml: `
              <p style="margin: 0 0 12px 0;">Bonjour${profile.first_name ? ' ' + profile.first_name : ''},</p>
              <p style="margin: 0 0 12px 0;">
                Votre solde de crédits a été renouvelé automatiquement dans le cadre de votre
                plan <strong>${plan.charAt(0).toUpperCase() + plan.slice(1)}</strong>.
              </p>
              <p style="margin: 0 0 12px 0;">
                <strong>${monthlyCredits} crédits</strong> sont maintenant disponibles sur votre compte.
              </p>
              <p style="margin: 0;">Bon travail, et n'hésitez pas à explorer les nouvelles opportunités&nbsp;!</p>
            `,
            ctaLabel: 'Utiliser mes crédits',
            ctaUrl: 'https://makeitads.pro/dashboard/generate',
          });
          if (emailOk) emailsSent++;
        }

        successCount++;
        console.log(`✓ ${profile.email} → ${monthlyCredits} crédits`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur inconnue';
        console.error(`Erreur traitement ${profile.email}:`, msg);
        errorCount++;
        errors.push(`${profile.email}: ${msg}`);
      }
    }

    console.log(`=== RESET TERMINE : ${successCount} succès, ${emailsSent} emails, ${errorCount} erreurs ===`);

    return NextResponse.json({
      success: true,
      total: profiles.length,
      eligible: eligible.length,
      successCount,
      emailsSent,
      errorCount,
      errors: errors.slice(0, 10),
      timestamp: now.toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur cron reset-credits:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}