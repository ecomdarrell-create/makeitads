import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // 1. Sécurité : Vérifier que c'est le CEO
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const CEO_EMAIL = process.env.CEO_EMAIL || 'darrellkamga@gmail.com';
    
    if (user?.email !== CEO_EMAIL) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { title, content_html, target_plan } = await request.json();
    
    if (!title || !content_html || !target_plan) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // 2. Récupérer la liste des emails selon le plan choisi
    // On utilise la Service Role Key pour avoir accès à toutes les données users
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let targetEmails: string[] = [];

    if (target_plan === 'all') {
      // Récupérer tous les emails
      const { data: users } = await serviceSupabase.auth.admin.listUsers();
      targetEmails = users.users.map(u => u.email).filter(Boolean) as string[];
    } else {
      // Récupérer les emails selon le plan (en supposant que le plan est dans user_metadata ou la table profiles)
      // Ici on cherche dans la table 'profiles' qui a le champ 'plan'
      const { data: profiles } = await serviceSupabase
        .from('profiles')
        .select('id')
        .eq('plan', target_plan);
      
      if (profiles) {
        const userIds = profiles.map(p => p.id);
        const { data: users } = await serviceSupabase.auth.admin.listUsers();
        targetEmails = users.users
          .filter(u => userIds.includes(u.id))
          .map(u => u.email)
          .filter(Boolean) as string[];
      }
    }

    if (targetEmails.length === 0) {
      return NextResponse.json({ error: 'Aucun destinataire trouvé pour ce plan' }, { status: 404 });
    }

    // 3. Envoyer via Resend (par lots de 50 pour éviter les limites API)
    const resend = new Resend(process.env.RESEND_API_KEY);
    const batchSize = 50;
    let sentCount = 0;

    for (let i = 0; i < targetEmails.length; i += batchSize) {
      const batch = targetEmails.slice(i, i + batchSize);
      
      await resend.emails.send({
        from: 'MakeItAds Newsletter <onboarding@resend.dev>', // Change si tu as vérifié ton domaine
        to: batch,
        subject: title,
        html: content_html,
      });
      
      sentCount += batch.length;
    }

    // 4. Sauvegarder dans Supabase
    const { data: newsletterData, error: insertError } = await supabase
      .from('newsletters')
      .insert({
        title,
        content_html,
        status: 'sent',
        sent_at: new Date().toISOString(),
        total_recipients: sentCount,
      })
      .select()
      .single();

    if (insertError || !newsletterData) {
      console.error('Erreur sauvegarde newsletter:', insertError);
    } else {
      // Sauvegarder les destinataires
      const recipients = targetEmails.map(email => ({
        newsletter_id: newsletterData.id,
        user_email: email,
        user_plan: target_plan,
        status: 'sent'
      }));
      
      await supabase.from('newsletter_recipients').insert(recipients);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Newsletter envoyée à ${sentCount} destinataires !` 
    });

  } catch (error) {
    console.error('Erreur API Newsletter:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}