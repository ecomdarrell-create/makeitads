"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, TrendingUp, Clock, Star, Sparkles, ArrowRight, Eye, Heart, BookOpen, Mail, MessageCircle, HelpCircle } from "lucide-react";
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
    <div className="min-h-screen bg-[#080810]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080810]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">Make</span>
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-2xl font-bold text-transparent tracking-tight">
                ItAds
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/academy" className="text-sm font-medium text-white">Academy</Link>
              <Link href="/contact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Contact</Link>
              <Link href="/signup" className="rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#6366f1]/25 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#8b5cf6]/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#6366f1]" />
              <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">Academy</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Marketing insights that <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">actually work</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
              Expert guides, proven strategies, and AI insights from the world's top marketers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <Link href={`/academy/${featuredArticle.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden hover:shadow-2xl hover:shadow-[#6366f1]/5 transition-all duration-500">
              <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
                <img src={featuredArticle.coverImage} alt={featuredArticle.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">Featured</span>
                  <span className="rounded-full bg-[#6366f1] px-3 py-1 text-xs font-bold text-white shadow-sm">{featuredArticle.category}</span>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <img src={featuredArticle.author.avatar} alt={featuredArticle.author.name} className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold text-white">{featuredArticle.author.name}</p>
                    <p className="text-xs text-slate-500">{formatDate(featuredArticle.publishedAt)}</p>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#6366f1] transition-colors">{featuredArticle.title}</h2>
                <p className="text-slate-400 mb-6 leading-relaxed">{featuredArticle.excerpt}</p>
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

      {/* SEARCH & FILTERS */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search articles..." className="w-full rounded-2xl border border-white/10 bg-white/[0.02] pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-[#6366f1] transition-all" />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-1">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((level) => (
              <button key={level} onClick={() => setSelectedLevel(level)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedLevel === level ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"}`}>{level}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          <button onClick={() => setSelectedCategory("All")} className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${selectedCategory === "All" ? "bg-white text-slate-900" : "border border-white/10 text-slate-400 hover:border-white"}`}>All topics</button>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${selectedCategory === cat ? "bg-white text-slate-900" : "border border-white/10 text-slate-400 hover:border-white"}`}>{cat}</button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            return (
              <button key={filter.id} onClick={() => setSelectedFilter(filter.id)} className={`flex items-center gap-2 flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${selectedFilter === filter.id ? "bg-[#6366f1] text-white" : "border border-white/10 text-slate-400 hover:border-[#6366f1]"}`}>
                <Icon className="h-3.5 w-3.5" />{filter.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <p className="text-sm text-slate-500 mb-8"><span className="font-semibold text-white">{filteredArticles.length}</span> articles</p>
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-6 w-6 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No articles found</h3>
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

      {/* CONTACT & FAQ SECTION */}
      <section className="border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Have questions?</h2>
              <p className="text-slate-400 mb-8">Our team is here to help you make the most of MakeItAds.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-[#6366f1]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Email us</p>
                    <p className="text-sm text-slate-400">support@makeitads.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-[#6366f1]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Live chat</p>
                    <p className="text-sm text-slate-400">Available 24/7</p>
                  </div>
                </div>
              </div>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#6366f1]/25 transition-all">
                Contact Support <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">FAQ</h2>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-[#6366f1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-2">How do I create my first strategy?</h3>
                      <p className="text-sm text-slate-400">Go to Dashboard → Strategies → Create New Strategy. Our AI will guide you through the process step by step.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-[#6366f1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-2">Can I upgrade my plan later?</h3>
                      <p className="text-sm text-slate-400">Yes! You can upgrade or downgrade your plan at any time from your billing settings.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-[#6366f1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-2">Is there a free trial?</h3>
                      <p className="text-sm text-slate-400">Yes, all new users get access to our Free plan with 1 strategy per month. No credit card required.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#080810]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">Make</span>
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-xl font-bold text-transparent tracking-tight">ItAds</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-slate-500">© 2026 MakeItAds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}