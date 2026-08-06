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
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { SiShopify, SiStripe, SiMeta, SiGoogle, SiTiktok, SiHubspot } from "react-icons/si";

import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { useSession } from "@/hooks/useSession";
import { usePlan } from "@/hooks/usePlan";
import HeroSection from "@/components/HeroSection";
import CompetitorsSection from "@/components/CompetitorsSection";
import FounderMessage from "@/components/FounderMessage";
import CommunitySection from "@/components/CommunitySection";
import PremiumStories from "@/components/PremiumStories"; // ✅ NOUVEAU COMPOSANT
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
    title: "Analyze the market and competitors",
    description: "MakeItAds studies your competitors, positioning, trends and opportunities to build a complete market overview for your next growth move.",
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
    <section id="how-it-works" className="relative z-10 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-left sm:text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] mb-6 leading-[1.1] tracking-[-0.04em] text-left">
            From <span className="text-[#8b5cf6]">business context</span> to a complete <span className="text-[#8b5cf6]">marketing strategy</span>.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#475569] max-w-3xl text-left leading-relaxed">
            You describe the business. MakeItAds turns your market context into a structured plan for positioning, competitors, channels and growth priorities.
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent" />
              </div>

              <div className="relative z-10 w-full max-w-5xl mx-auto">
                <div className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className={`text-center md:text-left ${index % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
                    <div className="relative">
                      <span className="text-[80px] sm:text-[120px] md:text-[160px] font-bold text-[#6366f1]/10 absolute -top-4 -left-2 select-none leading-none">
                        {step.number}
                      </span>
                      
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4 sm:mb-6 leading-[1.1] tracking-[-0.04em] relative z-10 pt-8 sm:pt-12"
                      >
                        {step.title}
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-sm sm:text-base md:text-lg text-[#475569] leading-relaxed relative z-10"
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

      <div className="relative py-20 sm:py-24 px-6 bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F8FAFC]">
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
  { id: 1, title: "Reactive budget allocation", subtitle: "You spend on channels because they look active, not because they're effective.", image: "/images/pain-guesswork.png", borderColor: "border-red-500/30", color: "from-red-500 to-orange-500", description: "Marketing becomes a series of guesses instead of a repeatable operating system.", stat: "63%", statLabel: "of teams admit they're still guessing" },
  { id: 2, title: "Market intelligence gap", subtitle: "Every competitor move feels faster, sharper, and more informed than your own.", image: "/images/pain-competition.webp", borderColor: "border-amber-500/30", color: "from-amber-500 to-yellow-500", description: "You're reacting after the signal has already shifted.", stat: "78%", statLabel: "of leaders lose speed to better-informed competitors", glassmorphism: true },
  { id: 3, title: "Channel drift", subtitle: "Your spend gets diluted across campaigns with no shared strategic logic.", image: "/images/pain-wasted.png", borderColor: "border-rose-500/30", color: "from-rose-500 to-pink-500", description: "Performance weakens because no single system connects market intelligence to action.", stat: "$200B", statLabel: "lost annually to inefficient ad decisions" },
];

function PainPointsCarousel() {
  return (
    <div
      className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
      {painPoints.map((point) => (
        <div
          key={point.id}
          className={`flex-shrink-0 w-[290px] sm:w-[320px] md:w-[380px] snap-start group relative rounded-2xl sm:rounded-3xl overflow-hidden border ${point.borderColor} bg-white shadow-lg hover:shadow-2xl hover:shadow-[#6366f1]/10 transition-all duration-500`}
        >
          <div className="aspect-[16/10] overflow-hidden relative">
            <Image 
              src={point.image} 
              alt={point.title} 
              fill 
              className="object-cover transition duration-700 group-hover:scale-110" 
              sizes="(max-width: 640px) 290px, (max-width: 768px) 320px, 380px" 
            />
            
            {point.glassmorphism && (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-amber-500/10 pointer-events-none" />
                <div className="absolute inset-0 border border-white/20 pointer-events-none" />
              </>
            )}
          </div>
          <div className="p-5 sm:p-6 space-y-2 sm:space-y-3 text-left">
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-[1.2] tracking-[-0.02em]">{point.title}</h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{point.subtitle}</p>
            <p className="text-[10px] sm:text-xs text-[#94A3B8] italic">{point.description}</p>
            <div className="pt-1 sm:pt-2">
              <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full bg-gradient-to-r ${point.color} text-white shadow-lg w-full sm:w-auto justify-center sm:justify-start`}>
                <span>{point.stat}</span>
                <span className="text-white/90 font-medium">{point.statLabel}</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ======================================================
// SIGNAL SYSTEM SECTION
// ======================================================

const signalCards = [
  {
    label: "Signal capture",
    title: "Market signal, not noise",
    description: "The platform ingests competitor movement, audience shifts and channel momentum as a unified decision layer.",
    accent: "from-[#6366f1] to-[#8b5cf6]",
  },
  {
    label: "Strategic synthesis",
    title: "Actionable direction, not generic ideas",
    description: "Each output is framed with rationale, priorities, budget logic and recommended campaign routes.",
    accent: "from-[#8b5cf6] to-[#38bdf8]",
  },
  {
    label: "Execution cadence",
    title: "A repeatable growth operating rhythm",
    description: "Your team sees what matters, why it matters and what to test next — in the same workspace.",
    accent: "from-[#38bdf8] to-[#6366f1]",
  },
];

function SignalSystemSection() {
  return (
    <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14 max-w-4xl"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.1] text-left text-[#0F172A]">
            Know the <span className="text-[#8b5cf6]">market</span>. Understand the <span className="text-[#8b5cf6]">gap</span>. Build the <span className="text-[#8b5cf6]">growth move</span>.
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {signalCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-[24px] border border-[#E2E8F0] bg-white p-5 sm:p-6 text-left overflow-hidden shadow-[0_10px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-shadow"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`} />
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[#64748B]">{card.label}</span>
                <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[10px] text-[#475569] font-medium">0{index + 1}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#0F172A] mb-3 leading-[1.2] tracking-[-0.02em]">{card.title}</h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#475569]">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
  { name: "Persistent business memory", makeitads: "yes", chatgpt: "no", claude: "no", google: "no", meta: "no" },
  { name: "Live competitor signal tracking", makeitads: "yes", chatgpt: "no", claude: "no", google: "partial", meta: "partial" },
  { name: "Execution-ready growth strategy", makeitads: "yes", chatgpt: "basic", claude: "basic", google: "no", meta: "no" },
  { name: "Opportunity detection across channels", makeitads: "yes", chatgpt: "no", claude: "no", google: "no", meta: "no" },
  { name: "Positioning benchmark against competitors", makeitads: "yes", chatgpt: "no", claude: "no", google: "no", meta: "no" },
  { name: "Structured SWOT and market framing", makeitads: "yes", chatgpt: "manual", claude: "manual", google: "no", meta: "no" },
  { name: "Campaign roadmap with rationale", makeitads: "yes", chatgpt: "partial", claude: "partial", google: "no", meta: "no" },
  { name: "Single platform for strategy + execution", makeitads: "yes", chatgpt: "no", claude: "no", google: "no", meta: "no" },
  { name: "Built for business decision-makers", makeitads: "yes", chatgpt: "general", claude: "general", google: "general", meta: "general" },
  { name: "Real market intelligence layer", makeitads: "yes", chatgpt: "limited", claude: "limited", google: "limited", meta: "limited" },
];

const tools = [
  { key: "makeitads", name: "MakeItAds", isPrimary: true },
  { key: "chatgpt", name: "Generic AI", isPrimary: false },
  { key: "claude", name: "Generic AI", isPrimary: false },
  { key: "google", name: "Search Trends", isPrimary: false },
  { key: "meta", name: "Platform Signals", isPrimary: false },
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
        <X className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBD5E1]" strokeWidth={2.5} />
      </div>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-amber-600">
        Partial
      </span>
    );
  }
  if (value === "basic" || value === "manual") {
    return (
      <span className="inline-flex items-center rounded-md border border-[#CBD5E1] bg-[#F1F5F9] px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-[#64748B]">
        {value === "basic" ? "Basic" : "Manual"}
      </span>
    );
  }
  if (value === "general" || value === "limited") {
    return (
      <span className="text-[10px] sm:text-xs text-[#94A3B8] capitalize">{value}</span>
    );
  }
  return null;
}

function ComparisonSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative z-10 py-20 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden bg-[#F8FAFC]">
      <div className="absolute inset-0 pointer-events-none">
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.04em] leading-[1.1] mb-4 sm:mb-6 text-[#0F172A] text-left sm:text-center">
            A <span className="text-[#8b5cf6]">marketing strategy engine</span> for teams that need to move faster than the market.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#475569] leading-relaxed max-w-2xl text-left sm:text-center">
            Instead of stitching together scattered tools, teams get one operating layer for market analysis, competitor tracking and campaign direction.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left px-6 py-5 text-xs font-semibold text-[#64748B] uppercase tracking-wider w-[280px]">Features</th>
                  {tools.map((tool) => (
                    <th key={tool.key} className={`px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider ${tool.isPrimary ? "text-[#6366f1] bg-[#EEF2FF] border-l border-r border-[#6366f1]/20" : "text-[#64748B]"}`}>
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <motion.tr key={row.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.03 }} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#0F172A] font-medium">{row.name}</td>
                    <td className="px-6 py-4 text-center bg-[#EEF2FF] border-l border-r border-[#6366f1]/20"><CellValueRenderer value={row.makeitads} isPrimary={true} /></td>
                    <td className="px-6 py-4 text-center"><CellValueRenderer value={row.chatgpt} isPrimary={false} /></td>
                    <td className="px-6 py-4 text-center"><CellValueRenderer value={row.claude} isPrimary={false} /></td>
                    <td className="px-6 py-4 text-center"><CellValueRenderer value={row.google} isPrimary={false} /></td>
                    <td className="px-6 py-4 text-center"><CellValueRenderer value={row.meta} isPrimary={false} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="lg:hidden space-y-3 sm:space-y-4">
          {comparisonData.map((row, index) => (
            <motion.div key={row.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.03 }} className="rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
              <h3 className="text-sm sm:text-base font-semibold text-[#0F172A] mb-3 sm:mb-4 leading-[1.2]">{row.name}</h3>
              <div className="space-y-2.5">
                {tools.map((tool) => {
                  const value = row[tool.key as keyof FeatureRow] as CellValue;
                  return (
                    <div key={tool.key} className={`flex items-center justify-between py-2 px-3 rounded-lg ${tool.isPrimary ? "bg-[#EEF2FF] border border-[#6366f1]/30" : "bg-[#F8FAFC] border border-[#F1F5F9]"}`}>
                      <span className={`text-xs sm:text-sm font-medium ${tool.isPrimary ? "text-[#6366f1]" : "text-[#0F172A]"}`}>{tool.name}</span>
                      <CellValueRenderer value={value} isPrimary={tool.isPrimary} />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-16 sm:mt-20 md:mt-24 text-center max-w-3xl mx-auto px-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A] mb-3 sm:mb-4 leading-[1.2] text-left sm:text-center">
            One workspace for building the next <span className="text-[#8b5cf6]">marketing strategy</span> with clarity.
          </h3>
          <p className="text-sm sm:text-base text-[#475569] mb-6 sm:mb-8 leading-relaxed text-left sm:text-center">
            Replace fragmented workflows with one layer for market intelligence, competitor understanding and execution-ready campaign direction.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-6 sm:px-8 py-3 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105 w-full sm:w-auto">
              Start Free <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-6 sm:px-8 py-3 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC] transition-all w-full sm:w-auto">
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
    <div className="flex animate-[scroll_15s_linear_infinite] hover:[animation-play-state:paused]">
      {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, index) => {
        const Icon = logo.icon;
        return (
          <div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center">
            <Icon className="w-10 h-10 text-[#94A3B8] hover:text-[#6366f1] transition-colors duration-300" />
          </div>
        );
      })}
    </div>
    <style jsx>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }`}</style>
  </div>
);

// ======================================================
// PAGE PRINCIPALE (LANDING PAGE COMPONENT)
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
    <main className="min-h-screen bg-[#FFFFFF] text-[#0F172A] overflow-hidden selection:bg-[#6366f1]/20 selection:text-[#0F172A]">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#6366f1]/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#8b5cf6]/5 rounded-full blur-[100px] opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px]" style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,0,0,0.15) 70%, transparent 100%)" }} />
      </div>

      <GlobalNavbar />
      <HeroSection />

      {/* ✅ SÉRIE 1 : SOCIAL PROOF STORIES (Juste après le Hero) */}
      <PremiumStories variant="top" />

      <section className="relative z-10 py-10 border-y border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6366f1] font-semibold mb-6">Trusted integrations & platforms</p>
          <LogoCarousel />
        </div>
      </section>

      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 md:mb-16 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.1] text-left text-[#0F172A]">
              Most teams are not missing ambition.
              <span className="block mt-2 text-[#8b5cf6]">
                They're missing the right <span className="text-[#8b5cf6]">market angle</span>, the right <span className="text-[#8b5cf6]">competitor signal</span>, and the right <span className="text-[#8b5cf6]">growth strategy</span>.
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-left text-sm sm:text-base md:text-lg text-[#475569] leading-relaxed">
              When the signal is fragmented, your team reacts late, spends inefficiently, and loses the speed advantage that premium growth brands need.
            </p>
          </motion.div>
          <PainPointsCarousel />
        </div>
      </section>

      <SignalSystemSection />
      <HowItWorksSection isLoggedIn={!!user} />
      <CompetitorsSection />
      <FounderMessage />
      <CommunitySection />

      <section id="pricing" className="relative z-10 py-16 md:py-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.1] mb-4 text-[#0F172A]">
              Simple, transparent{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">pricing</span>
            </h2>
            <p className="text-base md:text-lg text-[#475569] mb-8">Choose the plan that fits your business needs.</p>
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className={`text-sm ${!isYearly ? "text-[#0F172A] font-semibold" : "text-[#64748B]"}`}>Monthly</span>
                <button onClick={() => setIsYearly(!isYearly)} className="relative h-6 w-11 rounded-full bg-[#E2E8F0] transition-colors focus:outline-none">
                  <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-[#8b5cf6] transition-transform ${isYearly ? "translate-x-5" : ""}`} />
                </button>
                <span className={`text-sm ${isYearly ? "text-[#0F172A] font-semibold" : "text-[#64748B]"}`}>
                  Yearly <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-600">Save 20%</span>
                </span>
              </div>
              <Link href="/pricing" className="text-sm font-bold text-[#8b5cf6] hover:text-[#6366f1] transition-colors border-b border-[#8b5cf6]/50 hover:border-[#6366f1] pb-1">Compare all plans</Link>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pricingPlans.map((planItem, index) => {
              const isCurrentPlan = currentPlan === planItem.name.toLowerCase();
              return (
                <motion.div key={planItem.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className={`relative rounded-2xl border ${planItem.popular ? "border-[#8b5cf6] bg-[#EEF2FF]" : "border-[#E2E8F0] bg-white"} p-6 flex flex-col shadow-[0_10px_40px_rgba(15,23,42,0.08)]`}>
                  {planItem.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-1 text-xs font-bold text-white">Most Popular</div>}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
                      <Check className="h-3 w-3" />Current Plan
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2 leading-[1.2]">{planItem.name}</h3>
                    <p className="text-sm text-[#64748B]">{planItem.description}</p>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-[#0F172A]">${isYearly ? planItem.price.yearly : planItem.price.monthly}</span>
                      <span className="text-[#64748B]">/month</span>
                    </div>
                    {isYearly && planItem.price.monthly > 0 && <p className="text-xs text-[#94A3B8] mt-1">Billed annually (${planItem.price.yearly * 12}/year)</p>}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {planItem.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#475569]">
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {planItem.name === "Free" ? (
                    <button disabled className={`w-full rounded-xl py-3 text-sm font-semibold text-center transition-all ${isCurrentPlan ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 cursor-default" : "border border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed"}`}>
                      {isCurrentPlan ? "Current Plan" : "Free"}
                    </button>
                  ) : planItem.name === "Enterprise" ? (
                    <Link href="/contact" className="w-full rounded-xl py-3 text-sm font-semibold text-center transition-all border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]">{planItem.cta}</Link>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(planItem.name)}
                      disabled={loadingPlan === planItem.name || isCurrentPlan}
                      className={`w-full rounded-xl py-3 text-sm font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                        isCurrentPlan ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 cursor-default"
                        : planItem.popular ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        : "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-60 disabled:cursor-not-allowed"
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

      {/* ✅ SÉRIE 2 : SOCIAL PROOF STORIES (Remplace l'ancien carrousel en bas de page) */}
      <section id="success-stories" className="relative z-10 py-16 md:py-24 px-6 bg-[#FFFFFF]">
        <PremiumStories variant="bottom" />
      </section>

      <section id="faq" className="relative z-10 py-16 md:py-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.1] mb-4 text-[#0F172A]">
              Frequently asked{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">questions</span>
            </h2>
            <p className="text-base md:text-lg text-[#475569]">Everything you need to know about MakeItAds</p>
          </motion.div>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }} className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F8FAFC] transition-colors">
                  <span className="text-base font-semibold text-[#0F172A] pr-4 leading-[1.2]">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-[#64748B] transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-6 pb-6">
                        <p className="text-sm text-[#475569] leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 md:py-32 px-6 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#6366f1]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-6xl font-bold tracking-[-0.04em] leading-[1.1] mb-6 text-[#0F172A]">
              Stop making decisions{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">in the dark.</span>
            </h2>
            <p className="text-base md:text-xl text-[#475569] mb-12 max-w-2xl mx-auto">Get competitive intelligence, market analysis and full marketing strategy support in one workspace.</p>
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