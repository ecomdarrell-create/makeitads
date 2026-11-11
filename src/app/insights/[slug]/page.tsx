import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Clock, ArrowLeft } from 'lucide-react';
import GlobalNavbar from '@/components/shared/GlobalNavbar';
import GlobalFooter from '@/components/shared/GlobalFooter';
import { formatDateFR } from '@/lib/academy/helpers';
import { CATEGORY_LABELS, CATEGORY_COLORS, type BlogPost } from '@/lib/academy/types';

export const revalidate = 300;

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return (data as BlogPost) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Article introuvable' };

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;
  const image = post.og_image_url || post.cover_url || '/images/og-image.png';

  return {
    title,
    description,
    alternates: { canonical: `https://makeitads.pro/insights/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://makeitads.pro/insights/${post.slug}`,
      images: [{ url: image }],
      publishedTime: post.published_at || undefined,
      authors: [post.author_name],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function InsightsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_url || 'https://makeitads.pro/images/og-image.png',
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: post.author_name },
    publisher: {
      '@type': 'Organization',
      name: 'MakeItAds',
      logo: {
        '@type': 'ImageObject',
        url: 'https://makeitads.pro/favicon-96x96.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://makeitads.pro/insights/${post.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-white text-[#18181B]">
      <GlobalNavbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <Link
          href="/insights"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#6366F1] sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Retour à l&apos;Academy
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${CATEGORY_COLORS[post.category]}`}
          >
            {CATEGORY_LABELS[post.category]}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" /> {post.reading_time_minutes} min de lecture
          </span>
          <span className="text-[11px] text-slate-400">
            {formatDateFR(post.published_at)}
          </span>
        </div>

        <h1 className="mb-3 text-2xl font-bold leading-tight text-[#18181B] sm:text-3xl md:text-4xl">
          {post.title}
        </h1>
        <p className="mb-6 text-[14px] leading-relaxed text-slate-600 sm:text-base">
          {post.excerpt}
        </p>

        <p className="mb-8 text-[11px] font-medium text-slate-500">
          Par {post.author_name}
        </p>

        {post.cover_url && (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-[#18181B] prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-xl prose-h3:mt-6 prose-h3:text-lg prose-p:leading-relaxed prose-p:text-slate-700 prose-a:text-[#6366F1] prose-a:underline prose-strong:text-[#18181B] prose-ul:my-4 prose-li:my-1 prose-img:rounded-xl prose-img:my-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-1.5 border-t border-slate-100 pt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-medium text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-[#6366F1]/20 bg-[#6366F1]/5 p-5 text-center">
          <p className="mb-2 text-sm font-semibold text-[#18181B]">
            Passez à la pratique avec MakeItAds
          </p>
          <p className="mb-4 text-[12.5px] leading-relaxed text-slate-600">
            Générez votre première stratégie publicitaire complète en quelques minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5558e6] sm:text-sm"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </article>

      <GlobalFooter />
    </main>
  );
}