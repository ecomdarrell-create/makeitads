import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import GlobalNavbar from '@/components/shared/GlobalNavbar';
import GlobalFooter from '@/components/shared/GlobalFooter';
import { BlogCard } from '@/components/academy/BlogCard';
import { CATEGORY_LABELS, type BlogPost, type BlogCategory } from '@/lib/academy/types';

export const metadata: Metadata = {
  title: 'À la une — Ressources publicitaires pour entrepreneurs africains',
  description: "Guides, études de cas et outils concrets pour structurer vos campagnes publicitaires sur le marché africain.",
  alternates: { canonical: 'https://makeitads.pro/insights' },
};

export const revalidate = 300;

export default async function InsightsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const posts = (data ?? []) as BlogPost[];
  const { category } = await searchParams;

  // Filtrage des articles
  const filteredPosts = category
    ? posts.filter((p) => p.category === category)
    : posts;

  const categories = Object.entries(CATEGORY_LABELS) as [BlogCategory, string][];

  return (
    <main className="min-h-screen bg-[#F7F7F8] text-[#18181B]">
      <GlobalNavbar />

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-10 sm:px-6 md:pt-20 md:pb-12">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[#6366F1] sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Retour à l&apos;accueil
        </Link>

        <header className="mb-6 sm:mb-8">
          <h1 className="text-xl font-semibold text-[#0F172A] sm:text-2xl">À la une</h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">Ressources pour entrepreneurs africains</p>
        </header>

        {/* ✅ BARRE DE FILTRES */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Link
            href="/insights"
            className={`inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              !category ? 'bg-[#6366F1] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tous les articles
          </Link>
          {categories.map(([key, label]) => (
            <Link
              key={key}
              href={`/insights?category=${key}`}
              className={`inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                category === key ? 'bg-[#6366F1] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">Aucun article dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      <GlobalFooter />
    </main>
  );
}