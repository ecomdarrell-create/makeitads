import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

// ✅ Force Node.js pour Resend (obligatoire Next.js 16)
export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    
    // 1. Sécurité : Vérifier que c'est bien le CEO
    const { data: { user } } = await supabase.auth.getUser();
    const CEO_EMAIL = process.env.CEO_EMAIL || 'ecomdarrell@gmail.com';
    
    if (user?.email !== CEO_EMAIL) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { replyContent } = await request.json();
    if (!replyContent || !replyContent.trim()) {
      return NextResponse.json({ error: 'Le message est vide' }, { status: 400 });
    }

    // 2. Récupérer l'email original (on essaie support_messages d'abord, puis support_emails)
    let originalEmail: any = null;
    let sourceTable: 'support_messages' | 'support_emails' = 'support_messages';

    const { data: msg, error: msgErr } = await supabase
      .from('support_messages')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!msgErr && msg) {
      originalEmail = msg;
      sourceTable = 'support_messages';
    } else {
      const { data: em, error: emErr } = await supabase
        .from('support_emails')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!emErr && em) {
        originalEmail = em;
        sourceTable = 'support_emails';
      }
    }

    if (!originalEmail) {
      return NextResponse.json({ error: 'Email introuvable' }, { status: 404 });
    }

    // 3. Déterminer l'email du destinataire (l'utilisateur qui a écrit)
    const toEmail =
      originalEmail.from_email ||
      originalEmail.email ||
      originalEmail.user_email ||
      null;

    if (!toEmail) {
      console.error('🚨 Aucun email destinataire trouvé:', originalEmail);
      return NextResponse.json({ error: 'Email destinataire introuvable' }, { status: 400 });
    }

    console.log(`📤 Reply: envoi vers ${toEmail} (table source: ${sourceTable})`);

    // 4. Envoyer via Resend avec le BON from (domaine vérifié) + replyTo
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      // ✅ ON UTILISE LE DOMAINE VÉRIFIÉ (pas onboarding@resend.dev)
      from: 'MakeItAds Support <notifications@makeitads.pro>',
      to: toEmail,
      // ✅ Si le user répond à ta réponse, ça va au support (pas à toi personnellement)
      replyTo: 'support@makeitads.pro',
      subject: `Re: ${originalEmail.subject || 'Votre demande'}`,
      html: `
        <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #F8FAFC; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px rgba(15,23,42,0.05);">
            
            <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 24px;">
              <h1 style="color: white; margin: 0; font-size: 20px; font-family: 'Inter', sans-serif;">MakeItAds Support</h1>
            </div>

            <div style="padding: 32px; text-align: left;">
              <p style="color: #475569; margin-top: 0; font-size: 15px;">Bonjour,</p>
              <p style="color: #475569; font-size: 15px;">Voici la réponse de notre équipe concernant votre demande :</p>
              
              <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #6366F1; font-size: 15px; color: #0F172A; line-height: 1.6;">
                ${replyContent.replace(/\n/g, '<br>')}
              </div>
              
              <p style="color: #475569; font-size: 15px;">Cordialement,<br><strong style="color: #0F172A;">L'équipe MakeItAds</strong></p>

              <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />

              <p style="color: #94A3B8; font-size: 12px; text-align: center;">
                💬 Vous pouvez répondre directement à cet email, votre message ira à <strong>support@makeitads.pro</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log('✅ Résultat Resend:', JSON.stringify(result));

    if (result.error) {
      console.error('🚨 Erreur retournée par Resend:', result.error);
      return NextResponse.json(
        { error: result.error.message || 'Erreur Resend' },
        { status: 500 }
      );
    }

    // 5. Mettre à jour le statut dans la BONNE table
    const updatePayload = {
      status: 'replied',
      replied: true,
      reply_content: replyContent,
      replied_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from(sourceTable)
      .update(updatePayload)
      .eq('id', id);

    if (updateError) {
      console.error('🚨 Erreur update DB:', updateError);
      // On ne bloque pas la réponse si l'update plante, l'email est déjà parti
    }

    return NextResponse.json({
      success: true,
      message: `Réponse envoyée à ${toEmail}`,
      sentTo: toEmail,
    });

  } catch (error: any) {
    console.error('🚨 Erreur API Reply:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur serveur lors de l\'envoi' },
      { status: 500 }
    );
  }
}