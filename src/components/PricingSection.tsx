"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

interface PricingSectionProps {
  selectedBilling: "monthly" | "annual";
  onBillingChange: (billing: "monthly" | "annual") => void;
}

const plans = [
  {
    name: "Free",
    icon: Zap,
    description: "Perfect for getting started",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "1 AI Strategy per month",
      "Basic competitor analysis",
      "Standard templates",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    icon: Sparkles,
    description: "For growing businesses",
    monthlyPrice: 29,
    annualPrice: 290,
    features: [
      "10 AI Strategies per month",
      "Advanced competitor analysis",
      "Campaign planner",
      "Budget optimization",
      "Priority email support",
      "Custom templates",
      "Performance analytics",
    ],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Premium",
    icon: Crown,
    description: "For agencies & enterprises",
    monthlyPrice: 79,
    annualPrice: 790,
    features: [
      "Unlimited AI Strategies",
      "Full competitor intelligence",
      "Creative studio",
      "White-label reports",
      "API access",
      "Dedicated account manager",
      "24/7 priority support",
      "Custom integrations",
      "Team collaboration",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export function PricingSection({ selectedBilling, onBillingChange }: PricingSectionProps) {
  return (
    <section className="py-20 px-6 bg-[#080810]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your business. Upgrade or downgrade at any time.
          </p>

          {/* Toggle Monthly/Annual */}
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => onBillingChange("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedBilling === "monthly"
                  ? "bg-[#6366f1] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => onBillingChange("annual")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedBilling === "annual"
                  ? "bg-[#6366f1] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Annual
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const price = selectedBilling === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const period = selectedBilling === "monthly" ? "/month" : "/year";

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlight
                    ? "border-[#6366f1] bg-gradient-to-b from-[#6366f1]/10 to-transparent shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#6366f1] text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg mb-4 ${
                    plan.highlight ? "bg-[#6366f1]/20 text-[#8b5cf6]" : "bg-white/10 text-slate-400"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-400">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    <span className="text-slate-400 text-sm">{period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block w-full text-center py-3 rounded-lg text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "bg-[#6366f1] text-white hover:bg-[#5558e6] shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-slate-500 mt-8"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}