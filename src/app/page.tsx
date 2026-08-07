"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  X,
  ChevronDown,
  Loader2,
  Clock,
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Zap,
  Users,
  DollarSign,
  Compass,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { SiShopify, SiStripe, SiMeta, SiGoogle, SiTiktok, SiHubspot } from "react-icons/si";

import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { useSession } from "@/hooks/useSession";
import { usePlan } from "@/hooks/usePlan";
import HeroSection from "@/components/HeroSection";
import CompetitorsSection from "@/components/CompetitorsSection";
import CommunitySection from "@/components/CommunitySection";
import PremiumStories from "@/components/PremiumStories";
import { getCTAText, getCTAHref } from "@/config/cta.config";
import { blogPosts } from "@/data/blogPosts";

// ======================================================
// COMPOSANT : BEFORE / AFTER SECTION
// ======================================================

const strategyBadges = [
  { label: "Strategy Generated", icon: Sparkles, color: "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20" },
  { label: "Audience Identified", icon: Users, color: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20" },
  { label: "Budget Optimized", icon: DollarSign, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { label: "Competitors Analyzed", icon: Target, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { label: "Growth Ready", icon: TrendingUp, color: "bg-[#38BDF8]/10 text-[#0284C7] border-[#38BDF8]/20" },
];

const strategyItems = [
  { icon: Users, label: "Target Audience", value: "Women 25-40, Urban, Premium", color: "text-[#6366F1]" },
  { icon: Compass, label: "Marketing Angle", value: "Aspirational lifestyle + social proof", color: "text-[#8B5CF6]" },
  { icon: DollarSign, label: "Recommended Budget", value: "$2,500/mo (Meta 60%, Google 40%)", color: "text-emerald-600" },
  { icon: BarChart3, label: "Expected Performance", value: "+340% ROAS in 90 days", color: "text-[#0284C7]" },
  { icon: Calendar, label: "Content Calendar", value: "12 posts + 4 ad variations / month", color: "text-[#8B5CF6]" },
];

// ✅ CORRECTION : Ajout de "as const" pour satisfaire le typage strict de Framer Motion
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
} as const;

function BeforeAfterSection() {
  return (
    <section className="relative z-10 py-20 md:py-32 px-4 sm:px-6 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.1] text-[#0F172A] mb-4 sm:mb-6">
            See What Changes With{" "}
            <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">MakeItAds</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed">One product photo becomes a complete marketing strategy in seconds.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {/* COLONNE GAUCHE : Without */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="relative">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="h-2 w-2 rounded-full bg-[#94A3B8]" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#64748B]">Without MakeItAds</span>
              </div>
              <div className="rounded-[28px] bg-[#F8FAFC] border border-[#E5E7EB] p-6 sm:p-8 shadow-sm">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#E5E7EB] mb-5 sm:mb-6">
                  <Image src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop" alt="Product" fill className="object-cover opacity-80" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC]/60 to-transparent" />
                </div>
                <div className="space-y-3 mb-5">
                  <div className="h-5 w-3/4 rounded-md bg-[#E5E7EB]" />
                  <div className="h-3 w-full rounded-md bg-[#E5E7EB]" />
                  <div className="h-3 w-5/6 rounded-md bg-[#E5E7EB]" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-[#E5E7EB] text-[11px] font-medium text-[#94A3B8]">No targeting</span>
                  <span className="px-3 py-1.5 rounded-full bg-[#E5E7EB] text-[11px] font-medium text-[#94A3B8]">No channels</span>
                  <span className="px-3 py-1.5 rounded-full bg-[#E5E7EB] text-[11px] font-medium text-[#94A3B8]">No strategy</span>
                </div>
                <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-2 text-[#94A3B8]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#94A3B8]" />
                    <p className="text-xs sm:text-sm font-medium">Waiting for a strategy...</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* COLONNE DROITE : With */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }} className="relative group">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="h-2 w-2 rounded-full bg-[#6366F1]" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#6366F1]">With MakeItAds</span>
            </div>
            <motion.div whileHover={{ y: -4, transition: { duration: 0.3 } }} className="rounded-[28px] bg-white border border-[#6366F1]/10 p-6 sm:p-8 shadow-[0_8px_40px_-12px_rgba(99,102,241,0.15)] group-hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.25)] transition-shadow duration-500">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F8FAFC] mb-5 sm:mb-6">
                <Image src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop" alt="Product with strategy" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                  <Zap className="h-3.5 w-3.5 text-[#6366F1]" />
                  <span className="text-xs font-bold text-[#0F172A]">Strategy Score: 94</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-[#6366F1]" />
                      <span className="text-xs font-bold text-[#0F172A]">Complete Strategy Ready</span>
                    </div>
                    <p className="text-[11px] text-[#475569]">5 platforms • 12 campaigns • 90-day roadmap</p>
                  </div>
                </div>
              </div>

              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="space-y-3 mb-5 sm:mb-6">
                {strategyItems.map((item, i) => (
                  <motion.div key={i} variants={itemVariants} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] group-hover:bg-[#EEF2FF] transition-colors duration-200">
                    <div className={`flex-shrink-0 ${item.color}`}><item.icon className="h-4 w-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">{item.label}</p>
                      <p className="text-xs sm:text-sm font-semibold text-[#0F172A] truncate">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                {strategyBadges.map((badge, i) => (
                  <motion.span key={i} variants={itemVariants} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] sm:text-[11px] font-semibold ${badge.color}`}>
                    <badge.icon className="h-3 w-3" />
                    {badge.label}
                  </motion.span>
                ))}
              </motion.div>

              <div className="pt-5 sm:pt-6 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <p className="text-xs sm:text-sm font-semibold text-[#0F172A]">Ready to launch</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6366F1]">
                    <span className="text-xs font-bold">View strategy</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// COMPOSANT : PRICING CARD PREVIEW (Réutilisable)
// ======================================================

function PricingCardPreview({ plan, isCurrentPlan, isYearly }: { plan: any; isCurrentPlan: boolean; isYearly: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative group rounded-[28px] border p-6 sm:p-8 flex flex-col transition-all duration-300 h-full ${
        plan.popular
          ? "border-[#6366f1]/50 bg-white shadow-[0_8px_40px_-12px_rgba(99,102,241,0.15)] hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.25)] hover:-translate-y-1"
          : "border-[#E5E7EB] bg-white shadow-sm hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1"
      } ${isCurrentPlan ? "ring-2 ring-[#6366f1] ring-offset-2" : ""}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
          Most Popular
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white flex items-center gap-1">
          <Check className="h-3 w-3" /> Current Plan
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#0F172A] mb-2">{plan.name}</h3>
        <p className="text-sm text-[#64748B]">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-[#0F172A]">${isYearly ? plan.price.yearly : plan.price.monthly}</span>
          <span className="text-[#64748B]">/month</span>
        </div>
        {isYearly && plan.price.monthly > 0 && (
          <p className="text-xs text-[#94A3B8] mt-1">Billed annually (${plan.price.yearly * 12}/year)</p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm text-[#334155]">
            <div className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-[#6366f1]/10 flex items-center justify-center">
              <Check className="h-3 w-3 text-[#6366f1]" strokeWidth={3} />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/pricing#${plan.name.toLowerCase()}`}
        className="block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 bg-[#F8FAFC] text-[#0F172A] border border-[#E5E7EB] hover:bg-[#6366f1] hover:text-white hover:border-[#6366f1] hover:shadow-lg"
      >
        Explore Everything Included
      </Link>
    </motion.div>
  );
}

// ======================================================
// DONNÉES
// ======================================================

const howItWorksSteps = [
  { number: "01", title: "Define your business DNA", description: "Tell us about your business, audience, and goals. Our AI instantly maps your market position, core value proposition, and ideal customer profile.", image: "/images/step1-transparent.png" },
  { number: "02", title: "Scan the competitive landscape", description: "We analyze competitor moves, market trends, and channel signals to uncover hidden opportunities and threats in real-time.", image: "/images/step2-transparent.png" },
  { number: "03", title: "Generate your growth blueprint", description: "Receive a comprehensive, data-backed marketing strategy with prioritized channels, personas, and actionable campaign roadmaps.", image: "/images/step3-transparent.png" },
  { number: "04", title: "Launch high-converting campaigns", description: "Turn your strategy into execution-ready ad creatives, copy, and media plans perfectly tailored for your target platforms.", image: "/images/step4-transparent.png" },
];

const painPoints = [
  { id: 1, title: "Reactive budget allocation", subtitle: "You spend on channels because they look active, not because they're effective.", image: "/images/pain-guesswork.png", borderColor: "border-red-500/30", color: "from-red-500 to-orange-500", description: "Marketing becomes a series of guesses instead of a repeatable operating system.", stat: "63%", statLabel: "of teams admit they're still guessing" },
  { id: 2, title: "Market intelligence gap", subtitle: "Every competitor move feels faster, sharper, and more informed than your own.", image: "/images/pain-competition.webp", borderColor: "border-amber-500/30", color: "from-amber-500 to-yellow-500", description: "You're reacting after the signal has already shifted.", stat: "78%", statLabel: "of leaders lose speed to better-informed competitors", glassmorphism: true },
  { id: 3, title: "Channel drift", subtitle: "Your spend gets diluted across campaigns with no shared strategic logic.", image: "/images/pain-wasted.png", borderColor: "border-rose-500/30", color: "from-rose-500 to-pink-500", description: "Performance weakens because no single system connects market intelligence to action.", stat: "$200B", statLabel: "lost annually to inefficient ad decisions" },
];

const signalCards = [
  { label: "Signal capture", title: "Market signal, not noise", description: "The platform ingests competitor movement, audience shifts and channel momentum as a unified decision layer.", accent: "from-[#6366f1] to-[#8b5cf6]" },
  { label: "Strategic synthesis", title: "Actionable direction, not generic ideas", description: "Each output is framed with rationale, priorities, budget logic and recommended campaign routes.", accent: "from-[#8b5cf6] to-[#38bdf8]" },
  { label: "Execution cadence", title: "A repeatable growth operating rhythm", description: "Your team sees what matters, why it matters and what to test next — in the same workspace.", accent: "from-[#38bdf8] to-[#6366f1]" },
];

const partnerLogos = [
  { name: "Shopify", icon: SiShopify },
  { name: "Stripe", icon: SiStripe },
  { name: "Meta", icon: SiMeta },
  { name: "Google", icon: SiGoogle },
  { name: "HubSpot", icon: SiHubspot },
  { name: "TikTok", icon: SiTiktok },
];

const pricingPlans = [
  { 
    name: "Free", 
    price: { monthly: 0, yearly: 0 }, 
    description: "Perfect for testing the waters.", 
    features: ["1 strategy per month", "Basic market analysis", "Email support", "Community Templates Library", "Basic Market Score", "Strategy History (7 days)"], 
    popular: false 
  },
  { 
    name: "Pro", 
    price: { monthly: 29, yearly: 23 }, 
    description: "For growing businesses.", 
    features: ["Everything in Free", "10 strategies/month", "Competitor intelligence", "PDF & CSV Export", "AI Opportunity Detection", "Weekly Strategy Updates"], 
    popular: true 
  },
  { 
    name: "Business", 
    price: { monthly: 59, yearly: 47 }, 
    description: "For serious marketers.", 
    features: ["Everything in Pro", "Unlimited strategies", "Real-time tracking", "API access", "Team Workspace", "Priority AI Processing", "Multi-market Intelligence"], 
    popular: false 
  },
  { 
    name: "Enterprise", 
    price: { monthly: 149, yearly: 119 }, 
    description: "For agencies & teams.", 
    features: ["Everything in Business", "Multi-brand management", "Dedicated manager", "SLA guarantee", "Dedicated Strategy Consultant", "Private AI Infrastructure", "Enterprise Security & Compliance"], 
    popular: false 
  },
];

const faqData = [
  { question: "How accurate are the recommendations?", answer: "Our AI analyzes real-time market data with an average accuracy rate of 87%." },
  { question: "Do I need marketing experience?", answer: "Not at all! MakeItAds is designed for founders and business owners at any level." },
  { question: "Can I analyze multiple businesses?", answer: "Yes! Business and Enterprise plans allow managing multiple business profiles simultaneously." },
  { question: "How often is market data updated?", answer: "Real-time for Business/Enterprise. Daily for Pro. Weekly for Free." },
  { question: "Is there a free plan?", answer: "Yes! Our Free plan gives you 1 strategy per month and full dashboard access." },
  { question: "How long does it take to generate a strategy?", answer: "Most strategies are generated in under 3 minutes. Complex analyses may take up to 10 minutes." },
  { question: "Can I cancel my subscription anytime?", answer: "Absolutely. You can cancel anytime from your dashboard. No hidden fees, no questions asked." },
  { question: "Do you offer refunds?", answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund you in full." },
  { question: "Is my business data secure?", answer: "100%. We use enterprise-grade encryption (AES-256) and never share your data with third parties. Your data is yours." },
  { question: "What makes MakeItAds different from ChatGPT?", answer: "Unlike generic AI, MakeItAds has persistent business memory, real-time market data, competitor tracking, and generates actionable execution-ready strategies." },
];

// ======================================================
// PAGE PRINCIPALE
// ======================================================

export default function LandingPage() {
  const { user } = useSession();
  const { isFree, isPro, isPremium, isEnterprise } = usePlan();
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPlan = isEnterprise ? "enterprise" : isPremium ? "business" : isPro ? "pro" : "free";

  const handleHeroCta = () => { window.location.href = getCTAHref("hero", !!user); };
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
      <PremiumStories variant="top" />

      <section className="relative z-10 py-10 border-y border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6366f1] font-semibold mb-6">Trusted integrations & platforms</p>
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
          
          <div className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
            {painPoints.map((point) => (
              <div key={point.id} className={`flex-shrink-0 w-[290px] sm:w-[320px] md:w-[380px] snap-start group relative rounded-2xl sm:rounded-3xl overflow-hidden border ${point.borderColor} bg-white shadow-lg hover:shadow-2xl hover:shadow-[#6366f1]/10 transition-all duration-500`}>
                <div className="aspect-[16/10] overflow-hidden relative">
                  <Image src={point.image} alt={point.title} fill className="object-cover transition duration-700 group-hover:scale-110" sizes="(max-width: 640px) 290px, (max-width: 768px) 320px, 380px" unoptimized />
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
        </div>
      </section>

      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 md:mb-14 max-w-4xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.1] text-left text-[#0F172A]">
              Know the <span className="text-[#8b5cf6]">market</span>. Understand the <span className="text-[#8b5cf6]">gap</span>. Build the <span className="text-[#8b5cf6]">growth move</span>.
            </h2>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-3">
            {signalCards.map((card, index) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 }} whileHover={{ y: -6 }} className="group relative rounded-[24px] border border-[#E2E8F0] bg-white p-5 sm:p-6 text-left overflow-hidden shadow-[0_10px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-shadow">
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

      <section id="how-it-works" className="relative z-10 bg-[#F8FAFC] py-20 md:py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 mb-20 md:mb-28 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] mb-6 leading-[1.1] tracking-[-0.04em]">
              From <span className="text-[#8b5cf6]">business context</span> to a complete <span className="text-[#8b5cf6]">marketing strategy</span>.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              You describe the business. MakeItAds turns your market context into a structured plan for positioning, competitors, channels, and growth priorities.
            </p>
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-6 space-y-24 md:space-y-36">
          {howItWorksSteps.map((step, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <div key={step.number} className={`grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${isReversed ? "md:[&>*:first-child]:order-2" : ""}`}>
                <motion.div initial={{ opacity: 0, x: isReversed ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: "easeOut" }} className={`text-center md:text-${isReversed ? 'right' : 'left'}`}>
                  <div className="relative inline-block">
                    <span className="text-[100px] sm:text-[140px] md:text-[180px] font-black text-[#6366f1]/5 absolute -top-8 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 select-none leading-none">{step.number}</span>
                    <div className="relative z-10 pt-10 md:pt-14">
                      <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4 sm:mb-6 leading-[1.1] tracking-[-0.03em]">{step.title}</motion.h3>
                      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} className="text-sm sm:text-base md:text-lg text-[#475569] leading-relaxed max-w-lg mx-auto md:mx-0">{step.description}</motion.p>
                    </div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} className="relative flex items-center justify-center">
                  <div className="absolute w-[80%] h-[80%] bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 rounded-full blur-3xl" />
                  <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
                    <Image src={step.image} alt={step.title} width={500} height={500} className="w-full h-full object-contain drop-shadow-2xl" priority={index === 0} unoptimized />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
        <div className="relative py-20 sm:py-28 px-6 mt-24 md:mt-32">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex justify-center">
              <Link href={user ? "/dashboard" : "/signup"} className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 sm:px-10 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105">
                Start Free <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <CompetitorsSection />
      
      <BeforeAfterSection />
      
      <CommunitySection />

      <section id="pricing" className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#F8FAFC]">
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
            </div>
          </motion.div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 px-2 md:px-0 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="flex-shrink-0 w-[85vw] md:w-auto snap-center">
                <PricingCardPreview plan={plan} isCurrentPlan={currentPlan === plan.name.toLowerCase()} isYearly={isYearly} />
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <section className="relative z-10 py-20 md:py-32 px-4 sm:px-6 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-[#111827]">
                Latest <span className="text-[#6366f1]">Marketing Intelligence</span>
              </h2>
              <p className="text-base md:text-lg text-[#64748B] max-w-2xl">Actionable frameworks, competitor breakdowns, and growth strategies to scale your business.</p>
            </div>
            <Link href="/insights" className="group inline-flex items-center gap-2 text-[#6366f1] font-semibold hover:gap-3 transition-all self-start md:self-auto">
              View all articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/insights/${post.slug}`} className="group block bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1 hover:border-[#6366f1]/30 transition-all duration-300 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#6366f1] text-xs font-bold uppercase tracking-wider">{post.category}</span>
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#6366f1] transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-[#64748B] text-sm mb-6 line-clamp-3 flex-grow">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <span className="flex items-center gap-1.5 text-xs text-[#94A3B8]"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
                  <span className="text-xs font-semibold text-[#6366f1] flex items-center gap-1 group-hover:gap-2 transition-all">Read article <ArrowRight className="h-3 w-3" /></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/insights" className="inline-flex items-center gap-2 text-[#6366f1] font-semibold">View all articles <ArrowRight className="h-4 w-4" /></Link>
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