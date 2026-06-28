"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Clock, Calendar, User, FileText, BookOpen, LayoutTemplate, TrendingUp, Share2, Newspaper, Mail, Globe, ArrowRight, Zap, Target, BarChart3, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

const filters = ["All", "Industry Reports", "Case Studies", "Competitor Analysis", "Marketing Guides", "Growth Strategies", "Templates"];

const featuredArticle = {
  category: "Industry Report",
  readTime: "12 min read",
  date: "June 15, 2026",
  author: "Sarah Mitchell, Head of Research",
  title: "The State of Digital Advertising 2026",
  description: "Our annual deep-dive into strategies driving highest ROI across 50+ industries. Discover what's working now.",
  slug: "state-of-digital-advertising-2026",
  image: "/images/report-digital-advertising-2026.png",
  gradient: "from-[#6366f1] to-[#8b5cf6]"
};

const articles = [
  {
    id: 1,
    slug: "marketing-trends-dental-clinics-2026",
    category: "Industry Reports",
    sectionId: "reports",
    readTime: "8 min",
    title: "Marketing Trends for Dental Clinics in 2026",
    excerpt: "How local practices use AI-driven targeting to fill their appointment books.",
    author: "Dr. James Walker",
    date: "Jun 12, 2026",
    image: "/images/article-dental-clinics.jpg",
    gradient: "from-blue-500 to-cyan-500",
    icon: Globe
  },
  {
    id: 2,
    slug: "luxe-skincare-cut-cpa-31-percent",
    category: "Case Studies",
    sectionId: "case-studies",
    readTime: "6 min",
    title: "How Luxe Skincare Cut CPA by 31%",
    excerpt: "Targeting adjustments that transformed paid acquisition for a DTC beauty brand.",
    author: "Sarah Chen, CMO",
    date: "Jun 8, 2026",
    image: "/images/article-luxe-skincare.jpg",
    gradient: "from-pink-500 to-rose-500",
    icon: TrendingUp
  },
  {
    id: 3,
    slug: "complete-guide-saas-positioning",
    category: "Marketing Guides",
    sectionId: "guides",
    readTime: "10 min",
    title: "The Complete Guide to SaaS Positioning",
    excerpt: "Position your product to make competitors irrelevant in crowded markets.",
    author: "David Kim",
    date: "Jun 3, 2026",
    image: "/images/article-saas-positioning.jpg",
    gradient: "from-[#6366f1] to-[#8b5cf6]",
    icon: Target
  },
  {
    id: 4,
    slug: "ecommerce-competitor-analysis-framework",
    category: "Competitor Analysis",
    sectionId: "competitor",
    readTime: "7 min",
    title: "E-commerce Competitor Analysis Framework",
    excerpt: "A step-by-step method to spy on your competitors and steal their best strategies.",
    author: "Marcus Johnson",
    date: "May 28, 2026",
    image: "/images/article-competitor-analysis.jpg",
    gradient: "from-emerald-500 to-teal-500",
    icon: BarChart3
  },
  {
    id: 5,
    slug: "restaurant-marketing-playbook-2026",
    category: "Industry Reports",
    sectionId: "reports",
    readTime: "9 min",
    title: "Restaurant Marketing Playbook 2026",
    excerpt: "How independent restaurants compete with chains using hyperlocal targeting.",
    author: "Chef Maria Rodriguez",
    date: "May 25, 2026",
    image: "/images/article-restaurant-marketing.jpg",
    gradient: "from-amber-500 to-orange-500",
    icon: Globe
  },
  {
    id: 6,
    slug: "fitness-brand-scaling-case-study",
    category: "Case Studies",
    sectionId: "case-studies",
    readTime: "8 min",
    title: "From 0 to $2M: Fitness Brand Scaling Story",
    excerpt: "How a home gym startup used content marketing to build a million-dollar brand.",
    author: "Alex Thompson",
    date: "May 20, 2026",
    image: "/images/article-fitness-brand.jpg",
    gradient: "from-red-500 to-pink-500",
    icon: TrendingUp
  },
  {
    id: 7,
    slug: "b2b-lead-generation-strategies",
    category: "Growth Strategies",
    sectionId: "growth",
    readTime: "11 min",
    title: "B2B Lead Generation: 15 Strategies That Work",
    excerpt: "Proven tactics to fill your pipeline with qualified leads in 2026.",
    author: "Jennifer Lee",
    date: "May 15, 2026",
    image: "/images/article-b2b-leads.jpg",
    gradient: "from-violet-500 to-purple-500",
    icon: Zap
  },
  {
    id: 8,
    slug: "social-media-content-calendar-template",
    category: "Templates",
    sectionId: "templates",
    readTime: "5 min",
    title: "Social Media Content Calendar Template",
    excerpt: "Free downloadable template to plan 30 days of content in 2 hours.",
    author: "MakeItAds Team",
    date: "May 10, 2026",
    image: "/images/article-content-calendar.jpg",
    gradient: "from-[#38bdf8] to-blue-500",
    icon: LayoutTemplate
  },
  {
    id: 9,
    slug: "google-ads-vs-meta-ads-2026",
    category: "Competitor Analysis",
    sectionId: "competitor",
    readTime: "12 min",
    title: "Google Ads vs Meta Ads: Which Wins in 2026?",
    excerpt: "Data-driven comparison of ROI, CPC, and conversion rates across industries.",
    author: "Robert Chang",
    date: "May 5, 2026",
    image: "/images/article-ads-comparison.jpg",
    gradient: "from-green-500 to-emerald-500",
    icon: BarChart3
  },
  {
    id: 10,
    slug: "email-marketing-automation-guide",
    category: "Marketing Guides",
    sectionId: "guides",
    readTime: "14 min",
    title: "Email Marketing Automation: Complete Guide",
    excerpt: "Build automated sequences that convert subscribers into customers on autopilot.",
    author: "Lisa Park",
    date: "Apr 28, 2026",
    image: "/images/article-email-automation.jpg",
    gradient: "from-indigo-500 to-[#6366f1]",
    icon: Mail
  },
  {
    id: 11,
    slug: "local-seo-strategies-small-business",
    category: "Growth Strategies",
    sectionId: "growth",
    readTime: "9 min",
    title: "Local SEO: Dominate Your City in 90 Days",
    excerpt: "Step-by-step playbook to rank #1 for local searches in your industry.",
    author: "Tom Wilson",
    date: "Apr 22, 2026",
    image: "/images/article-local-seo.jpg",
    gradient: "from-yellow-500 to-amber-500",
    icon: Zap
  },
  {
    id: 12,
    slug: "marketing-budget-allocation-template",
    category: "Templates",
    sectionId: "templates",
    readTime: "4 min",
    title: "Marketing Budget Allocation Template",
    excerpt: "Excel template to plan and track your marketing spend across channels.",
    author: "MakeItAds Team",
    date: "Apr 15, 2026",
    image: "/images/article-budget-template.jpg",
    gradient: "from-teal-500 to-cyan-500",
    icon: LayoutTemplate
  },
];

