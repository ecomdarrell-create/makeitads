import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/emails/send';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      console.warn('Cron check-expired : secret invalide');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('=== CRON CHECK EXPIRED DEMARRE ===');

    const supabaseAdmin = getSupabaseAdmin();
    const now = new Date().toISOString();

    const { data: expiredProfiles, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, first_name, plan, credits_balance, plan_expires_at')
      .in('plan', ['pro', 'premium', 'enterprise'])
      .not('plan_expires_at', 'is', null)
      .lt('plan_expires_at', now);

    if (fetchError) {
      console.error('Erreur fetch profils expirés:', fetchError);
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }

    if (!expiredProfiles || expiredProfiles.length === 0) {
      console.log('Aucun plan expiré');
      return NextResponse.json({ success: true, processed: 0 });
    }

    console.log(`${expiredProfiles.length} plans expirés trouvés`);

    let successCount = 0;
    let emailsSent = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const profile of expiredProfiles) {
      try {
        // 1) Reset à free + 0 crédits (choix confirmé)
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

        // 2) Insert transaction → trigger notif auto
        await supabaseAdmin.from('credit_transactions').insert({
          user_id: profile.id,
          type: 'plan_expired',
          amount: 0,
          balance_after: 0,
          description: `Abonnement ${profile.plan} expiré le ${new Date(profile.plan_expires_at!).toLocaleDateString('fr-FR')} — retour au plan Démo`,
        });

        // 3) Email
        if (profile.email) {
          const emailOk = await sendEmail({
            to: profile.email,
            subject: 'Votre abonnement MakeItAds a expiré',
            title: 'Votre abonnement a expiré',
            previewText: 'Renouvelez pour continuer à utiliser MakeItAds',
            bodyHtml: `
              <p style="margin: 0 0 12px 0;">Bonjour${profile.first_name ? ' ' + profile.first_name : ''},</p>
              <p style="margin: 0 0 12px 0;">
                Votre abonnement <strong>${profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}</strong>
                a pris fin le <strong>${new Date(profile.plan_expires_at!).toLocaleDateString('fr-FR')}</strong>.
              </p>
              <p style="margin: 0 0 12px 0;">
                Votre compte est repassé en plan Démo. Vous conservez l'accès à la plateforme,
                mais les fonctionnalités avancées et les crédits mensuels ne sont plus disponibles.
              </p>
              <p style="margin: 0 0 12px 0;">
                Renouvelez dès maintenant pour retrouver toutes vos fonctionnalités et vos crédits mensuels.
              </p>
              <p style="margin: 0;">Merci de votre confiance.</p>
            `,
            ctaLabel: 'Renouveler mon abonnement',
            ctaUrl: 'https://makeitads.pro/dashboard/pricing',
          });
          if (emailOk) emailsSent++;
        }

        successCount++;
        console.log(`${profile.email} → downgrade vers free`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur inconnue';
        console.error(`Erreur traitement ${profile.email}:`, msg);
        errorCount++;
        errors.push(`${profile.email}: ${msg}`);
      }
    }

    console.log(`=== CHECK TERMINE : ${successCount} downgrades, ${emailsSent} emails, ${errorCount} erreurs ===`);

    return NextResponse.json({
      success: true,
      processed: expiredProfiles.length,
      successCount,
      emailsSent,
      errorCount,
      errors: errors.slice(0, 10),
      timestamp: now,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur cron check-expired:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}