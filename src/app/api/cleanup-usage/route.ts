import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // On utilise le client Supabase côté serveur
    const supabase = await createClient();
    
    // On appelle la fonction SQL qu'on a créée
    const { data, error } = await supabase.rpc('cleanup_old_usage');
    
    if (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log(`✅ Nettoyage réussi ! ${data} anciens enregistrements supprimés.`);
    return NextResponse.json({ success: true, deleted: data });
    
  } catch (error: any) {
    console.error('❌ Erreur serveur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}