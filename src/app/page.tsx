"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Eye,
  Check,
  X,
  ChevronDown,
  ShieldCheck,
  Loader2,
  Clock,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { SiShopify, SiStripe, SiMeta, SiGoogle, SiTiktok, SiHubspot } from "react-icons/si";

import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { useSession } from "@/hooks/useSession";
import { usePlan } from "@/hooks/usePlan";
import HeroSection from "@/components/HeroSection";
import CompetitorsSection from "@/components/CompetitorsSection";
import FounderMessage from "@/components/FounderMessage";
import CommunitySection from "@/components/CommunitySection";
import { ALL_SUCCESS_STORIES, type SuccessStory } from "@/data/successStories";
import { getCTAText, getCTAHref } from "@/config/cta.config";

// ======================================================
// HOW IT WORKS SECTION
// ======================================================

const howItWorksSteps = [
  {
    number: "01",
    title: "Tell us about your business",
    description: "Describe your company, products, audience and goals in plain English. No prompts or technical setup required.",
    image: "/images/step1-tell-business.webp",
  },
  {
    number: "02",
    title: "AI analyzes your market",
    description: "MakeItAds studies your competitors, positioning, trends and opportunities to build a complete market overview.",
    image: "/images/howitworks-step2.webp",
  },
  {
    number: "03",
    title: "Receive a complete growth strategy",
    description: "Get a structured marketing plan including positioning, customer personas, acquisition channels and actionable recommendations.",
    image: "/images/step3-growth-strategy.webp",
  },
  {
    number: "04",
    title: "Turn insights into campaigns",
    description: "Transform your strategy into marketing campaigns, content ideas and creative briefs ready to execute.",
    image: "/images/step4-launch-campaigns.webp",
  },
];

function HowItWorksSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section id="how-it-works" className="relative z-10 bg-[#080810]">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            From Business Idea to{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
              Growth Strategy
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Describe your business once. MakeItAds takes care of the research, strategy and execution.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto">
        {howItWorksSteps.map((step, index) => (
          <div key={step.number} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative min-h-[70vh] lg:min-h-screen flex items-center py-16 lg:py-20 px-4 sm:px-6"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-[#080810]/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/50 to-transparent" />
              </div>

              <div className="relative z-10 w-full max-w-5xl mx-auto">
                <div className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className={`text-center md:text-left ${index % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
                    <div className="relative">
                      <span className="text-[80px] sm:text-[120px] md:text-[160px] font-bold text-white/20 absolute -top-4 -left-2 select-none leading-none">
                        {step.number}
                      </span>
                      
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight relative z-10 pt-8 sm:pt-12"
                      >
                        {step.title}
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed relative z-10"
                      >
                        {step.description}
                      </motion.p>
                    </div>
                  </div>

                  <div className={`hidden md:block ${index % 2 === 1 ? "md:order-1" : "md:order-2"}`} />
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="relative py-20 sm:py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080810] via-[#0f0f1a] to-[#080810]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <Link
              href={isLoggedIn ? "/dashboard" : "/signup"}
              className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 sm:px-10 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105"
            >
              Start Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// PAIN POINTS CAROUSEL
// ======================================================

const painPoints = [
  { id: 1, title: "Guesswork", subtitle: "You don't know which channel deserves your budget.", image: "/images/pain-guesswork.png", borderColor: "border-red-500/30", color: "from-red-500 to-orange-500", description: "Throwing money at Facebook, Google, TikTok – hoping something sticks.", stat: "63%", statLabel: "of marketers admit they're guessing" },
  { id: 2, title: "Blind Competition", subtitle: "Your competitors move faster because they understand the market better.", image: "/images/pain-competition.webp", borderColor: "border-amber-500/30", color: "from-amber-500 to-yellow-500", description: "While you're guessing, they're scaling with data you don't have.", stat: "78%", statLabel: "lose to competitors with better data", glassmorphism: true },
  { id: 3, title: "Wasted Spending", subtitle: "Money gets spent on campaigns without clear reasoning.", image: "/images/pain-wasted.png", borderColor: "border-rose-500/30", color: "from-rose-500 to-pink-500", description: "Up to 70% of ad budgets are wasted on channels that don't convert.", stat: "$200B", statLabel: "wasted annually on bad ads" },
];

function PainPointsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 340, behavior: "smooth" });
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
      {painPoints.map((point) => (
        <div
          key={point.id}
          className={`flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] snap-start group relative rounded-2xl sm:rounded-3xl overflow-hidden border ${point.borderColor} bg-[#0f0f1a] shadow-lg hover:shadow-2xl hover:shadow-[#6366f1]/10 transition-all duration-500`}
        >
          <div className="aspect-[16/10] overflow-hidden relative">
            <Image 
              src={point.image} 
              alt={point.title} 
              fill 
              className="object-cover transition duration-700 group-hover:scale-110" 
              sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 380px" 
            />
            
            {point.glassmorphism && (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-amber-500/5 pointer-events-none" />
                <div className="absolute inset-0 border border-white/10 pointer-events-none" />
              </>
            )}
          </div>
          <div className="p-5 sm:p-6 space-y-2 sm:space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-white">{point.title}</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{point.subtitle}</p>
            <p className="text-[10px] sm:text-xs text-slate-500 italic">{point.description}</p>
            <div className="pt-1 sm:pt-2">
              <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r ${point.color} text-white shadow-lg`}>
                {point.stat} {point.statLabel}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ======================================================
// COMPARISON SECTION
// ======================================================

type CellValue = "yes" | "no" | "partial" | "basic" | "manual" | "general" | "limited";

interface FeatureRow {
  name: string;
  makeitads: CellValue;
  chatgpt: CellValue;
  claude: CellValue;
  google: CellValue;
  meta: CellValue;
}

const comparisonData: FeatureRow[] = [
  { name: "AI understands your business", makeitads: "yes", chatgpt: "no", claude: "no", google: "no", meta: "no" },
  { name: "Competitor monitoring", makeitads: "yes", chatgpt: "no", claude: "no", google: "partial", meta: "partial" },
  { name: "Marketing strategy generation", makeitads: "yes", chatgpt: "basic", claude: "basic", google: "no", meta: "no" },
  { name: "Growth opportunities detection", makeitads: "yes", chatgpt: "no", claude: "no", google: "no", meta: "no" },
  { name: "Competitor benchmark", makeitads: "yes", chatgpt: "no", claude: "no", google: "no", meta: "no" },
  { name: "SWOT analysis", makeitads: "yes", chatgpt: "manual", claude: "manual", google: "no", meta: "no" },
  { name: "Campaign roadmap", makeitads: "yes", chatgpt: "partial", claude: "partial", google: "no", meta: "no" },
  { name: "All-in-one workspace", makeitads: "yes", chatgpt: "no", claude: "no", google: "no", meta: "no" },
  { name: "Designed for businesses", makeitads: "yes", chatgpt: "general", claude: "general", google: "general", meta: "general" },
  { name: "Real market intelligence", makeitads: "yes", chatgpt: "limited", claude: "limited", google: "limited", meta: "limited" },
];

const tools = [
  { key: "makeitads", name: "MakeItAds", isPrimary: true },
  { key: "chatgpt", name: "ChatGPT", isPrimary: false },
  { key: "claude", name: "Claude", isPrimary: false },
  { key: "google", name: "Google Trends", isPrimary: false },
  { key: "meta", name: "Meta Ads Library", isPrimary: false },
];

function CellValueRenderer({ value, isPrimary }: { value: CellValue; isPrimary: boolean }) {
  if (value === "yes") {
    return (
      <div className={`flex items-center justify-center ${isPrimary ? "h-8 w-8 rounded-full bg-emerald-500/20" : ""}`}>
        <Check className={`h-4 w-4 sm:h-5 sm:w-5 ${isPrimary ? "text-emerald-400" : "text-emerald-400"}`} strokeWidth={2.5} />
      </div>
    );
  }
  if (value === "no") {
    return (
      <div className="flex items-center justify-center">
        <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" strokeWidth={2.5} />
      </div>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-amber-400">
        Partial
      </span>
    );
  }
  if (value === "basic" || value === "manual") {
    return (
      <span className="inline-flex items-center rounded-md border border-slate-500/30 bg-slate-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-slate-400">
        {value === "basic" ? "Basic" : "Manual"}
      </span>
    );
  }
  if (value === "general" || value === "limited") {
    return (
      <span className="text-[10px] sm:text-xs text-slate-500 capitalize">{value}</span>
    );
  }
  return null;
}

function ComparisonSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative z-10 py-20 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080810] via-[#0a0a14] to-[#080810]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6366f1]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20 max-w-4xl mx-auto px-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 px-4 py-1.5 mb-4 sm:mb-6">
            <div className="h-2 w-2 rounded-full bg-[#6366f1] animate-pulse" />
            <span className="text-xs font-semibold text-[#a5b4fc] uppercase tracking-wider">
              Why MakeItAds
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-white leading-tight">
            Why businesses choose MakeItAds over{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
              traditional tools
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Everything your business needs in one intelligent platform instead of switching between disconnected tools.
          </p>
        </motion.div>

        {/* DESKTOP TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block rounded-2xl border border-white/10 bg-[#0a0a14]/60 backdrop-blur-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[280px]">
                    Features
                  </th>
                  {tools.map((tool) => (
                    <th
                      key={tool.key}
                      className={`px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider ${
                        tool.isPrimary
                          ? "text-[#a5b4fc] bg-[#6366f1]/5 border-l border-r border-[#6366f1]/20"
                          : "text-slate-400"
                      }`}
                    >
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <motion.tr
                    key={row.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-center bg-[#6366f1]/5 border-l border-r border-[#6366f1]/20">
                      <CellValueRenderer value={row.makeitads} isPrimary={true} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CellValueRenderer value={row.chatgpt} isPrimary={false} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CellValueRenderer value={row.claude} isPrimary={false} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CellValueRenderer value={row.google} isPrimary={false} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CellValueRenderer value={row.meta} isPrimary={false} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* MOBILE CARDS */}
        <div className="lg:hidden space-y-3 sm:space-y-4">
          {comparisonData.map((row, index) => (
            <motion.div
              key={row.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0a0a14]/60 backdrop-blur-xl p-4 sm:p-5"
            >
              <h3 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
                {row.name}
              </h3>
              <div className="space-y-2.5">
                {tools.map((tool) => {
                  const value = row[tool.key as keyof FeatureRow] as CellValue;
                  return (
                    <div
                      key={tool.key}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                        tool.isPrimary
                          ? "bg-[#6366f1]/10 border border-[#6366f1]/30"
                          : "bg-white/[0.02] border border-white/5"
                      }`}
                    >
                      <span className={`text-xs sm:text-sm font-medium ${
                        tool.isPrimary ? "text-[#a5b4fc]" : "text-slate-300"
                      }`}>
                        {tool.name}
                      </span>
                      <CellValueRenderer value={value} isPrimary={tool.isPrimary} />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 sm:mt-20 md:mt-24 text-center max-w-3xl mx-auto px-4"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Stop using five tools to answer{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
              one business question.
            </span>
          </h3>
          <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8 leading-relaxed">
            Join thousands of businesses using one platform instead of juggling disconnected marketing tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href={isLoggedIn ? "/dashboard" : "/signup"}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-6 sm:px-8 py-3 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105 w-full sm:w-auto"
            >
              Start Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/signup"}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 sm:px-8 py-3 text-sm font-bold text-white hover:bg-white/[0.06] transition-all w-full sm:w-auto"
            >
              See Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ======================================================
// DATA & UTILS
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

const LogoCarousel = () => (
  <div className="relative overflow-hidden">
    <div className="flex animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
      {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, index) => {
        const Icon = logo.icon;
        return (
          <div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center">
            <Icon className="w-10 h-10 text-slate-500 hover:text-white transition-colors duration-300" />
          </div>
        );
      })}
    </div>
    <style jsx>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }`}</style>
  </div>
);

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
        el.scrollBy({ left: 340, behavior: "smooth" });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
      {successStories.map((story) => (
        <div
          key={story.id}
          className="flex-shrink-0 w-[320px] md:w-[380px] snap-start group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f1a] hover:border-[#6366f1]/50 transition-all duration-500"
        >
          <div className="relative w-full h-[500px] md:h-[550px]">
            <Image
              src={story.image}
              alt={story.name}
              fill
              className="object-cover object-top transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 320px, 380px"
              priority
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.60) 30%, rgba(0,0,0,0.20) 60%, rgba(0,0,0,0) 100%)' }} />
          </div>

          {story.isNew && (
            <div className="absolute top-4 right-4 z-20">
              <span className="px-3 py-1 rounded-full bg-[#6366f1]/90 backdrop-blur-md text-xs font-bold text-white border border-[#6366f1]/50">New</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-white/80">{story.countryFlag} {story.country}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/80">{story.industry}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{story.name}</h3>
              <p className="text-sm text-white/70">{story.role} • {story.company}</p>
            </div>

            <div className="mb-4">
              <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">{story.metric}</p>
              <p className="text-xs text-white/60 mt-1">{story.timeToResult}</p>
            </div>

            <blockquote className="mb-4">
              <p className="text-sm text-white/90 leading-relaxed italic">"{story.quote}"</p>
            </blockquote>

            <div className="flex flex-wrap gap-2">
              {story.modules.slice(0, 2).map((mod, i) => (
                <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm text-white/90 border border-white/20 font-medium">{mod}</span>
              ))}
            </div>
          </div>
        </div>
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
      // 🔒 Redirection vers signup si l'utilisateur n'est pas connecté
      window.location.href = `/signup?redirect=/dashboard/billing&plan=${planName}`;
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
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#6366f1]/15 rounded-full blur-[120px] opacity-80" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#8b5cf6]/10 rounded-full blur-[100px] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]" style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.85) 70%, transparent 100%)" }} />
      </div>

      <GlobalNavbar />

      <HeroSection />

      <section className="relative z-10 py-10 border-y border-white/10 bg-[#0a0a14]/80">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6366f1] font-semibold mb-6">Trusted integrations & platforms</p>
          <LogoCarousel />
        </div>
      </section>

      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-16 max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Most businesses don't fail because they lack effort.{" "}
              <span className="font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                They fail because they're making decisions without market intelligence.
              </span>
            </h2>
          </motion.div>
          <PainPointsCarousel />
        </div>
      </section>

      {/* ✅ Passage de la prop isLoggedIn */}
      <HowItWorksSection isLoggedIn={!!user} />

      <CompetitorsSection />

      {/* ✅ Passage de la prop isLoggedIn */}
      <ComparisonSection isLoggedIn={!!user} />

      <FounderMessage />

      <CommunitySection />

      <section id="pricing" className="relative z-10 py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Simple, transparent{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">pricing</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400 mb-8">Choose the plan that fits your business needs.</p>
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className={`text-sm ${!isYearly ? "text-white font-semibold" : "text-slate-400"}`}>Monthly</span>
                <button onClick={() => setIsYearly(!isYearly)} className="relative h-6 w-11 rounded-full bg-white/10 transition-colors focus:outline-none">
                  <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-[#8b5cf6] transition-transform ${isYearly ? "translate-x-5" : ""}`} />
                </button>
                <span className={`text-sm ${isYearly ? "text-white font-semibold" : "text-slate-400"}`}>
                  Yearly <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">Save 20%</span>
                </span>
              </div>
              <Link href="/pricing" className="text-sm font-bold text-[#8b5cf6] hover:text-white transition-colors border-b border-[#8b5cf6]/50 hover:border-white pb-1">Compare all plans</Link>
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
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{planItem.name}</h3>
                    <p className="text-sm text-slate-400">{planItem.description}</p>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">${isYearly ? planItem.price.yearly : planItem.price.monthly}</span>
                      <span className="text-slate-400">/month</span>
                    </div>
                    {isYearly && planItem.price.monthly > 0 && <p className="text-xs text-slate-500 mt-1">Billed annually (${planItem.price.yearly * 12}/year)</p>}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {planItem.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {planItem.name === "Free" ? (
                    <button disabled className={`w-full rounded-xl py-3 text-sm font-semibold text-center transition-all ${isCurrentPlan ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default" : "border border-white/10 bg-white/[0.03] text-slate-500 cursor-not-allowed"}`}>
                      {isCurrentPlan ? "Current Plan" : "Free"}
                    </button>
                  ) : planItem.name === "Enterprise" ? (
                    <Link href="/contact" className="w-full rounded-xl py-3 text-sm font-semibold text-center transition-all border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">{planItem.cta}</Link>
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
        </div>
      </section>

      <section id="success-stories" className="relative z-10 py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              How businesses are growing with{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">MakeItAds</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400">Real stories from founders and marketers who stopped guessing.</p>
          </motion.div>
          <ReviewsCarousel />
        </div>
      </section>

      <section id="faq" className="relative z-10 py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Frequently asked{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">questions</span>
            </h2>
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
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
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

      <section className="relative z-10 py-24 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/images/final-cta-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4 }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#080810]/90 via-[#080810]/70 to-[#000000]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-6">
              Stop making decisions{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">in the dark.</span>
            </h2>
            <p className="text-base md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto">Get market intelligence, competitor insights and growth strategies in one platform.</p>
            <button onClick={handleFinalCta} className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold text-white shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)] hover:bg-[#5558e6] transition-all hover:scale-105">
              {getCTAText("finalCta", !!user)} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}