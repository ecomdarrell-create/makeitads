"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, TrendingUp, Clock, Star, Sparkles, ArrowRight, Eye, Heart, BookOpen } from "lucide-react";
import { articles, formatNumber, formatDate } from "@/data/academy/articles";
import { ArticleCategory, ArticleFilter, ArticleLevel } from "@/types/academy";
import ArticleCard from "@/components/academy/ArticleCard";

const CATEGORIES: ArticleCategory[] = [
  "Marketing", "Facebook Ads", "Google Ads", "AI", "Branding",
  "Copywriting", "E-commerce", "Growth", "SEO", "Analytics",
  "Email Marketing", "Social Media",
];

const FILTERS: { id: ArticleFilter; label: string; icon: any }[] = [
  { id: "recent", label: "Most Recent", icon: Clock },
  { id: "popular", label: "Most Popular", icon: TrendingUp },
  { id: "trending", label: "Trending", icon: Sparkles },
  { id: "editors-picks", label: "Editor's Picks", icon: Star },
  { id: "newest", label: "Newest", icon: BookOpen },
];

export default function AcademyClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | "All">("All");
  const [selectedFilter, setSelectedFilter] = useState<ArticleFilter>("recent");
  const [selectedLevel, setSelectedLevel] = useState<ArticleLevel | "All">("All");

  const filteredArticles = useMemo(() => {
    let result = [...articles];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (selectedCategory !== "All") result = result.filter((a) => a.category === selectedCategory);
    if (selectedLevel !== "All") result = result.filter((a) => a.level === selectedLevel);
    switch (selectedFilter) {
      case "popular": result.sort((a, b) => b.stats.views - a.stats.views); break;
      case "trending": result.sort((a, b) => b.stats.likes - a.stats.likes); break;
      case "editors-picks": result = result.filter((a) => a.editorsPick || a.featured); break;
      case "newest": result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()); break;
      default: result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
    return result;
  }, [searchQuery, selectedCategory, selectedFilter, selectedLevel]);

  const featuredArticle = articles.find((a) => a.featured);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080810]">
      <section className="relative overflow-hidden border-b border-black/5 dark:border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#8b5cf6]/5" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#6366f1]" />
              <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">Academy</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Marketing insights that <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">actually work</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Expert guides, proven strategies, and AI insights from the world's top marketers.
            </p>
          </motion.div>
        </div>
      </section>

      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <Link href={`/academy/${featuredArticle.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
                <img src={featuredArticle.coverImage} alt={featuredArticle.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-slate-900 dark:text-white shadow-sm">Featured</span>
                  <span className="rounded-full bg-[#6366f1] px-3 py-1 text-xs font-bold text-white shadow-sm">{featuredArticle.category}</span>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <img src={featuredArticle.author.avatar} alt={featuredArticle.author.name} className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{featuredArticle.author.name}</p>
                    <p className="text-xs text-slate-500">{formatDate(featuredArticle.publishedAt)}</p>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-[#6366f1] transition-colors">{featuredArticle.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{featuredArticle.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{formatNumber(featuredArticle.stats.views)}</span>
                    <span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" />{formatNumber(featuredArticle.stats.likes)}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{featuredArticle.stats.readTime} min</span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-[#6366f1] group-hover:gap-2 transition-all">Read article <ArrowRight className="h-4 w-4" /></span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search articles..." className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.02] pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#6366f1] transition-all" />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.02] p-1">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((level) => (
              <button key={level} onClick={() => setSelectedLevel(level)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedLevel === level ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-600 dark:text-slate-400"}`}>{level}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          <button onClick={() => setSelectedCategory("All")} className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${selectedCategory === "All" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400"}`}>All topics</button>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${selectedCategory === cat ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400"}`}>{cat}</button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            return (
              <button key={filter.id} onClick={() => setSelectedFilter(filter.id)} className={`flex items-center gap-2 flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${selectedFilter === filter.id ? "bg-[#6366f1] text-white" : "border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400"}`}>
                <Icon className="h-3.5 w-3.5" />{filter.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <p className="text-sm text-slate-500 mb-8"><span className="font-semibold text-slate-900 dark:text-white">{filteredArticles.length}</span> articles</p>
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-6 w-6 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No articles found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, i) => (
              <motion.div key={article.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-black/5 dark:border-white/5 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#8b5cf6]/5">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Stay ahead of your competitors</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Receive new marketing strategies every week.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="you@company.com" className="flex-1 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.02] px-5 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#6366f1] transition-all" />
            <button type="button" className="rounded-2xl bg-slate-900 dark:bg-white px-6 py-3.5 text-sm font-semibold text-white dark:text-slate-900">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}