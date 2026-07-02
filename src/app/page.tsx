"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, TrendingUp, BarChart3, Eye, Map, Target, 
  MessageSquare, Brain, Lightbulb, Rocket, Check, X,
  ChevronDown, ShieldCheck, Loader2, ChevronLeft, ChevronRight
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { SiShopify, SiStripe, SiMeta, SiGoogle, SiTiktok, SiHubspot } from "react-icons/si";

import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { useSession } from "@/hooks/useSession";
import { usePlan } from "@/hooks/usePlan";
import StatisticsSection from "@/components/StatisticsSection";
import InteractiveWalkthrough from "@/components/InteractiveWalkthrough";
import HeroSection from "@/components/HeroSection";
import CompetitorsSection from "@/components/CompetitorsSection";
import MarketIntelligenceSection from "@/components/MarketIntelligenceSection";
import { ALL_SUCCESS_STORIES, type SuccessStory } from "@/data/successStories";
import { getCTAText, getCTAHref } from "@/config/cta.config";

// ======================================================
// DATA
// ======================================================

const partnerLogos = [
  { name: "Shopify", icon: SiShopify }, { name: "Stripe", icon: SiStripe }, { name: "Meta", icon: SiMeta },
  { name: "Google", icon: SiGoogle }, { name: "HubSpot", icon: SiHubspot }, { name: "TikTok", icon: SiTiktok },
];

const pricingPlans = [
  { name: "Free", price: { monthly: 0, yearly: 0 }, description: "Perfect for testing the waters.", features: ["1 strategy per month", "Basic market analysis", "Email support"], cta: "Current plan", popular: false },
  { name: "Pro", price: { monthly: 29, yearly: 23 }, description: "For growing businesses.", features: ["Everything in Free", "10 strategies/month", "Competitor intelligence", "PDF Export"], cta: "Upgrade to Pro", popular: true },
  { name: "Premium", price: { monthly: 59, yearly: 47 }, description: "For serious marketers.", features: ["Everything in Pro", "Unlimited strategies", "Real-time tracking", "API access"], cta: "Go Premium", popular: false },
  { name: "Enterprise", price: { monthly: 149, yearly: 119 }, description: "For agencies & teams.", features: ["Everything in Premium", "Multi-brand", "Dedicated manager", "SLA guarantee"], cta: "Book a call", popular: false },
];

const successStories: SuccessStory[] = ALL_SUCCESS_STORIES;

const painPoints = [
  { id: 1, title: "Guesswork", subtitle: "You don't know which channel deserves your budget.", image: "/images/pain-guesswork.png", borderColor: "border-red-500/30", color: "from-red-500 to-orange-500", description: "Throwing money at Facebook, Google, TikTok – hoping something sticks.", stat: "63%", statLabel: "of marketers admit they're guessing" },
  { id: 2, title: "Blind Competition", subtitle: "Your competitors move faster because they understand the market better.", image: "/images/pain-competition.png", borderColor: "border-amber-500/30", color: "from-amber-500 to-yellow-500", description: "While you're guessing, they're scaling with data you don't have.", stat: "78%", statLabel: "lose to competitors with better data" },
  { id: 3, title: "Wasted Spending", subtitle: "Money gets spent on campaigns without clear reasoning.", image: "/images/pain-wasted.png", borderColor: "border-rose-500/30", color: "from-rose-500 to-pink-500", description: "Up to 70% of ad budgets are wasted on channels that don't convert.", stat: "$200B", statLabel: "wasted annually on bad ads" },
];

const steps = [
  { id: 1, number: "01", title: "Describe your business", subtitle: "Tell us about your goals and audience.", image: "/images/step1-describe.png", icon: MessageSquare },
  { id: 2, number: "02", title: "Analyze your market", subtitle: "Our AI scans thousands of data points in real-time.", image: "/images/step2-analyze.png", icon: Brain },
  { id: 3, number: "03", title: "Discover opportunities", subtitle: "Uncover hidden niches and competitor weaknesses.", image: "/images/step3-discover.png", icon: Lightbulb },
  { id: 4, number: "04", title: "Execute your growth plan", subtitle: "Get a step-by-step roadmap ready to launch.", image: "/images/step4-execute.png", icon: Rocket },
];

