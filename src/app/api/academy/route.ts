import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { slugify, estimateReadingTime } from '@/lib/academy/helpers';
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

// GET — liste (public : publiés seulement, admin : tout)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const includeDrafts = url.searchParams.get('all') === 'true';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email === ADMIN_EMAIL;

    const client = isAdmin && includeDrafts ? getAdmin() : supabase;
    let query = client.from('blog_posts').select('*').order('published_at', {
      ascending: false,
      nullsFirst: false,
    });

    if (!(isAdmin && includeDrafts)) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query;
    if (error) {
      console.error('[academy GET]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: data ?? [] });
  } catch (err: any) {
    console.error('[academy GET] exception:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}

// POST — créer un article (admin)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = (await req.json()) as BlogPostInput;
    if (!body.title || !body.excerpt || !body.content) {
      return NextResponse.json(
        { error: 'Titre, extrait et contenu obligatoires.' },
        { status: 400 }
      );
    }

    const slug = (body.slug || slugify(body.title)).trim();
    if (!slug) {
      return NextResponse.json({ error: 'Slug invalide.' }, { status: 400 });
    }

    const reading_time = estimateReadingTime(body.content);
    const published_at = body.status === 'published' ? new Date().toISOString() : null;

    const admin = getAdmin();
    const { data, error } = await admin
      .from('blog_posts')
      .insert({
        slug,
        title: body.title.trim(),
        excerpt: body.excerpt.trim(),
        content: body.content,
        cover_url: body.cover_url || null,
        category: body.category,
        tags: body.tags || [],
        status: body.status,
        author_name: body.author_name || 'Équipe MakeItAds',
        reading_time_minutes: reading_time,
        meta_title: body.meta_title || null,
        meta_description: body.meta_description || null,
        og_image_url: body.og_image_url || null,
        published_at,
        created_by: user.id,
      })
      .select('*')
      .single();

    if (error) {
      console.error('[academy POST]', error);
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
    console.error('[academy POST] exception:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}