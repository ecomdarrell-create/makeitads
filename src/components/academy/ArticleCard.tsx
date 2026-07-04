"use client";

import Link from "next/link";
import { Eye, Heart, Clock } from "lucide-react";
import { Article } from "@/types/academy";
import { formatNumber, formatDate } from "@/data/academy/articles";

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  const levelColors = {
    Beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Advanced: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };

  return (
    <Link href={`/academy/${article.slug}`} className="group block h-full">
      <article className="h-full rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden hover:shadow-2xl hover:shadow-[#6366f1]/5 hover:border-[#6366f1]/20 transition-all duration-500">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-3 right-3 rounded-full bg-white/70 dark:bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider shadow-sm">
            Read article
          </div>
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider shadow-sm">
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${levelColors[article.level]}`}>
              {article.level}
            </span>
            <span className="text-[10px] text-slate-400">•</span>
            <span className="text-[10px] text-slate-500">{formatDate(article.publishedAt)}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#6366f1] transition-colors">
            {article.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2">
              <img src={article.author.avatar} alt={article.author.name} className="h-7 w-7 rounded-full" />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{article.author.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(article.stats.views)}</span>
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{formatNumber(article.stats.likes)}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.stats.readTime}m</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}