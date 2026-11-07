import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const body = await req.json();
    const { phone, firstName, consent } = body;

    if (!phone || !consent) {
      return NextResponse.json({ error: 'Données manquantes.' }, { status: 400 });
    }

    const finalFirstName =
      firstName && firstName.trim().length >= 2 && firstName !== 'vous'
        ? firstName.trim()
        : 'Client';

    const phone_e164 = phone.startsWith('+')
      ? phone.replace(/\s/g, '')
      : `+${phone.replace(/\D/g, '')}`;
    const countryMatch = phone_e164.match(/^\+(\d{1,3})/);
    const country_code = countryMatch ? countryMatch[1] : 'unknown';

    const supabaseServer = await createServerClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    const userId = user?.id || null;
    const userEmail = user?.email || null;

    // 1️⃣ Insertion de la demande
    const { error: dbError } = await supabaseAdmin
      .from('community_invite_requests')
      .insert({
        user_id: userId,
        email: userEmail,
        phone_e164,
        country_code,
        consent_at: new Date().toISOString(),
        status: 'pending',
      });

    if (dbError) {
      console.error('🚨 DB Error:', dbError);
      return NextResponse.json({ error: 'Erreur DB.' }, { status: 500 });
    }

    // 2️⃣ Mise à jour du profil — AVEC vérification d'erreur
    // On ne considère hasJoinedTelegram = true QUE si l'update a réussi.
    // Sinon le client afficherait un faux succès et le widget reviendrait
    // au prochain refresh.
    let hasJoinedTelegram = false;
    if (userId) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          has_joined_telegram: true,
          telegram_phone: phone_e164,
        })
        .eq('id', userId);

      if (profileError) {
        console.error('🚨 Profile update error (has_joined_telegram):', profileError);
      } else {
        hasJoinedTelegram = true;
      }
    }

    // 3️⃣ Email à l'admin (inchangé)
    try {
      console.log("📤 Envoi de l'email vers ecomdarrell@gmail.com");

      const emailResult = await resend.emails.send({
        from: 'MakeItAds <notifications@makeitads.pro>',
        to: ['ecomdarrell@gmail.com'],
        replyTo: userEmail || 'support@makeitads.pro',
        subject: `✨ Nouvelle demande d'invitation : ${finalFirstName}`,
        html: `
          <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #F8FAFC; padding: 40px 20px; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px rgba(15,23,42,0.05);">
              
              <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 24px;">
                <h1 style="color: white; margin: 0; font-size: 20px;">Nouvelle Invitation</h1>
              </div>

              <div style="padding: 32px; text-align: left;">
                <p style="color: #475569; margin-top: 0;">Une nouvelle demande d'invitation à la communauté MakeItAds vient d'être enregistrée.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 24px; background: #F8FAFC; border-radius: 12px; overflow: hidden;">
                  <tr>
                    <td style="padding: 12px 16px; color: #64748B; font-size: 13px; font-weight: 600; border-bottom: 1px solid #E2E8F0;">Prénom</td>
                    <td style="padding: 12px 16px; color: #0F172A; font-size: 14px; font-weight: 700; border-bottom: 1px solid #E2E8F0;">${finalFirstName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; color: #64748B; font-size: 13px; font-weight: 600; border-bottom: 1px solid #E2E8F0;">Numéro WhatsApp</td>
                    <td style="padding: 12px 16px; color: #0F172A; font-size: 14px; font-weight: 700; border-bottom: 1px solid #E2E8F0;">${phone_e164}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; color: #64748B; font-size: 13px; font-weight: 600;">Email du compte</td>
                    <td style="padding: 12px 16px; color: #0F172A; font-size: 14px; font-weight: 700;">${userEmail || 'Visiteur anonyme'}</td>
                  </tr>
                </table>

                <div style="margin-top: 32px; text-align: center;">
                  <a href="https://wa.me/${phone_e164.replace('+', '')}" style="display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 14px 28px; border-radius: 999px; font-weight: bold; font-size: 14px;">
                    💬 Contacter sur WhatsApp
                  </a>
                </div>

                <p style="margin-top: 24px; font-size: 12px; color: #94A3B8; text-align: center;">
                  💡 Astuce : tu peux répondre directement à cet email. Ta réponse partira vers le user (si son email est connu) ou vers support@makeitads.pro.
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log('✅ Réponse Resend:', JSON.stringify(emailResult));

      if (emailResult.error) {
        console.error('🚨 Erreur retournée par Resend:', emailResult.error);
      }
    } catch (emailError) {
      console.error('🚨 Exception Resend:', emailError);
    }

    // ✅ On retourne l'état réel du flag : le client décide s'il cache le widget ou affiche une erreur
    return NextResponse.json({ success: true, hasJoinedTelegram });
  } catch (error) {
    console.error('🚨 Erreur globale API:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}