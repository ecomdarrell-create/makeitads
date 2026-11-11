import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BookOpen } from 'lucide-react';
import GlobalNavbar from '@/components/shared/GlobalNavbar';
import GlobalFooter from '@/components/shared/GlobalFooter';
import { BlogCard } from '@/components/academy/BlogCard';
import type { BlogPost } from '@/lib/academy/types';

export const metadata: Metadata = {
  title: 'Academy — Ressources publicitaires pour entrepreneurs africains',
  description:
    "Guides, études de cas et outils concrets pour structurer vos campagnes publicitaires sur le marché africain.",
  alternates: { canonical: 'https://makeitads.pro/insights' },
};

export const revalidate = 300; // ISR 5 min

export default async function InsightsIndexPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const posts = (data ?? []) as BlogPost[];

  return (
    <main className="min-h-screen bg-[#F7F7F8] text-[#18181B]">
      <GlobalNavbar />

      {/* HERO */}
      <section className="border-b border-[#E7E7EB] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6 sm:py-14">
          <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#6366F1]/20 bg-[#6366F1]/5 px-3 py-1">
            <BookOpen className="h-3 w-3 text-[#6366F1]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6366F1]">
              Academy
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18181B] sm:text-3xl md:text-4xl">
            Ressources pour entrepreneurs africains
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[13px] leading-relaxed text-slate-500 sm:text-sm">
            Guides, études de cas et outils concrets pour structurer vos campagnes
            publicitaires et développer votre activité.
          </p>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              Aucun article publié pour le moment. Revenez bientôt.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <GlobalFooter />
    </main>
  );
}