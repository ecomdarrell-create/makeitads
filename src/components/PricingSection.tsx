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
    <section className="py-20 px-6 bg-[#FFFFFF]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-[#64748B] max-w-2xl mx-auto mb-8">
            Choose the plan that fits your business. Upgrade or downgrade at any time.
          </p>

          <div className="inline-flex items-center gap-3 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] p-1">
            <button
              onClick={() => onBillingChange("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedBilling === "monthly"
                  ? "bg-[#6366f1] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => onBillingChange("annual")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedBilling === "annual"
                  ? "bg-[#6366f1] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Annual
              <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
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
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  plan.highlight
                    ? "border-[#6366f1] bg-[#EEF2FF] shadow-[0_20px_60px_rgba(99,102,241,0.15)]"
                    : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] shadow-[0_10px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#6366f1] text-white text-xs font-bold shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg mb-4 ${
                    plan.highlight ? "bg-[#6366f1]/10 text-[#6366f1]" : "bg-[#F1F5F9] text-[#64748B]"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[#64748B]">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#0F172A]">${price}</span>
                    <span className="text-[#64748B] text-sm">{period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[#475569]">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block w-full text-center py-3 rounded-lg text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "bg-[#6366f1] text-white hover:bg-[#5558e6] shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]"
                      : "bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
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
          className="text-center text-sm text-[#94A3B8] mt-8"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}