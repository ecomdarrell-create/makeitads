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

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      console.warn('Cron expiration-warnings : secret invalide');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('=== CRON EXPIRATION WARNINGS DEMARRE ===');

    const supabaseAdmin = getSupabaseAdmin();
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    const thirtyDaysFromNow = new Date(nowMs + 30 * DAY_MS).toISOString();

    // Users payants avec expiration dans les 30 prochains jours
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select(
        'id, email, first_name, plan, plan_expires_at, expiration_warned_30d_at, expiration_warned_7d_at, expiration_warned_1d_at'
      )
      .in('plan', ['pro', 'premium', 'enterprise'])
      .not('plan_expires_at', 'is', null)
      .gt('plan_expires_at', nowIso)
      .lt('plan_expires_at', thirtyDaysFromNow);

    if (fetchError) {
      console.error('Erreur fetch profils:', fetchError);
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      console.log('Aucun utilisateur dans la fenêtre 30j');
      return NextResponse.json({ success: true, processed: 0 });
    }

    console.log(`${profiles.length} utilisateurs dans la fenêtre 30j`);

    let sent30 = 0;
    let sent7 = 0;
    let sent1 = 0;
    let emailsSent = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const profile of profiles) {
      try {
        const expiresMs = new Date(profile.plan_expires_at!).getTime();
        const daysUntil = Math.ceil((expiresMs - nowMs) / DAY_MS);

        let label: string | null = null;
        let columnToUpdate: string | null = null;
        let extraColumns: string[] = [];
        let subject = '';
        let bodyHtml = '';
        let title = '';

        // Alerte 1j (priorité 1)
        if (!profile.expiration_warned_1d_at && daysUntil <= 1) {
          label = '1 jour';
          columnToUpdate = 'expiration_warned_1d_at';
          extraColumns = ['expiration_warned_7d_at', 'expiration_warned_30d_at'];
          title = 'Votre abonnement expire demain';
          subject = '⏰ Votre abonnement MakeItAds expire demain';
          bodyHtml = `
            <p style="margin: 0 0 12px 0;">Bonjour${profile.first_name ? ' ' + profile.first_name : ''},</p>
            <p style="margin: 0 0 12px 0;">
              Votre abonnement <strong>${profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}</strong>
              expire <strong>demain</strong>, le ${new Date(profile.plan_expires_at!).toLocaleDateString('fr-FR')}.
            </p>
            <p style="margin: 0 0 12px 0;">
              Une fois expiré, votre compte repassera en plan Démo et vous perdrez l'accès aux
              fonctionnalités avancées ainsi qu'à vos crédits mensuels.
            </p>
            <p style="margin: 0;">Renouvelez dès maintenant pour ne rien perdre.</p>
          `;
          sent1++;
        }
        // Alerte 7j (priorité 2)
        else if (!profile.expiration_warned_7d_at && daysUntil <= 7) {
          label = '7 jours';
          columnToUpdate = 'expiration_warned_7d_at';
          extraColumns = ['expiration_warned_30d_at'];
          title = 'Votre abonnement expire dans 7 jours';
          subject = '📅 Votre abonnement MakeItAds expire dans 7 jours';
          bodyHtml = `
            <p style="margin: 0 0 12px 0;">Bonjour${profile.first_name ? ' ' + profile.first_name : ''},</p>
            <p style="margin: 0 0 12px 0;">
              Votre abonnement <strong>${profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}</strong>
              arrive à échéance dans <strong>${daysUntil} jour${daysUntil > 1 ? 's' : ''}</strong>,
              le ${new Date(profile.plan_expires_at!).toLocaleDateString('fr-FR')}.
            </p>
            <p style="margin: 0 0 12px 0;">
              Pensez à renouveler pour continuer à utiliser toutes les fonctionnalités
              MakeItAds sans interruption.
            </p>
          `;
          sent7++;
        }
        // Alerte 30j (priorité 3)
        else if (!profile.expiration_warned_30d_at && daysUntil <= 30) {
          label = '30 jours';
          columnToUpdate = 'expiration_warned_30d_at';
          title = 'Votre abonnement arrive bientôt à échéance';
          subject = 'Votre abonnement MakeItAds arrive bientôt à échéance';
          bodyHtml = `
            <p style="margin: 0 0 12px 0;">Bonjour${profile.first_name ? ' ' + profile.first_name : ''},</p>
            <p style="margin: 0 0 12px 0;">
              Votre abonnement <strong>${profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}</strong>
              prendra fin dans <strong>${daysUntil} jours</strong>,
              le ${new Date(profile.plan_expires_at!).toLocaleDateString('fr-FR')}.
            </p>
            <p style="margin: 0 0 12px 0;">
              Vous avez encore le temps de l'utiliser pleinement.
              Renouvelez à votre rythme pour éviter toute interruption.
            </p>
          `;
          sent30++;
        }

        if (!label || !columnToUpdate) continue;

        // Insert notif in-app
        await supabaseAdmin.from('notifications').insert({
          user_id: profile.id,
          event_key: `expiration_${label.replace(' ', '')}_${profile.plan_expires_at}`,
          type: 'plan_expiring',
          category: 'account',
          title,
          message: `Votre abonnement ${profile.plan} expire dans ${label}. Renouvelez pour éviter toute interruption.`,
          action_label: 'Renouveler',
          action_path: '/dashboard/pricing',
        });

        // Update les colonnes de tracking (idempotence)
        const updates: Record<string, string> = {
          [columnToUpdate]: nowIso,
          updated_at: nowIso,
        };
        for (const col of extraColumns) {
          updates[col] = nowIso;
        }
        await supabaseAdmin
          .from('profiles')
          .update(updates)
          .eq('id', profile.id);

        // Email
        if (profile.email) {
          const emailOk = await sendEmail({
            to: profile.email,
            subject,
            title,
            previewText: `Votre abonnement expire dans ${label}`,
            bodyHtml,
            ctaLabel: 'Renouveler mon abonnement',
            ctaUrl: 'https://makeitads.pro/dashboard/pricing',
          });
          if (emailOk) emailsSent++;
        }

        console.log(`✓ ${profile.email} → alerte ${label} envoyée`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur inconnue';
        console.error(`Erreur traitement ${profile.email}:`, msg);
        errorCount++;
        errors.push(`${profile.email}: ${msg}`);
      }
    }

    console.log(
      `=== WARNINGS TERMINE : 30j=${sent30}, 7j=${sent7}, 1j=${sent1}, emails=${emailsSent}, erreurs=${errorCount} ===`
    );

    return NextResponse.json({
      success: true,
      processed: profiles.length,
      sent30,
      sent7,
      sent1,
      emailsSent,
      errorCount,
      errors: errors.slice(0, 10),
      timestamp: nowIso,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur cron expiration-warnings:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}