const comparisonData = [
  { feature: "Business Context Memory", generic: "None (Resets every chat)", makeitads: "Persistent Profile", diff: "+100%" },
  { feature: "Competitor Tracking", generic: "Manual & Outdated", makeitads: "Real-time Automated", diff: "24/7" },
  { feature: "Market Data Freshness", generic: "Training cutoff (Months old)", makeitads: "Live Signals", diff: "Real-time" },
  { feature: "Actionable Roadmap", generic: "Generic Advice Only", makeitads: "Step-by-Step Plan", diff: "Execution Ready" },
  { feature: "Ad Copy Generation", generic: "Random Variations", makeitads: "Data-Backed Angles", diff: "+45% CTR" },
  { feature: "Budget Allocation", generic: "No Financial Logic", makeitads: "ROI Optimized Split", diff: "-30% Waste" },
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

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(target);
  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(target / 50);
      if (current >= target) { setCount(target); clearInterval(timer); } else { setCount(current); }
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  useEffect(() => {
    const dynamicTimer = setInterval(() => {
      setCount(prev => Math.max(2800, prev + Math.floor(Math.random() * 5) - 2));
    }, 8000);
    return () => clearInterval(dynamicTimer);
  }, []);
  return <span>{count.toLocaleString()}</span>;
}

