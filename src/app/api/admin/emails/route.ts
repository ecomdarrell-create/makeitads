import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // ✅ 1. Ajouter 'await' ici
    const supabase = await createClient();
    
    // 2. Vérifier qui est connecté
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // 3. SÉCURITÉ : Vérifier que c'est bien le CEO
    const CEO_EMAIL = process.env.CEO_EMAIL || 'darrellkamga@gmail.com';
    
    if (user.email !== CEO_EMAIL) {
      return NextResponse.json({ error: 'Accès refusé. Réservé au CEO.' }, { status: 403 });
    }

    // 4. Récupérer les emails de support
    const { data: emails, error } = await supabase
      .from('support_emails')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des emails' }, { status: 500 });
    }

    // 5. Retourner les données
    return NextResponse.json({ 
      success: true, 
      count: emails?.length || 0,
      emails: emails || []
    });

  } catch (error) {
    console.error('Erreur API Admin Emails:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}