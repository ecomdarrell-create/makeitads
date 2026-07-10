"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Eye,
  Check,
  ChevronDown,
  ShieldCheck,
  Loader2,
  BookOpen,
  Clock,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { SiShopify, SiStripe, SiMeta, SiGoogle, SiTiktok, SiHubspot } from "react-icons/si";

import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { useSession } from "@/hooks/useSession";
import { usePlan } from "@/hooks/usePlan";
import StatisticsSection from "@/components/StatisticsSection";
import HeroSection from "@/components/HeroSection";
import CompetitorsSection from "@/components/CompetitorsSection";
import ComparisonSection from "./ComparisonSection";
import { ALL_SUCCESS_STORIES, type SuccessStory } from "@/data/successStories";
import { getCTAText, getCTAHref } from "@/config/cta.config";

// ======================================================
// DATA
// ======================================================

const partnerLogos = [
  { name: "Shopify", icon: SiShopify },
  { name: "Stripe", icon: SiStripe },
  { name: "Meta", icon: SiMeta },
  { name: "Google", icon: SiGoogle },
  { name: "HubSpot", icon: SiHubspot },
  { name: "TikTok", icon: SiTiktok },
];

const pricingPlans = [
  { name: "Free", price: { monthly: 0, yearly: 0 }, description: "Perfect for testing the waters.", features: ["1 strategy per month", "Basic market analysis", "Email support"], cta: "Current plan", popular: false },
  { name: "Pro", price: { monthly: 29, yearly: 23 }, description: "For growing businesses.", features: ["Everything in Free", "10 strategies/month", "Competitor intelligence", "PDF Export"], cta: "Upgrade to Pro", popular: true },
  { name: "Premium", price: { monthly: 59, yearly: 47 }, description: "For serious marketers.", features: ["Everything in Pro", "Unlimited strategies", "Real-time tracking", "API access"], cta: "Go Premium", popular: false },
  { name: "Enterprise", price: { monthly: 149, yearly: 119 }, description: "For agencies & teams.", features: ["Everything in Premium", "Multi-brand", "Dedicated manager", "SLA guarantee"], cta: "Book a call", popular: false },
];

const successStories: SuccessStory[] = ALL_SUCCESS_STORIES;

const academyArticles = [
  {
    slug: "ai-powered-marketing-2026",
    title: "How AI is Reshaping Marketing in 2026",
    excerpt: "Discover how artificial intelligence is transforming the marketing landscape.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    category: "AI",
    readTime: 12,
    views: "24.8K",
    featured: true,
  },
  {
    slug: "facebook-ads-scaling-2026",
    title: "The Ultimate Facebook Ads Scaling Playbook",
    excerpt: "Master the advanced strategies top advertisers use to scale Facebook Ads profitably.",
    coverImage: "https://images.unsplash.com/photo-1611162616475-78b631d13b24?w=800&q=80",
    category: "Facebook Ads",
    readTime: 15,
    views: "18.4K",
    featured: false,
  },
  {
    slug: "seo-ai-era",
    title: "SEO in the Age of AI: What Actually Works",
    excerpt: "Google's AI Overviews changed everything. Here's how to rank in 2026.",
    coverImage: "https://images.unsplash.com/photo-1553949345-eb786bb3f7ba?w=800&q=80",
    category: "SEO",
    readTime: 10,
    views: "15.2K",
    featured: false,
  },
  {
    slug: "email-automation-ecommerce",
    title: "Email Automation That Converts: E-commerce Blueprint",
    excerpt: "Build email sequences that generate 30% of your revenue on autopilot.",
    coverImage: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80",
    category: "Email Marketing",
    readTime: 8,
    views: "12.8K",
    featured: false,
  },
];

const painPoints = [
  { id: 1, title: "Guesswork", subtitle: "You don't know which channel deserves your budget.", image: "/images/pain-guesswork.png", borderColor: "border-red-500/30", color: "from-red-500 to-orange-500", description: "Throwing money at Facebook, Google, TikTok – hoping something sticks.", stat: "63%", statLabel: "of marketers admit they're guessing" },
  { id: 2, title: "Blind Competition", subtitle: "Your competitors move faster because they understand the market better.", image: "/images/pain-competition.png", borderColor: "border-amber-500/30", color: "from-amber-500 to-yellow-500", description: "While you're guessing, they're scaling with data you don't have.", stat: "78%", statLabel: "lose to competitors with better data" },
  { id: 3, title: "Wasted Spending", subtitle: "Money gets spent on campaigns without clear reasoning.", image: "/images/pain-wasted.png", borderColor: "border-rose-500/30", color: "from-rose-500 to-pink-500", description: "Up to 70% of ad budgets are wasted on channels that don't convert.", stat: "$200B", statLabel: "wasted annually on bad ads" },
];

