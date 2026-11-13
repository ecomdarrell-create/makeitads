'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, ChevronLeft, ChevronRight, Clock, BookOpen,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CATEGORY_LABELS, CATEGORY_COLORS, type BlogPost } from '@/lib/academy/types';
import { formatDateFR } from '@/lib/academy/helpers';

type CarouselPost = Pick<
  BlogPost,
  'id' | 'slug' | 'title' | 'excerpt' | 'cover_url' | 'category' | 'reading_time_minutes' | 'published_at'
>;

export function AcademyCarousel() {
  const [posts, setPosts] = useState<CarouselPost[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, cover_url, category, reading_time_minutes, published_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(6);
        setPosts((data || []) as CarouselPost[]);
      } catch (err) {
        console.error('[AcademyCarousel] load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || posts.length === 0) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [posts.length]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const cardWidth = card?.clientWidth ?? 320;
    const gap = 16;
    el.scrollBy({
      left: direction === 'left' ? -(cardWidth + gap) : cardWidth + gap,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-4 w-32 rounded bg-slate-100 animate-pulse mb-3" />
          <div className="h-7 w-64 rounded bg-slate-100 animate-pulse mb-8" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] h-[340px] rounded-2xl bg-slate-50 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="relative py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#6366F1] mb-2">
              À la une
            </p>
            <h2 className="text-xl md:text-3xl font-semibold leading-tight text-[#18181B]">
              Ressources pour <span className="text-[#6366F1]">entrepreneurs</span>
            </h2>
            <p className="mt-2 text-xs md:text-sm text-[#71717A] max-w-xl">
              Guides et tactiques concrètes pour structurer vos campagnes et développer votre activité.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Précédent"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#6366F1] hover:text-[#6366F1] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Suivant"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#6366F1] hover:text-[#6366F1] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/insights/${post.slug}`}
              data-card
              className="group flex-shrink-0 w-[280px] sm:w-[320px] snap-start flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              {post.cover_url && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.cover_url}
                    alt={post.title}
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${CATEGORY_COLORS[post.category]}`}>
                    {CATEGORY_LABELS[post.category]}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    {post.reading_time_minutes} min
                  </span>
                </div>
                <h3 className="mb-1.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900">
                  {post.title}
                </h3>
                <p className="line-clamp-2 flex-1 text-[11.5px] leading-relaxed text-slate-500">
                  {post.excerpt}
                </p>
                <p className="mt-3 text-[10.5px] text-slate-400">
                  {formatDateFR(post.published_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs md:text-sm font-semibold text-[#18181B] transition-colors hover:border-[#6366F1] hover:bg-[#6366F1]/5 hover:text-[#6366F1]"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Voir tous les articles
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}