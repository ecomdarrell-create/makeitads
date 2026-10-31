import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { AdminInvitationEmail } from '@/emails/AdminInvitationEmail';

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

    // 1. Validation stricte
    if (!phone || !consent) {
      return NextResponse.json(
        { error: 'Données manquantes ou consentement absent.' },
        { status: 400 }
      );
    }

    if (!firstName || firstName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Le prénom est obligatoire.' },
        { status: 400 }
      );
    }

    // 2. Normalisation du téléphone
    const phone_e164 = phone.startsWith('+')
      ? phone.replace(/\s/g, '')
      : `+${phone.replace(/\D/g, '')}`;

    if (phone_e164.length < 8) {
      return NextResponse.json(
        { error: 'Format de numéro de téléphone invalide.' },
        { status: 400 }
      );
    }

    const countryMatch = phone_e164.match(/^\+(\d{1,3})/);
    const country_code = countryMatch ? countryMatch[1] : 'unknown';

    // 3. Récupérer le user connecté depuis la session
    const supabaseServer = await createServerClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    const userId = user?.id || null;
    const userEmail = user?.email || null;

    // 4. Récupérer le plan du user
    let userPlan = 'free';
    if (userId) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .maybeSingle();
      if (profile?.plan) userPlan = profile.plan;
    }

    // 5. Anti-doublon
    const { data: existingRequest } = await supabaseAdmin
      .from('community_invite_requests')
      .select('id')
      .eq('phone_e164', phone_e164)
      .in('status', ['pending', 'contacted'])
      .limit(1)
      .maybeSingle();

    if (existingRequest) {
      return NextResponse.json(
        {
          error: 'Ce numéro a déjà été enregistré pour une invitation.',
          isDuplicate: true,
        },
        { status: 409 }
      );
    }

    // 6. Insertion en base
    const { data: newRequest, error: dbError } = await supabaseAdmin
      .from('community_invite_requests')
      .insert({
        user_id: userId,
        anonymous_id: null,
        email: userEmail,
        phone_e164,
        country_code,
        consent_at: new Date().toISOString(),
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erreur DB community invite:', dbError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement.' },
        { status: 500 }
      );
    }

    // 7. Mise à jour du profil pour ne plus afficher le popup
    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .update({
          has_joined_telegram: true,
          telegram_phone: phone_e164,
        })
        .eq('id', userId);
    }

    // 8. Envoi de l'email admin premium
    try {
      await resend.emails.send({
        from: 'MakeItAds <notifications@makeitads.pro>',
        to: ['ecomdarrell@gmail.com'],
        subject: `✨ ${firstName} veut rejoindre la communauté`,
        react: AdminInvitationEmail({
          firstName: firstName.trim(),
          phone: phone_e164,
          email: userEmail,
          plan: userPlan,
        }),
      });

      await supabaseAdmin
        .from('community_invite_requests')
        .update({ admin_notified_at: new Date().toISOString() })
        .eq('id', newRequest.id);
    } catch (emailError) {
      console.error('Erreur envoi email Resend:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Demande enregistrée avec succès.',
    });
  } catch (error) {
    console.error('Erreur globale API community-invite:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}