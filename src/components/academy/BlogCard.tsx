import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { formatDateFR } from '@/lib/academy/helpers';
import { CATEGORY_LABELS, CATEGORY_COLORS, type BlogPost } from '@/lib/academy/types';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      {post.cover_url && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
          <Image
            src={post.cover_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${CATEGORY_COLORS[post.category]}`}
          >
            {CATEGORY_LABELS[post.category]}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock className="h-3 w-3" />
            {post.reading_time_minutes} min
          </span>
        </div>
        <h3 className="mb-1.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900 sm:text-base">
          {post.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-[11.5px] leading-relaxed text-slate-500 sm:text-xs">
          {post.excerpt}
        </p>
        <p className="mt-3 text-[10.5px] text-slate-400 sm:text-[11px]">
          {formatDateFR(post.published_at)}
        </p>
      </div>
    </Link>
  );
}