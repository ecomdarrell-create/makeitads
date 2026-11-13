import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Clock, ArrowLeft, Calendar } from 'lucide-react';
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
  
  // ✅ CORRECTION ICI : On s'assure que l'image est un lien absolu pour WhatsApp/Telegram
  const rawImage = post.og_image_url || post.cover_url;
  const image = rawImage
    ? (rawImage.startsWith('http') ? rawImage : `https://makeitads.pro${rawImage}`)
    : 'https://makeitads.pro/images/og-image.png';

  return {
    title,
    description,
    alternates: { canonical: `https://makeitads.pro/insights/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://makeitads.pro/insights/${post.slug}`,
      images: [
        {
          url: image,
          width: 1600,
          height: 900,
          alt: title,
        },
      ],
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

  const authorInitial = post.author_name.trim().charAt(0).toUpperCase() || 'M';

  return (
    <main className="min-h-screen bg-white text-[#18181B]">
      <GlobalNavbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO — fond dégradé léger + breadcrumb */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-[#FAFBFF] to-white">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-slate-400 sm:text-sm">
            <Link href="/insights" className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition-colors hover:text-[#6366F1]">
              <ArrowLeft className="h-3.5 w-3.5" />
              À la une
            </Link>
            <span className="text-slate-300">/</span>
            <span className="truncate font-medium text-slate-500">{CATEGORY_LABELS[post.category]}</span>
          </nav>

          {/* Catégorie + lecture + date */}
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-semibold ring-1 ring-inset ${CATEGORY_COLORS[post.category]}`}
            >
              {CATEGORY_LABELS[post.category]}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <Clock className="h-3 w-3" /> {post.reading_time_minutes} min
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <Calendar className="h-3 w-3" /> {formatDateFR(post.published_at)}
            </span>
          </div>

          {/* Titre */}
          <h1 className="mb-4 text-[1.65rem] font-extrabold leading-[1.15] tracking-tight text-[#0F172A] sm:text-4xl md:text-[2.75rem]">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="mb-6 text-[14.5px] leading-relaxed text-slate-600 sm:text-base md:text-[17px]">
            {post.excerpt}
          </p>

          {/* Auteur */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-[13px] font-bold text-white shadow-sm">
              {authorInitial}
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#0F172A] sm:text-[13px]">
                {post.author_name}
              </p>
              <p className="text-[10.5px] text-slate-500 sm:text-[11px]">
                MakeItAds · À la une
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COVER IMAGE */}
      {post.cover_url && (
        <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 sm:pt-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)]">
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* CONTENU ARTICLE (rendu premium) */}
      <article className="mx-auto max-w-3xl px-4 pb-12 pt-10 sm:px-6 sm:pt-12">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-8">
            <span className="mr-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
              Tags
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] font-medium text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA FINAL PREMIUM */}
        <div className="relative mt-12 overflow-hidden rounded-2xl border border-[#6366F1]/20 bg-gradient-to-br from-[#EEF2FF] via-[#F5F3FF] to-[#FAF5FF] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#6366F1]/10 blur-3xl" />

          <div className="relative">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6366F1]">
                Passez à l&apos;action
              </span>
            </div>
            <h3 className="mb-2 text-lg font-bold leading-tight text-[#0F172A] sm:text-xl">
              Générez votre stratégie publicitaire en 5 minutes
            </h3>
            <p className="mb-5 max-w-md text-[12.5px] leading-relaxed text-slate-600 sm:text-sm">
              MakeItAds analyse votre activité et produit une stratégie complète : ciblage, hooks, scripts WhatsApp et budget alloué. Paiement unique, sans abonnement.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-5 py-2.5 text-[12.5px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(99,102,241,0.5)] transition-all hover:shadow-[0_12px_28px_-6px_rgba(99,102,241,0.6)] hover:brightness-110 sm:text-[13px]"
              >
                Créer un compte gratuit
                <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
              </Link>
              <Link
                href="/insights"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white/70 px-4 py-2.5 text-[12px] font-medium text-slate-700 transition-colors hover:bg-white sm:text-[12.5px]"
              >
                Lire d&apos;autres articles
              </Link>
            </div>
          </div>
        </div>
      </article>

      <GlobalFooter />
    </main>
  );
}