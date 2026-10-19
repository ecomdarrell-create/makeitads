import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone_e164, country_code, consent, user_id, anonymous_id, email } = body;

    // 1. Validation serveur stricte
    if (!phone_e164 || !country_code || !consent) {
      return NextResponse.json({ error: 'Données manquantes ou consentement absent.' }, { status: 400 });
    }

    if (!phone_e164.startsWith('+') || phone_e164.length < 8) {
      return NextResponse.json({ error: 'Format de numéro de téléphone invalide.' }, { status: 400 });
    }

    // 2. Vérification anti-doublon (numéro déjà soumis récemment)
    const { data: existingRequest } = await supabaseAdmin
      .from('community_invite_requests')
      .select('id, status')
      .eq('phone_e164', phone_e164)
      .in('status', ['pending', 'contacted'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingRequest) {
      return NextResponse.json({ 
        error: 'Ce numéro a déjà été enregistré pour une invitation.',
        isDuplicate: true 
      }, { status: 409 });
    }

    // 3. Insertion en base de données
    const { data: newRequest, error: dbError } = await supabaseAdmin
      .from('community_invite_requests')
      .insert({
        user_id: user_id || null,
        anonymous_id: anonymous_id || null,
        email: email || null,
        phone_e164,
        country_code,
        consent_at: new Date().toISOString(),
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erreur DB community invite:', dbError);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement.' }, { status: 500 });
    }

    // 4. Envoi de la notification administrateur via Resend
    try {
      await resend.emails.send({
        from: 'MakeItAds <onboarding@resend.dev>', // Remplace par ton domaine vérifié Resend si tu en as un (ex: noreply@makeitads.pro)
        to: ['ecomdarrell@gmail.com'],
        subject: '🔔 Nouvelle demande d\'invitation Communautaire MakeItAds',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #6366F1; margin-top: 0;">Nouvelle demande d'invitation</h2>
            <p>Un utilisateur a demandé à rejoindre la communauté MakeItAds.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Téléphone :</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${phone_e164}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Pays (Indicatif) :</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${country_code}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email (si connecté) :</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${email || 'Anonyme'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Date :</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date().toLocaleString('fr-FR')}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Source :</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${user_id ? 'Utilisateur connecté' : 'Visiteur anonyme'}</td></tr>
            </table>
            <p style="margin-top: 20px; font-size: 14px; color: #64748b;">
              Merci de lui envoyer le lien d'invitation WhatsApp dès que possible.
            </p>
          </div>
        `,
      });

      // Mise à jour du statut de notification en base
      await supabaseAdmin
        .from('community_invite_requests')
        .update({ admin_notified_at: new Date().toISOString() })
        .eq('id', newRequest.id);

    } catch (emailError) {
      console.error('Erreur envoi email Resend:', emailError);
      // On ne bloque pas la réponse si l'email échoue, la demande est quand même en base
    }

    return NextResponse.json({ success: true, message: 'Demande enregistrée avec succès.' });

  } catch (error) {
    console.error('Erreur globale API community-invite:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}