const faqData = [
  { question: "How accurate are the recommendations?", answer: "Our AI analyzes real-time market data with an average accuracy rate of 87%." },
  { question: "Do I need marketing experience?", answer: "Not at all! MakeItAds is designed for founders and business owners at any level." },
  { question: "Can I analyze multiple businesses?", answer: "Yes! Premium and Enterprise plans allow managing multiple business profiles simultaneously." },
  { question: "How often is market data updated?", answer: "Real-time for Premium/Enterprise. Daily for Pro. Weekly for Free." },
  { question: "Is there a free plan?", answer: "Yes! Our Free plan gives you 1 strategy per month and full dashboard access." },
  { question: "How long does it take to generate a strategy?", answer: "Most strategies are generated in under 3 minutes. Complex analyses may take up to 10 minutes." },
  { question: "Can I cancel my subscription anytime?", answer: "Absolutely. You can cancel anytime from your dashboard. No hidden fees, no questions asked." },
  { question: "Do you offer refunds?", answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund you in full." },
  { question: "Is my business data secure?", answer: "100%. We use enterprise-grade encryption (AES-256) and never share your data with third parties. Your data is yours." },
  { question: "Which ad platforms do you support?", answer: "We support Google Ads, Meta (Facebook/Instagram), TikTok, LinkedIn, Twitter/X, and Pinterest. More platforms coming soon." },
  { question: "Can I export my strategies?", answer: "Yes! Pro and Premium plans include PDF and CSV exports. Enterprise plans include API access for custom integrations." },
  { question: "Do you offer agency or white-label solutions?", answer: "Yes! Our Enterprise plan includes multi-brand management, white-label reports, and a dedicated account manager." },
  { question: "What makes MakeItAds different from ChatGPT?", answer: "Unlike generic AI, MakeItAds has persistent business memory, real-time market data, competitor tracking, and generates actionable execution-ready strategies — not just advice." },
  { question: "Is there a mobile app?", answer: "Our platform is fully responsive and works perfectly on mobile browsers. A native iOS/Android app is in development for Q2 2025." },
];

// ======================================================
// COMPOSANTS UTILITAIRES
// ======================================================

const LogoCarousel = () => (
  <div className="relative overflow-hidden">
    <div className="flex animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
      {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, index) => {
        const Icon = logo.icon;
        return (
          <div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center">
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500 hover:text-white transition-colors duration-300" />
          </div>
        );
      })}
    </div>
    <style jsx>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }`}</style>
  </div>
);

// Carousel Testimonials
function ReviewsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
      {successStories.map((story) => (
        <div
          key={story.id}
          className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] snap-start group relative rounded-2xl sm:rounded-[24px] overflow-hidden border border-white/10 bg-[#0f0f1a] hover:border-[#6366f1]/50 transition-all duration-500"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src={story.image}
              alt={story.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 380px"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
          </div>

          {story.isNew && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
              <span className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-[#6366f1]/80 backdrop-blur-md text-[10px] sm:text-xs font-bold text-white border border-[#6366f1]/50">
                New
              </span>
            </div>
          )}

          <div className="relative z-10 p-5 sm:p-8 flex flex-col h-full">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] sm:text-xs text-slate-300">{story.countryFlag} {story.country}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-slate-300">
                  {story.industry}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white">{story.name}</h3>
              <p className="text-[10px] sm:text-sm text-slate-400">{story.role} • {story.company}</p>
            </div>

            <div className="mb-4 sm:mb-6">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
                {story.metric}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1">{story.timeToResult}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 py-3 sm:py-4 border-y border-white/10">
              <div>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 sm:mb-2">Before</p>
                <ul className="space-y-1">
                  {story.before.slice(0, 2).map((item, i) => (
                    <li key={i} className="text-[10px] sm:text-xs text-slate-400 flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-600 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 mb-1.5 sm:mb-2">After</p>
                <ul className="space-y-1">
                  {story.after.slice(0, 2).map((item, i) => (
                    <li key={i} className="text-[10px] sm:text-xs text-emerald-200/80 flex items-start gap-1.5">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <blockquote className="mb-4 sm:mb-6 flex-1">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">"{story.quote}"</p>
            </blockquote>

            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {story.modules.slice(0, 2).map((mod, i) => (
                  <span key={i} className="text-[9px] sm:text-[10px] px-2 py-1 rounded-md bg-[#6366f1]/20 text-[#a5b4fc] border border-[#6366f1]/30 font-medium">
                    {mod}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider">
                <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />Verified
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Carousel Academy
function AcademyCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
      {academyArticles.map((article) => (
        <Link key={article.slug} href={`/academy/${article.slug}`} className="group block flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] snap-start">
          <article className="h-full rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0f0f1a] overflow-hidden hover:shadow-2xl hover:shadow-[#6366f1]/10 hover:border-[#6366f1]/30 transition-all duration-500">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 380px"
              />
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 rounded-full bg-white/70 dark:bg-black/60 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider shadow-sm">
                Read article
              </div>
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                <span className="rounded-full bg-[#080810]/80 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider shadow-sm border border-white/10">
                  {article.category}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-[#6366f1] transition-colors">
                {article.title}
              </h3>
              <p className="text-[11px] sm:text-sm text-slate-400 mb-3 sm:mb-5 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />{article.views}</span>
                  <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />{article.readTime}m</span>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-[#6366f1] group-hover:translate-x-1 transition-transform">
                  Read →
                </span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

// ======================================================
// PAGE PRINCIPALE
// ======================================================

export default function LandingPage() {
  const { user } = useSession();
  const { isFree, isPro, isPremium, isEnterprise } = usePlan();
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentPlan = isEnterprise ? "enterprise" : isPremium ? "premium" : isPro ? "pro" : "free";

  const handleUpgrade = async (planName: string) => {
    if (!user) {
      window.location.href = `/auth/login?redirect=/dashboard/billing&plan=${planName}`;
      return;
    }
    setLoadingPlan(planName);
    try {
      const billingCycle = isYearly ? 'yearly' : 'monthly';
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName, billingCycle, userId: user.id, userEmail: user.email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Server error");
      if (data.url) window.location.href = data.url;
      else throw new Error("No payment URL returned");
    } catch (error: any) {
      console.error('Upgrade error:', error);
      alert(error.message || "An error occurred");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleHeroCta = () => { window.location.href = getCTAHref("hero", !!user); };
  const handlePricingCta = () => { window.location.href = getCTAHref("pricing", !!user); };
  const handleFinalCta = () => { window.location.href = getCTAHref("finalCta", !!user); };

  return (
    <main className="min-h-screen bg-[#080810] text-white overflow-hidden selection:bg-[#6366f1]/20 selection:text-white">
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#6366f1]/15 rounded-full blur-[120px] opacity-80" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#8b5cf6]/10 rounded-full blur-[100px] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]" style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.85) 70%, transparent 100%)" }} />
      </div>

      <GlobalNavbar />

      {/* 1. HERO */}
      <HeroSection />

      {/* 2. SOCIAL PROOF LOGOS */}
      <section className="relative z-10 py-8 sm:py-10 border-y border-white/10 bg-[#0a0a14]/80">
        <div className="max-w-5xl mx-auto text-center px-4">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#6366f1] font-semibold mb-4 sm:mb-6">Trusted integrations & platforms</p>
          <LogoCarousel />
        </div>
      </section>

      {/* 3. PAIN POINTS */}
      <section className="relative z-10 py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8 sm:mb-10 md:mb-16 max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Most businesses don't fail because they lack effort.{" "}
              <span className="font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                They fail because they're making decisions without market intelligence.
              </span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {painPoints.map((point, index) => (
              <motion.div key={point.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: index * 0.2, type: "spring" }} className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border ${point.borderColor} bg-[#0f0f1a] shadow-lg hover:shadow-2xl hover:shadow-[#6366f1]/10 transition-all duration-500`}>
                <div className="aspect-[16/10] overflow-hidden relative rounded-t-2xl sm:rounded-t-3xl">
                  <Image src={point.image} alt={point.title} fill className="object-cover transition duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-xl font-bold text-white">{point.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{point.subtitle}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 italic">{point.description}</p>
                  <div className="pt-1 sm:pt-2">
                    <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r ${point.color} text-white shadow-lg`}>
                      {point.stat} {point.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPETITORS */}
      <CompetitorsSection />

      {/* 5. STATISTICS */}
      <StatisticsSection />

      {/* 6. COMPARISON */}
      <ComparisonSection />

      {/* 7. PRICING */}
      <section id="pricing" className="relative z-10 py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              Simple, transparent{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                pricing
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 mb-6 sm:mb-8">Choose the plan that fits your business needs.</p>
            <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className={`text-xs sm:text-sm ${!isYearly ? "text-white font-semibold" : "text-slate-400"}`}>Monthly</span>
                <button onClick={() => setIsYearly(!isYearly)} className="relative h-5 w-9 sm:h-6 sm:w-11 rounded-full bg-white/10 transition-colors focus:outline-none">
                  <span className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 h-4 w-4 sm:h-4 sm:w-4 rounded-full bg-[#8b5cf6] transition-transform ${isYearly ? "translate-x-4 sm:translate-x-5" : ""}`} />
                </button>
                <span className={`text-xs sm:text-sm ${isYearly ? "text-white font-semibold" : "text-slate-400"}`}>
                  Yearly <span className="ml-1 sm:ml-2 rounded-full bg-emerald-500/20 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-xs font-semibold text-emerald-400">Save 20%</span>
                </span>
              </div>
              <Link href="/pricing" className="text-xs sm:text-sm font-bold text-[#8b5cf6] hover:text-white transition-colors border-b border-[#8b5cf6]/50 hover:border-white pb-1">
                Compare all plans
              </Link>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {pricingPlans.map((planItem, index) => {
              const isCurrentPlan = currentPlan === planItem.name.toLowerCase();
              return (
                <motion.div key={planItem.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className={`relative rounded-2xl border ${planItem.popular ? "border-[#8b5cf6] bg-[#8b5cf6]/5" : "border-white/10 bg-white/[0.02]"} p-5 sm:p-6 flex flex-col`}>
                  {planItem.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-1 text-[10px] sm:text-xs font-bold text-white">Most Popular</div>}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-3 sm:right-4 rounded-full bg-emerald-500 px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-white flex items-center gap-1">
                      <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />Current Plan
                    </div>
                  )}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{planItem.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-400">{planItem.description}</p>
                  </div>
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-bold text-white">${isYearly ? planItem.price.yearly : planItem.price.monthly}</span>
                      <span className="text-slate-400 text-xs sm:text-sm">/month</span>
                    </div>
                    {isYearly && planItem.price.monthly > 0 && <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Billed annually (${planItem.price.yearly * 12}/year)</p>}
                  </div>
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                    {planItem.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {planItem.name === "Free" ? (
                    <button disabled className={`w-full rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-center transition-all ${isCurrentPlan ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default" : "border border-white/10 bg-white/[0.03] text-slate-500 cursor-not-allowed"}`}>
                      {isCurrentPlan ? "Current Plan" : "Free"}
                    </button>
                  ) : planItem.name === "Enterprise" ? (
                    <Link href="/contact" className="w-full rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-center transition-all border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
                      {planItem.cta}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(planItem.name)}
                      disabled={loadingPlan === planItem.name || isCurrentPlan}
                      className={`w-full rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                        isCurrentPlan ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                        : planItem.popular ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] disabled:opacity-60 disabled:cursor-not-allowed"
                      }`}
                    >
                      {loadingPlan === planItem.name ? (<><Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />Loading...</>) : isCurrentPlan ? (<><Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Current Plan</>) : (planItem.cta)}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. SUCCESS STORIES */}
      <section id="success-stories" className="relative z-10 py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 sm:mb-16 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              How businesses are growing with{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                MakeItAds
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-400">Real stories from founders and marketers who stopped guessing.</p>
          </motion.div>
          <ReviewsCarousel />
        </div>
      </section>

      {/* 9. ACADEMY */}
      <section id="academy" className="relative z-10 py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 sm:mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-3 py-1 sm:px-4 sm:py-1.5 mb-4 sm:mb-6">
              <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#6366f1]" />
              <span className="text-[10px] sm:text-xs font-semibold text-[#6366f1] uppercase tracking-wider">Academy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              Master modern marketing with{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                expert insights
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-400">
              Proven strategies, AI insights, and actionable guides from top marketers.
            </p>
          </motion.div>
          <AcademyCarousel />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="text-center mt-8 sm:mt-12">
            <Link href="/academy" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-[0_20px_60px_rgba(99,102,241,0.3)] hover:shadow-[0_25px_80px_rgba(139,92,246,0.4)] transition-all hover:scale-105">
              View all articles <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="relative z-10 py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              Frequently asked{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                questions
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-400">Everything you need to know about MakeItAds</p>
          </motion.div>
          <div className="space-y-3 sm:space-y-4">
            {faqData.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-white/[0.02] transition-colors">
                  <span className="text-xs sm:text-base font-semibold text-white pr-3 sm:pr-4">{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-slate-400 transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="relative z-10 py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/images/final-cta-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4 }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#080810]/90 via-[#080810]/70 to-[#000000]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
              Stop making decisions{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                in the dark.
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-slate-300 mb-8 sm:mb-12 max-w-2xl mx-auto">
              Get market intelligence, competitor insights and growth strategies in one platform.
            </p>
            <button onClick={handleFinalCta} className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-6 sm:px-8 md:px-12 py-3.5 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-bold text-white shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)] hover:bg-[#5558e6] transition-all hover:scale-105 w-full sm:w-auto justify-center">
              {getCTAText("finalCta", !!user)} <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}