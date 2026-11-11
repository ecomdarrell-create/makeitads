import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { estimateReadingTime } from '@/lib/academy/helpers';
import type { BlogPostInput } from '@/lib/academy/types';

export const runtime = 'nodejs';

const ADMIN_EMAIL = 'ecomdarrell@gmail.com';

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createAdminClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id } = await params;
    const body = (await req.json()) as Partial<BlogPostInput>;

    const updates: Record<string, any> = {};
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.slug !== undefined) updates.slug = body.slug.trim();
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt.trim();
    if (body.content !== undefined) {
      updates.content = body.content;
      updates.reading_time_minutes = estimateReadingTime(body.content);
    }
    if (body.cover_url !== undefined) updates.cover_url = body.cover_url || null;
    if (body.category !== undefined) updates.category = body.category;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.author_name !== undefined) updates.author_name = body.author_name;
    if (body.meta_title !== undefined) updates.meta_title = body.meta_title || null;
    if (body.meta_description !== undefined) updates.meta_description = body.meta_description || null;
    if (body.og_image_url !== undefined) updates.og_image_url = body.og_image_url || null;
    if (body.status !== undefined) {
      updates.status = body.status;
      if (body.status === 'published') {
        // Ne pas écraser published_at s'il existe déjà
        const { data: existing } = await getAdmin()
          .from('blog_posts').select('published_at').eq('id', id).maybeSingle();
        updates.published_at =
          existing?.published_at || new Date().toISOString();
      } else {
        updates.published_at = null;
      }
    }

    const admin = getAdmin();
    const { data, error } = await admin
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Un article avec ce slug existe déjà.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id } = await params;
    const admin = getAdmin();
    const { error } = await admin.from('blog_posts').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}