"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, Crown, Building2, Sparkles, CreditCard, Loader2,
  Download, Shield, AlertCircle, Zap, Plus, MoreHorizontal,
  ArrowUpRight, Clock, BadgeCheck, X, FileText, Calendar,
  ExternalLink, Trash2, DollarSign
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { usePlan } from "@/hooks/usePlan";

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSession();
  const { plan, loading } = usePlan();
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"plans" | "history" | "card">("plans");

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccessMessage("Payment successful! Your plan has been upgraded.");
      setTimeout(() => setSuccessMessage(""), 5000);
    }
    if (searchParams.get('canceled') === 'true') {
      setErrorMessage("Payment canceled. No charges were made.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  }, [searchParams]);

  const handleUpgrade = async (planName: string) => {
    if (!user) return;
    setLoadingPlan(planName);
    setErrorMessage("");
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
      setErrorMessage(error.message || "An error occurred");
    } finally {
      setLoadingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-2 border-[#6366f1]/20 border-t-[#6366f1] animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-[#6366f1]" />
            </div>
          </div>
          <p className="text-slate-400 mt-4 text-sm">Loading billing...</p>
        </div>
      </div>
    );
  }

  const currentPlan = plan?.type || "free";

  const plans = [
    {
      name: "Free",
      key: "free",
      icon: Sparkles,
      price: 0,
      yearlyPrice: 0,
      color: "from-slate-500 to-slate-600",
      borderColor: "border-white/10",
      bg: "bg-[#0a0a14]",
      description: "Get started with basic features",
      features: ["1 strategy per month", "Basic market analysis", "Community access", "Email support"],
    },
    {
      name: "Pro",
      key: "pro",
      icon: Zap,
      price: 29,
      yearlyPrice: 276,
      color: "from-[#6366f1] to-[#8b5cf6]",
      borderColor: "border-[#6366f1]/40",
      bg: "bg-gradient-to-br from-[#6366f1]/8 to-[#8b5cf6]/4",
      description: "For growing businesses",
      popular: true,
      features: ["10 strategies per month", "Competitor intelligence", "Trend analysis", "SWOT analysis", "Audience insights", "Priority email support"],
    },
    {
      name: "Premium",
      key: "premium",
      icon: Crown,
      price: 59,
      yearlyPrice: 564,
      color: "from-violet-500 to-fuchsia-500",
      borderColor: "border-violet-500/30",
      bg: "bg-[#0a0a14]",
      description: "For serious marketers",
      features: ["Unlimited strategies", "Predictive trends", "Historical intelligence", "Market share analysis", "Traffic estimation", "Dedicated support"],
    },
    {
      name: "Enterprise",
      key: "enterprise",
      icon: Building2,
      price: 149,
      yearlyPrice: 1428,
      color: "from-amber-500 to-orange-500",
      borderColor: "border-amber-500/30",
      bg: "bg-[#0a0a14]",
      description: "For agencies & teams",
      features: ["Everything in Premium", "Multi-brand management", "Team collaboration", "Custom AI training", "Dedicated account manager", "SLA guarantee"],
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* MESSAGES */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-5 flex items-center gap-4"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <BadgeCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-300">Success</p>
              <p className="text-xs text-emerald-400/70">{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage("")} className="ml-auto text-emerald-400/50 hover:text-emerald-400">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-5 flex items-center gap-4"
          >
            <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-300">Error</p>
              <p className="text-xs text-red-400/70">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage("")} className="ml-auto text-red-400/50 hover:text-red-400">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-[#0f0f1a] via-[#13132a] to-[#0f0f1a] p-8"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[#6366f1]/10 via-transparent to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${plans.find(p => p.key === currentPlan)?.color || 'from-slate-500 to-slate-600'} flex items-center justify-center shadow-lg`}>
                  {(() => {
                    const Icon = plans.find(p => p.key === currentPlan)?.icon || Sparkles;
                    return <Icon className="h-6 w-6 text-white" />;
                  })()}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Current Plan</p>
                  <h1 className="text-2xl font-bold text-white capitalize">{currentPlan}</h1>
                </div>
                {currentPlan !== "free" && (
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 max-w-md">
                {currentPlan === "free" 
                  ? "Upgrade to unlock AI-powered strategies and competitor intelligence." 
                  : `You're on the ${currentPlan} plan. Manage your subscription and billing below.`}
              </p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  ${currentPlan === "free" ? "0" : plans.find(p => p.key === currentPlan)?.price || "0"}
                </span>
                <span className="text-sm text-slate-500">/month</span>
              </div>
              {currentPlan !== "free" && (
                <p className="text-xs text-slate-500 mt-1">
                  Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* TABS */}
      <div className="flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-[#0a0a14] p-1.5 w-fit">
        {[
          { key: "plans", label: "Plans", icon: Zap },
          { key: "card", label: "Payment Method", icon: CreditCard },
          { key: "history", label: "Billing History", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-white/[0.08] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        
        {/* PLANS TAB */}
        {activeTab === "plans" && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-white" : "text-slate-500"}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative h-8 w-14 rounded-full transition-all duration-300 ${isYearly ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" : "bg-white/10"}`}
              >
                <motion.div
                  animate={{ x: isYearly ? 28 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg"
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${isYearly ? "text-white" : "text-slate-500"}`}>Yearly</span>
              {isYearly && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400"
                >
                  Save 20%
                </motion.span>
              )}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {plans.map((p, index) => {
                const Icon = p.icon;
                const isCurrent = currentPlan === p.key;
                const displayPrice = isYearly && p.yearlyPrice > 0 ? Math.round(p.yearlyPrice / 12) : p.price;
                
                return (
                  <motion.div
                    key={p.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`relative rounded-2xl border ${p.borderColor} ${p.bg} p-6 flex flex-col transition-all hover:border-white/10`}
                  >
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg shadow-[#6366f1]/25">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} mb-4 shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">${displayPrice}</span>
                        <span className="text-sm text-slate-500">/mo</span>
                      </div>
                      {isYearly && p.yearlyPrice > 0 && (
                        <p className="text-xs text-slate-500 mt-1">Billed ${p.yearlyPrice}/year</p>
                      )}
                    </div>

                    <button
                      onClick={() => !isCurrent && p.key !== "free" && handleUpgrade(p.name)}
                      disabled={isCurrent || loadingPlan === p.name || p.key === "free"}
                      className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all mb-5 flex items-center justify-center gap-2 ${
                        isCurrent
                          ? "bg-white/5 text-slate-500 cursor-default"
                          : p.key === "free"
                          ? "bg-white/5 text-slate-600 cursor-default"
                          : `bg-gradient-to-r ${p.color} text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`
                      } disabled:opacity-60`}
                    >
                      {loadingPlan === p.name ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isCurrent ? (
                        <>
                          <Check className="h-4 w-4" />
                          Current Plan
                        </>
                      ) : p.key === "free" ? (
                        "Free"
                      ) : (
                        <>
                          Upgrade to {p.name}
                          <ArrowUpRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <div className="space-y-3 flex-1">
                      {p.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className={`h-5 w-5 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
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
          </motion.div>
        )}

        {/* PAYMENT METHOD TAB - SIMPLIFIÉ */}
        {activeTab === "card" && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a14] p-8">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                Payment Method
              </h2>

              {currentPlan !== "free" ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Manage your card</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Use Stripe Customer Portal to update your payment method
                  </p>
                  <button
                    onClick={() => {
                      setSuccessMessage("Stripe Portal will open in a new tab (coming soon)");
                      setTimeout(() => setSuccessMessage(""), 3000);
                    }}
                    className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
                  >
                    Open Stripe Portal
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No payment method</h3>
                  <p className="text-sm text-slate-500 mb-6">Add a payment method when you upgrade to a paid plan</p>
                  <button
                    onClick={() => setActiveTab("plans")}
                    className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
                  >
                    View Plans
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* BILLING HISTORY TAB - SIMPLIFIÉ */}
        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a14] p-8">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Billing History
              </h2>

              {currentPlan !== "free" ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No invoices yet</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Your billing history will appear here after your first payment
                  </p>
                  <button
                    onClick={() => setActiveTab("plans")}
                    className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
                  >
                    View Plans
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No invoices yet</h3>
                  <p className="text-sm text-slate-500 mb-6">Your billing history will appear here after your first payment</p>
                  <button
                    onClick={() => setActiveTab("plans")}
                    className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
                  >
                    View Plans
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER SECURITY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#38bdf8]" />
            <div>
              <p className="text-sm font-semibold text-white">Secured by Stripe</p>
              <p className="text-xs text-slate-500">256-bit SSL encryption. PCI DSS compliant.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>Cancel anytime</span>
            <span>•</span>
            <span>No hidden fees</span>
            <span>•</span>
            <span>30-day money back</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}