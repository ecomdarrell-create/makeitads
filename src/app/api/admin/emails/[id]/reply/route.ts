import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // 1. Sécurité : Vérifier que c'est le CEO
    const { data: { user } } = await supabase.auth.getUser();
    const CEO_EMAIL = process.env.CEO_EMAIL || 'darrellkamga@gmail.com';
    
    if (user?.email !== CEO_EMAIL) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { replyContent } = await request.json();
    if (!replyContent) {
      return NextResponse.json({ error: 'Le message est vide' }, { status: 400 });
    }

    // 2. Récupérer l'email original pour avoir l'adresse de l'expéditeur
    const { data: originalEmail, error: fetchError } = await supabase
      .from('support_emails')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !originalEmail) {
      return NextResponse.json({ error: 'Email introuvable' }, { status: 404 });
    }

    // 3. Envoyer l'email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      // Note: Si tu as vérifié support@makeitads.pro dans Resend, utilise-le. 
      // Sinon, garde onboarding@resend.dev pour que ça marche tout de suite.
      from: 'MakeItAds Support <onboarding@resend.dev>', 
      to: originalEmail.from_email,
      subject: `Re: ${originalEmail.subject}`,
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
          <p>Bonjour,</p>
          <p>Voici la réponse de notre équipe concernant votre demande :</p>
          <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #6366f1;">
            ${replyContent.replace(/\n/g, '<br>')}
          </div>
          <p>Cordialement,<br><strong>L'équipe MakeItAds</strong></p>
        </div>
      `,
    });

    // 4. Mettre à jour le statut dans Supabase
    await supabase
      .from('support_emails')
      .update({
        status: 'replied',
        replied: true,
        reply_content: replyContent,
        replied_at: new Date().toISOString()
      })
      .eq('id', params.id);

    return NextResponse.json({ success: true, message: 'Réponse envoyée avec succès' });

  } catch (error) {
    console.error('Erreur API Reply:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de l\'envoi' }, { status: 500 });
  }
}