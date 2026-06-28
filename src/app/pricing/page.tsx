"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Zap, Crown, Building2, Sparkles, ArrowRight, Loader2, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { usePlan } from "@/hooks/usePlan";

// IMPORTS DES COMPOSANTS GLOBAUX
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

// ======================================================
// DATA - PLANS DÉTAILLÉS
// ======================================================

const pricingPlans = [
  {
    name: "Free",
    key: "free",
    icon: Sparkles,
    price: { monthly: 0, yearly: 0 },
    color: "from-slate-500 to-slate-600",
    borderColor: "border-white/10",
    bg: "bg-[#0a0a14]",
    description: "Perfect for testing the waters and exploring basic features.",
    features: [
      "1 AI-generated strategy per month",
      "Basic market analysis & trends",
      "Community forum access",
      "Email support (48h response time)",
      "Dashboard access with limited features",
      "Basic competitor overview",
      "Standard PDF reports",
      "Access to free templates library",
    ],
    cta: "Current plan",
    popular: false,
  },
  {
    name: "Pro",
    key: "pro",
    icon: Zap,
    price: { monthly: 29, yearly: 23 },
    color: "from-[#6366f1] to-[#8b5cf6]",
    borderColor: "border-[#6366f1]/40",
    bg: "bg-gradient-to-br from-[#6366f1]/8 to-[#8b5cf6]/4",
    description: "For growing businesses ready to scale their marketing efforts.",
    features: [
      "Everything in Free plan",
      "10 AI-generated strategies per month",
      "Advanced competitor intelligence",
      "Real-time trend analysis & alerts",
      "SWOT analysis for your business",
      "Audience insights & segmentation",
      "Priority email support (24h response)",
      "Advanced PDF reports with branding",
      "Competitor ad spy tool",
      "Market opportunity detection",
      "Basic API access (1000 calls/month)",
      "Export strategies to CSV/PDF",
      "Custom strategy templates",
      "Performance tracking dashboard",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Premium",
    key: "premium",
    icon: Crown,
    price: { monthly: 59, yearly: 47 },
    color: "from-violet-500 to-fuchsia-500",
    borderColor: "border-violet-500/30",
    bg: "bg-[#0a0a14]",
    description: "For serious marketers who need unlimited power and insights.",
    features: [
      "Everything in Pro plan",
      "Unlimited AI-generated strategies",
      "Predictive trend forecasting",
      "Historical market intelligence (5 years)",
      "Market share analysis & estimation",
      "Traffic estimation tools",
      "Dedicated account manager",
      "Priority phone & email support (1h response)",
      "White-label PDF reports",
      "Advanced API access (10,000 calls/month)",
      "Real-time competitor tracking",
      "Multi-channel campaign analysis",
      "Custom AI model training",
      "Advanced audience segmentation",
      "A/B testing recommendations",
      "ROI optimization engine",
      "Integration with 50+ marketing tools",
      "Custom strategy workflows",
    ],
    cta: "Go Premium",
    popular: false,
  },
  {
    name: "Enterprise",
    key: "enterprise",
    icon: Building2,
    price: { monthly: 149, yearly: 119 },
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/30",
    bg: "bg-[#0a0a14]",
    description: "For agencies and large teams requiring full customization.",
    features: [
      "Everything in Premium plan",
      "Multi-brand management (unlimited)",
      "Team collaboration (up to 25 users)",
      "Custom AI model training on your data",
      "Dedicated account manager & CSM",
      "SLA guarantee (99.9% uptime)",
      "24/7 priority support with phone",
      "Custom integrations & API",
      "Unlimited API calls",
      "On-premise deployment option",
      "Advanced security & compliance",
      "Custom reporting & analytics",
      "White-label solution",
      "Training sessions for your team",
      "Quarterly business reviews",
      "Custom feature development",
      "Priority feature requests",
      "Dedicated infrastructure",
    ],
    cta: "Book a call",
    popular: false,
  },
];

// ======================================================
// DATA - TABLEAU COMPARATIF
// ======================================================

const comparisonCategories = [
  {
    category: "AI Strategies",
    features: [
      { name: "AI-generated strategies", free: "1/month", pro: "10/month", premium: "Unlimited", enterprise: "Unlimited" },
      { name: "Strategy templates", free: "5 basic", pro: "25 advanced", premium: "100+ custom", enterprise: "Unlimited custom" },
      { name: "Custom AI training", free: false, pro: false, premium: true, enterprise: true },
      { name: "Strategy export (PDF/CSV)", free: "PDF only", pro: "PDF + CSV", premium: "All formats", enterprise: "All formats + API" },
    ],
  },
  {
    category: "Market Intelligence",
    features: [
      { name: "Market analysis", free: "Basic", pro: "Advanced", premium: "Predictive", enterprise: "Custom models" },
      { name: "Trend detection", free: "Weekly", pro: "Daily", premium: "Real-time", enterprise: "Real-time + alerts" },
      { name: "Historical data", free: "30 days", pro: "1 year", premium: "5 years", enterprise: "Unlimited" },
      { name: "Market share analysis", free: false, pro: false, premium: true, enterprise: true },
      { name: "Traffic estimation", free: false, pro: false, premium: true, enterprise: true },
      { name: "Opportunity detection", free: false, pro: true, premium: true, enterprise: true },
    ],
  },
  {
    category: "Competitor Intelligence",
    features: [
      { name: "Competitor overview", free: "3 competitors", pro: "10 competitors", premium: "50 competitors", enterprise: "Unlimited" },
      { name: "Ad spy tool", free: false, pro: true, premium: true, enterprise: true },
      { name: "Real-time tracking", free: false, pro: false, premium: true, enterprise: true },
      { name: "Competitor alerts", free: false, pro: false, premium: true, enterprise: true },
      { name: "Multi-channel analysis", free: false, pro: false, premium: true, enterprise: true },
    ],
  },
  {
    category: "Reporting & Analytics",
    features: [
      { name: "PDF reports", free: "Basic", pro: "Branded", premium: "White-label", enterprise: "Custom" },
      { name: "Performance dashboard", free: "Limited", pro: "Full", premium: "Advanced", enterprise: "Custom" },
      { name: "ROI tracking", free: false, pro: "Basic", premium: "Advanced", enterprise: "Custom" },
      { name: "A/B testing recommendations", free: false, pro: false, premium: true, enterprise: true },
      { name: "Custom reports", free: false, pro: false, premium: true, enterprise: true },
    ],
  },
  {
    category: "API & Integrations",
    features: [
      { name: "API access", free: false, pro: "1,000 calls/mo", premium: "10,000 calls/mo", enterprise: "Unlimited" },
      { name: "Webhook support", free: false, pro: false, premium: true, enterprise: true },
      { name: "Third-party integrations", free: "5 tools", pro: "20 tools", premium: "50+ tools", enterprise: "Custom" },
      { name: "Custom integrations", free: false, pro: false, premium: false, enterprise: true },
    ],
  },
  {
    category: "Support & Services",
    features: [
      { name: "Email support", free: "48h", pro: "24h", premium: "1h", enterprise: "1h" },
      { name: "Phone support", free: false, pro: false, premium: true, enterprise: "24/7" },
      { name: "Dedicated account manager", free: false, pro: false, premium: true, enterprise: true },
      { name: "Training sessions", free: false, pro: false, premium: "1 session", enterprise: "Unlimited" },
      { name: "SLA guarantee", free: false, pro: false, premium: false, enterprise: "99.9%" },
      { name: "On-premise deployment", free: false, pro: false, premium: false, enterprise: true },
    ],
  },
  {
    category: "Team & Collaboration",
    features: [
      { name: "User accounts", free: "1", pro: "1", premium: "5", enterprise: "25" },
      { name: "Multi-brand management", free: false, pro: false, premium: "3 brands", enterprise: "Unlimited" },
      { name: "Team collaboration", free: false, pro: false, premium: true, enterprise: true },
      { name: "Role-based permissions", free: false, pro: false, premium: true, enterprise: true },
    ],
  },
];

// ======================================================
// DATA - FAQ
// ======================================================

const faqData = [
  { question: "How accurate are the AI recommendations?", answer: "Our AI analyzes real-time market data with an average accuracy rate of 87%. We continuously train our models on the latest market trends and competitor data to ensure you get the most relevant insights." },
  { question: "Can I change my plan at any time?", answer: "Absolutely! You can upgrade or downgrade your plan at any time from your billing dashboard. Changes take effect immediately, and we'll prorate any charges." },
  { question: "Do I need marketing experience to use MakeItAds?", answer: "Not at all! MakeItAds is designed for founders and business owners at any level. Our AI handles the complex analysis and provides actionable recommendations in plain language." },
  { question: "Can I analyze multiple businesses?", answer: "Yes! Premium plans allow managing up to 3 business profiles, and Enterprise plans support unlimited brands. Each profile gets its own strategies, competitor tracking, and market analysis." },
  { question: "How often is market data updated?", answer: "Free plans get weekly updates, Pro plans get daily updates, and Premium/Enterprise plans get real-time data feeds. Enterprise customers can also request custom data refresh rates." },
  { question: "Is there a free trial for paid plans?", answer: "We offer a 14-day free trial for Pro and Premium plans. You can explore all features without commitment. Enterprise plans include a custom demo and proof-of-concept period." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit cards (Visa, Mastercard, American Express) via Stripe. Enterprise customers can also pay via invoice with NET-30 terms." },
  { question: "Can I cancel my subscription anytime?", answer: "Yes, you can cancel your subscription at any time from your billing dashboard. Your access will continue until the end of your current billing period." },
];

// ======================================================
// PAGE PRICING
// ======================================================

export default function PricingPage() {
  const { user } = useSession();
  const { plan, loading: planLoading } = usePlan();
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Récupérer le plan actuel de l'utilisateur
  const currentPlan = plan?.type?.toLowerCase() || "free";

  // Handler pour upgrade vers un plan payant (Pro/Premium)
  const handleUpgrade = async (planName: string) => {
    if (!user) {
      // Si non connecté, rediriger vers login
      window.location.href = `/auth/login?redirect=/pricing&plan=${planName}`;
      return;
    }

    setLoadingPlan(planName);
    try {
      const billingCycle = isYearly ? 'yearly' : 'monthly';
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planName, 
          billingCycle, 
          userId: user.id, 
          userEmail: user.email 
        }),
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

  // Fonction pour afficher les valeurs dans le tableau comparatif
  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-slate-600 mx-auto" />
      );
    }
    return <span className="text-sm text-slate-300">{value}</span>;
  };

  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      {/* NAVBAR GLOBALE */}
      <GlobalNavbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </p>

            {/* Toggle Monthly/Yearly */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${!isYearly ? "text-white font-semibold" : "text-slate-400"}`}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)} 
                className="relative h-6 w-11 rounded-full bg-white/10 transition-colors focus:outline-none"
              >
                <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-[#8b5cf6] transition-transform ${isYearly ? "translate-x-5" : ""}`} />
              </button>
              <span className={`text-sm ${isYearly ? "text-white font-semibold" : "text-slate-400"}`}>
                Yearly <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">Save 20%</span>
              </span>
            </div>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentPlan === plan.key;

              return (
                <motion.div
                  key={plan.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-2xl border ${plan.popular ? "border-[#8b5cf6] bg-[#8b5cf6]/5" : `${plan.borderColor} ${plan.bg}`} p-6 flex flex-col`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg shadow-[#6366f1]/25">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Badge "Current Plan" */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Current Plan
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color} mb-4 shadow-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">${isYearly ? plan.price.yearly : plan.price.monthly}</span>
                      <span className="text-slate-400">/month</span>
                    </div>
                    {isYearly && plan.price.monthly > 0 && (
                      <p className="text-xs text-slate-500 mt-1">Billed annually (${plan.price.yearly * 12}/year)</p>
                    )}
                  </div>

                  {/* Boutons dynamiques selon le plan */}
                  {plan.name === "Free" ? (
                    <button 
                      disabled
                      className={`w-full rounded-xl py-3 text-sm font-semibold text-center transition-all mb-6 ${
                        isCurrentPlan 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                          : "border border-white/10 bg-white/[0.03] text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {isCurrentPlan ? "Current Plan" : "Free"}
                    </button>
                  ) : plan.name === "Enterprise" ? (
                    <Link 
                      href="/contact" 
                      className="w-full rounded-xl py-3 text-sm font-semibold text-center transition-all border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] mb-6 block"
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.name)}
                      disabled={loadingPlan === plan.name || isCurrentPlan}
                      className={`w-full rounded-xl py-3 text-sm font-semibold text-center transition-all flex items-center justify-center gap-2 mb-6 ${
                        isCurrentPlan
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                          : plan.popular
                          ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                          : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] disabled:opacity-60 disabled:cursor-not-allowed"
                      }`}
                    >
                      {loadingPlan === plan.name ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : isCurrentPlan ? (
                        <>
                          <Check className="h-4 w-4" />
                          Current Plan
                        </>
                      ) : (
                        plan.cta
                      )}
                    </button>
                  )}

                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className={`h-5 w-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* TABLEAU COMPARATIF */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Compare all <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">features</span>
              </h2>
              <p className="text-base md:text-lg text-slate-400">See exactly what you get with each plan</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0a0a14] overflow-hidden">
              {/* Header du tableau */}
              <div className="grid grid-cols-5 gap-4 p-6 border-b border-white/10 bg-white/[0.02]">
                <div className="text-sm font-semibold text-slate-400">Feature</div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">Free</div>
                  <div className="text-xs text-slate-500">$0/mo</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#6366f1]">Pro</div>
                  <div className="text-xs text-slate-500">${isYearly ? '23' : '29'}/mo</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-violet-400">Premium</div>
                  <div className="text-xs text-slate-500">${isYearly ? '47' : '59'}/mo</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-400">Enterprise</div>
                  <div className="text-xs text-slate-500">${isYearly ? '119' : '149'}/mo</div>
                </div>
              </div>

              {/* Catégories et fonctionnalités */}
              {comparisonCategories.map((category, catIndex) => (
                <div key={catIndex} className="border-b border-white/5 last:border-b-0">
                  {/* Titre de catégorie */}
                  <div className="px-6 py-4 bg-white/[0.01] border-b border-white/5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{category.category}</h3>
                  </div>
                  
                  {/* Fonctionnalités */}
                  {category.features.map((feature, featIndex) => (
                    <motion.div 
                      key={featIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: featIndex * 0.05 }}
                      className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center"
                    >
                      <div className="text-sm text-slate-300 font-medium">{feature.name}</div>
                      <div className="text-center">{renderValue(feature.free)}</div>
                      <div className="text-center">{renderValue(feature.pro)}</div>
                      <div className="text-center">{renderValue(feature.premium)}</div>
                      <div className="text-center">{renderValue(feature.enterprise)}</div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Frequently asked <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">questions</span>
              </h2>
              <p className="text-base md:text-lg text-slate-400">Everything you need to know about MakeItAds</p>
            </div>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-base font-semibold text-white">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA FINAL */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="rounded-3xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to scale your business?</h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                Join thousands of marketers using MakeItAds to dominate their niche.
              </p>
              <button 
                onClick={() => handleUpgrade("Pro")}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.6)] transition-all hover:scale-105"
              >
                Get Started with Pro <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FOOTER GLOBAL */}
      <GlobalFooter />
    </main>
  );
}