import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createAdminClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1) Vérifie que c'est bien l'admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    if (!isAdmin(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // 2) Récupère les threadIds
    const { threadIds } = await req.json();
    if (!Array.isArray(threadIds) || threadIds.length === 0) {
      return NextResponse.json({ error: 'Aucun ID fourni' }, { status: 400 });
    }

    if (threadIds.length > 500) {
      return NextResponse.json({ error: 'Maximum 500 conversations à la fois' }, { status: 400 });
    }

    // 3) Supprime vraiment en DB (avec admin client pour bypass RLS)
    const admin = getSupabaseAdmin();
    const { error, count } = await admin
      .from('support_messages')
      .delete({ count: 'exact' })
      .in('thread_id', threadIds);

    if (error) {
      console.error('[support/delete] Erreur:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`[support/delete] ✅ ${count} message(s) supprimé(s) — threads: ${threadIds.length}`);

    return NextResponse.json({
      success: true,
      threadsDeleted: threadIds.length,
      messagesDeleted: count ?? 0,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[support/delete] Exception:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}