const categories = [
  { name: "Industry Reports", id: "reports", icon: FileText, count: 24 },
  { name: "Case Studies", id: "case-studies", icon: Share2, count: 18 },
  { name: "Marketing Guides", id: "guides", icon: BookOpen, count: 32 },
  { name: "Templates", id: "templates", icon: LayoutTemplate, count: 15 },
  { name: "Competitor Analysis", id: "competitor", icon: BarChart3, count: 21 },
  { name: "Growth Strategies", id: "growth", icon: Zap, count: 28 },
];

// Composant pour masquer le watermark Gemini - VERSION AMÉLIORÉE
function BlogImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover select-none pointer-events-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        draggable={false}
      />
      {/* Overlay complet pour masquer le watermark Gemini */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/95 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-40 h-20 bg-gradient-to-tl from-[#080810] via-[#0f0f1a]/90 to-transparent pointer-events-none blur-[2px]" />
      <div className="absolute bottom-2 right-2 w-32 h-16 bg-[#080810]/80 rounded-lg blur-md pointer-events-none" />
    </div>
  );
}

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter(article => {
    const matchesFilter = activeFilter === "All" || article.category === activeFilter;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#080810] text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#6366f1]/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <GlobalNavbar />

      {/* Hero */}
      <section className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Marketing Intelligence{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">Resources</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
              Discover research, industry reports, competitor analyses, growth playbooks and practical guides.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollToSection("articles")} className="inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white hover:bg-[#5558e6] transition-colors">
                Browse Resources <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => scrollToSection("featured-report")} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                Latest Industry Report <FileText className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-white/10 bg-[#0f0f1a] shadow-2xl overflow-hidden aspect-[4/3]">
              <BlogImage 
                src="/images/resources-hero.png" 
                alt="Marketing Intelligence Resources" 
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      <section id="featured-report" className="relative z-10 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Link href={`/resources/${featuredArticle.slug}`} className="group block">
              <div className="relative rounded-3xl border border-white/10 bg-[#0f0f1a]/60 backdrop-blur-xl overflow-hidden hover:border-[#6366f1]/30 transition-all duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto relative">
                    <BlogImage 
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#6366f1]/80 px-3 py-1 rounded-full backdrop-blur-sm">Featured</span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8b5cf6] bg-[#8b5cf6]/10 px-3 py-1 rounded-full border border-[#8b5cf6]/20">{featuredArticle.category}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="h-3 w-3" />{featuredArticle.readTime}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-[#8b5cf6] transition-colors">{featuredArticle.title}</h2>
                    <p className="text-slate-400 mb-6 leading-relaxed">{featuredArticle.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <User className="h-4 w-4" />{featuredArticle.author}
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <Calendar className="h-4 w-4" />{featuredArticle.date}
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-[#8b5cf6] group-hover:text-white transition-colors">Read Report <ArrowRight className="h-4 w-4" /></span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search articles, reports, industries..." 
              className="w-full rounded-2xl border border-white/10 bg-[#0f0f1a] pl-14 pr-6 py-4 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/10 placeholder:text-slate-600" 
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center">
          {filters.map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)} 
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeFilter === filter 
                  ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20" 
                  : "border border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Category Overview */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div 
                key={cat.name} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: i * 0.05 }} 
                onClick={() => scrollToSection(cat.id)} 
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer"
              >
                <cat.icon className="h-6 w-6 text-[#8b5cf6] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500">{cat.count} resources</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section id="articles" className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Latest Resources</h2>
            <p className="text-slate-400">Fresh insights added weekly.</p>
          </motion.div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No articles found matching your search.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                className="mt-4 text-sm text-[#6366f1] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            categories.map(category => {
              const categoryArticles = filteredArticles.filter(a => a.sectionId === category.id);
              if (categoryArticles.length === 0) return null;
              return (
                <div key={category.id} id={category.id} className="mb-16 scroll-mt-24">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-[#8b5cf6]" />
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryArticles.map((article, index) => {
                      const Icon = article.icon;
                      return (
                        <motion.article 
                          key={article.id} 
                          initial={{ opacity: 0, y: 30 }} 
                          whileInView={{ opacity: 1, y: 0 }} 
                          viewport={{ once: true }} 
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Link href={`/resources/${article.slug}`} className="group block">
                            <div className="relative rounded-2xl border border-white/10 bg-[#0f0f1a]/60 backdrop-blur-xl overflow-hidden hover:border-[#6366f1]/30 transition-all duration-500 flex flex-col h-full">
                              <div className="aspect-video relative">
                                <BlogImage 
                                  src={article.image}
                                  alt={article.title}
                                  className="w-full h-full"
                                />
                              </div>
                              <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-full border border-[#8b5cf6]/20">{article.category}</span>
                                  <span className="flex items-center gap-1 text-[10px] text-slate-500"><Clock className="h-3 w-3" />{article.readTime}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-[#8b5cf6] transition-colors">{article.title}</h3>
                                <p className="text-sm text-slate-400 mb-6 leading-relaxed flex-1">{article.excerpt}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <User className="h-3 w-3" />
                                    {article.author}
                                  </div>
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 group-hover:bg-[#6366f1] group-hover:text-white transition-all">
                                    <ArrowRight className="h-4 w-4" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Want personalized insights?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">Stop reading generic advice. Get market intelligence tailored to your business.</p>
            <Link href="/signup" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.6)] transition-all hover:scale-105">
              Get Your Free Strategy <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}