const LogoCarousel = () => (
  <div className="relative overflow-hidden">
    <div className="flex animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
      {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, index) => { const Icon = logo.icon; return (<div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center"><Icon className="w-10 h-10 text-slate-500 hover:text-white transition-colors duration-300" /></div>); })}
    </div>
    <style jsx>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }`}</style>
  </div>
);

function ReviewsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 400, behavior: "smooth" });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll("left")}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-20 h-12 w-12 rounded-full bg-[#6366f1]/90 hover:bg-[#6366f1] flex items-center justify-center transition-all shadow-xl ${
          !canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={() => scroll("right")}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-20 h-12 w-12 rounded-full bg-[#6366f1]/90 hover:bg-[#6366f1] flex items-center justify-center transition-all shadow-xl ${
          !canScrollRight ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
        {successStories.map((story) => (
          <div
            key={story.id}
            className="flex-shrink-0 w-[320px] md:w-[380px] snap-start group relative rounded-[24px] overflow-hidden border border-white/10 bg-[#0f0f1a] hover:border-[#6366f1]/50 transition-all duration-500"
          >
            <div className="absolute inset-0 z-0">
              <Image 
                src={story.image} 
                alt={story.name} 
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 380px"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
            </div>
            
            {story.isNew && (
              <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1 rounded-full bg-[#6366f1]/80 backdrop-blur-md text-xs font-bold text-white border border-[#6366f1]/50">
                  New
                </span>
              </div>
            )}
            
            <div className="relative z-10 p-8 flex flex-col h-full">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-300">{story.countryFlag} {story.country}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-slate-300">
                    {story.industry}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{story.name}</h3>
                <p className="text-sm text-slate-400">{story.role} • {story.company}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
                  {story.metric}
                </p>
                <p className="text-xs text-slate-400 mt-1">{story.timeToResult}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-white/10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Before</p>
                  <ul className="space-y-1.5">
                    {story.before.slice(0, 2).map((item, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-slate-600 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 mb-2">After</p>
                  <ul className="space-y-1.5">
                    {story.after.slice(0, 2).map((item, i) => (
                      <li key={i} className="text-xs text-emerald-200/80 flex items-start gap-2">
                        <Check className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <blockquote className="mb-6 flex-1">
                <p className="text-sm text-slate-300 leading-relaxed italic">"{story.quote}"</p>
              </blockquote>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {story.modules.slice(0, 2).map((mod, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-[#6366f1]/20 text-[#a5b4fc] border border-[#6366f1]/30 font-medium">
                      {mod}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3" />Verified
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
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
      <section className="relative z-10 py-10 border-y border-white/10 bg-[#0a0a14]/80">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6366f1] font-semibold mb-6">Trusted integrations & platforms</p>
          <LogoCarousel />
        </div>
      </section>

      {/* 3. PAIN POINTS */}
      <section className="relative z-10 py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-16 max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">Most businesses don't fail because they lack effort.{" "}<span className="font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">They fail because they're making decisions without market intelligence.</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {painPoints.map((point, index) => (
              <motion.div key={point.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: index * 0.2, type: "spring" }} className={`group relative rounded-3xl overflow-hidden border ${point.borderColor} bg-[#0f0f1a] shadow-lg hover:shadow-2xl hover:shadow-[#6366f1]/10 transition-all duration-500`}>
                <div className="aspect-[16/10] overflow-hidden relative rounded-t-3xl">
                  <Image src={point.image} alt={point.title} fill className="object-cover transition duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-white">{point.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{point.subtitle}</p>
                  <p className="text-slate-500 text-xs italic">{point.description}</p>
                  <div className="pt-2"><span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${point.color} text-white shadow-lg`}>{point.stat} {point.statLabel}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="relative z-10 py-16 md:py-24 px-6 bg-[#0a0a14]/80">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12 md:mb-16 max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">From business idea to <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">growth plan</span> in minutes.</h2>
            <p className="text-base md:text-lg text-slate-400">No complex setup. Just describe your business and let our AI handle the rest.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.id} initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 }} className="relative group">
                  <div className="absolute -top-4 -left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#0f0f1a] border border-white/10 text-sm font-bold text-slate-400">{step.number}</div>
                  <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a14] aspect-video mb-5 relative">
                    <Image src={step.image} alt={step.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#080810]/70 backdrop-blur-[2px]"><Icon className="h-8 w-8 text-white drop-shadow-lg" /></div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.subtitle}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE WALKTHROUGH (CARROUSEL PLEIN ÉCRAN) */}
      <InteractiveWalkthrough />

      {/* 6. COMPETITORS (SIMPLIFIÉ) */}
      <CompetitorsSection />

      {/* 7. MARKET INTELLIGENCE (CARROUSEL PLEIN ÉCRAN) */}
      <MarketIntelligenceSection />

      <StatisticsSection />

      {/* 8. COMPARISON */}
      <section className="relative z-10 py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-bold tracking-tight mb-4">Why not use <span className="text-slate-400">Generic AI?</span></h2>
            <p className="text-base md:text-lg text-slate-400">Specialized Intelligence vs General Purpose Chatbots</p>
          </motion.div>
          <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10 bg-white/[0.02]">
              <div className="text-sm font-semibold text-slate-400">Capability</div>
              <div className="text-center"><div className="text-lg font-bold text-slate-300">Generic AI</div></div>
              <div className="text-center"><div className="text-lg font-bold text-[#8b5cf6]">MakeItAds</div></div>
            </div>
            {comparisonData.map((row, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="grid grid-cols-3 gap-4 p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center">
                <div className="text-sm text-white font-medium">{row.feature}</div>
                <div className="text-center text-sm text-slate-500">{row.generic}</div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm font-bold text-emerald-400">{row.makeitads}</span>
                  <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">{row.diff}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PRICING */}
      <section id="pricing" className="relative z-10 py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">pricing</span></h2>
            <p className="text-base md:text-lg text-slate-400 mb-8">Choose the plan that fits your business needs.</p>
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm ${!isYearly ? "text-white font-semibold" : "text-slate-400"}`}>Monthly</span>
              <button onClick={() => setIsYearly(!isYearly)} className="relative h-6 w-11 rounded-full bg-white/10 transition-colors focus:outline-none">
                <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-[#8b5cf6] transition-transform ${isYearly ? "translate-x-5" : ""}`} />
              </button>
              <span className={`text-sm ${isYearly ? "text-white font-semibold" : "text-slate-400"}`}>Yearly <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">Save 20%</span></span>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pricingPlans.map((planItem, index) => {
              const isCurrentPlan = currentPlan === planItem.name.toLowerCase();
              return (
                <motion.div key={planItem.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className={`relative rounded-2xl border ${planItem.popular ? "border-[#8b5cf6] bg-[#8b5cf6]/5" : "border-white/10 bg-white/[0.02]"} p-6 flex flex-col`}>
                  {planItem.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-1 text-xs font-bold text-white">Most Popular</div>}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
                      <Check className="h-3 w-3" />Current Plan
                    </div>
                  )}
                  <div className="mb-6"><h3 className="text-xl font-bold text-white mb-2">{planItem.name}</h3><p className="text-sm text-slate-400">{planItem.description}</p></div>
                  <div className="mb-6"><div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-white">${isYearly ? planItem.price.yearly : planItem.price.monthly}</span><span className="text-slate-400">/month</span></div>{isYearly && planItem.price.monthly > 0 && <p className="text-xs text-slate-500 mt-1">Billed annually (${planItem.price.yearly * 12}/year)</p>}</div>
                  <ul className="space-y-3 mb-8 flex-1">{planItem.features.map((feature, i) => (<li key={i} className="flex items-start gap-3 text-sm text-slate-300"><Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>{feature}</span></li>))}</ul>
                  {planItem.name === "Free" ? (
                    <button disabled className={`w-full rounded-xl py-3 text-sm font-semibold text-center transition-all ${isCurrentPlan ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default" : "border border-white/10 bg-white/[0.03] text-slate-500 cursor-not-allowed"}`}>
                      {isCurrentPlan ? "Current Plan" : "Free"}
                    </button>
                  ) : planItem.name === "Enterprise" ? (
                    <Link href="/contact" className="w-full rounded-xl py-3 text-sm font-semibold text-center transition-all border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
                      {planItem.cta}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(planItem.name)}
                      disabled={loadingPlan === planItem.name || isCurrentPlan}
                      className={`w-full rounded-xl py-3 text-sm font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                        isCurrentPlan ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                        : planItem.popular ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] disabled:opacity-60 disabled:cursor-not-allowed"
                      }`}
                    >
                      {loadingPlan === planItem.name ? (<><Loader2 className="h-4 w-4 animate-spin" />Loading...</>) : isCurrentPlan ? (<><Check className="h-4 w-4" />Current Plan</>) : (planItem.cta)}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="text-center">
            <button onClick={handlePricingCta} className="inline-flex items-center gap-2 text-sm font-bold text-[#8b5cf6] hover:text-white transition-colors border-b border-[#8b5cf6]/50 hover:border-white pb-1">
              {getCTAText("pricing", !!user)} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 10. SUCCESS STORIES */}
      <section id="success-stories" className="relative z-10 py-16 md:py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#6366f1]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How businesses are growing with <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">MakeItAds</span></h2>
            <p className="text-base md:text-lg text-slate-400">Real stories from founders and marketers who stopped guessing.</p>
          </motion.div>
          
          <ReviewsCarousel />
        </div>
      </section>

      {/* 11. FAQ */}
      <section id="faq" className="relative z-10 py-16 md:py-24 px-6 bg-[#080810]/50">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Frequently asked <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">questions</span></h2>
            <p className="text-base md:text-lg text-slate-400">Everything you need to know about MakeItAds</p>
          </motion.div>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors">
                  <span className="text-base font-semibold text-white pr-4">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: "auto", opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }} 
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="relative z-10 py-24 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/images/final-cta-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4 }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#080810]/90 via-[#080810]/70 to-[#000000]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-6">Stop making decisions{" "}<span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">in the dark.</span></h2>
            <p className="text-base md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto">Get market intelligence, competitor insights and growth strategies in one platform.</p>
            <button 
              onClick={handleFinalCta}
              className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold text-white shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)] hover:bg-[#5558e6] transition-all hover:scale-105"
            >
              {getCTAText("finalCta", !!user)} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}