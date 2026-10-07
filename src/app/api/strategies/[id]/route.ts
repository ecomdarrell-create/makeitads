import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================
// DELETE /api/strategies/[id]
// ============================================

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier que la stratégie appartient bien à l'utilisateur
    const { data: strategy, error: fetchError } = await supabase
      .from('strategies')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !strategy) {
      return NextResponse.json(
        { error: 'Stratégie introuvable ou accès refusé' },
        { status: 404 }
      );
    }

    // Supprimer
    const { error: deleteError } = await supabase
      .from('strategies')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Erreur suppression:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur DELETE strategy:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}