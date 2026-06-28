"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

// ======================================================
// TYPES
// ======================================================

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  cta: string;
  ctaLink: string;
  stripePriceId: string | null;
  popular: boolean;
}

// ======================================================
// DONNÉES PRICING - TOUS LES AVANTAGES COMPLETS
// ======================================================

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for testing the waters.",
    price: { monthly: 0, yearly: 0 },
    features: [
      "1 strategy per month",
      "Basic market analysis",
      "Email support",
      "Dashboard access",
      "Community access",
    ],
    cta: "Current plan",
    ctaLink: "/signup",
    stripePriceId: null,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses.",
    price: { monthly: 29, yearly: 23 },
    features: [
      "Everything in Free",
      "10 strategies per month",
      "Competitor intelligence",
      "Trend intelligence",
      "Campaign builder",
      "Audience lab",
      "Analytics dashboard",
      "Creative studio",
      "PDF export",
      "Growth roadmap",
      "Priority email support",
    ],
    cta: "Upgrade to Pro",
    ctaLink: "/signup?plan=pro",
    stripePriceId: "price_pro_monthly",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "For serious marketers.",
    price: { monthly: 59, yearly: 47 },
    features: [
      "Everything in Pro",
      "Unlimited strategies",
      "Historical intelligence",
      "Predictive trends",
      "Competitor database",
      "API access",
      "Priority support 24/7",
      "Advanced reports",
      "Strategic intelligence",
      "White-label reports",
      "Custom integrations",
    ],
    cta: "Go Premium",
    ctaLink: "/signup?plan=premium",
    stripePriceId: "price_premium_monthly",
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For agencies & teams.",
    price: { monthly: 149, yearly: 119 },
    features: [
      "Everything in Premium",
      "Multi-brand management",
      "Team collaboration (10+ seats)",
      "Custom AI training",
      "Dedicated account manager",
      "SLA guarantee",
      "On-premise option",
      "Custom contracts",
      "Advanced security",
      "SSO & SAML",
    ],
    cta: "Book a call",
    ctaLink: "/contact",
    stripePriceId: null,
    popular: false,
  },
];

// ======================================================
// COMPOSANT CARTE PRICING
// ======================================================

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
  isYearly: boolean;
  isMobile?: boolean;
  onCheckout?: (priceId: string) => void;
}

function PricingCard({ plan, index, isYearly, isMobile = false, onCheckout }: PricingCardProps) {
  const handleCtaClick = () => {
    if (!plan.stripePriceId) {
      window.location.href = plan.ctaLink;
      return;
    }
    if (onCheckout) {
      onCheckout(plan.stripePriceId);
    } else {
      window.location.href = plan.ctaLink;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-2xl p-6 md:p-8 border transition-all duration-300 ${
        plan.popular
          ? "border-[#6366f1]/50 bg-[#6366f1]/5"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      } ${isMobile ? "min-w-[85vw]" : ""}`}
    >
      {/* Badge Most Popular */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#6366f1] text-white text-xs font-semibold">
            Most Popular
          </span>
        </div>
      )}

      {/* Nom du plan */}
      <h3 className="text-xl font-semibold text-white mb-2">
        {plan.name}
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        {plan.description}
      </p>

      {/* Prix */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">
            ${isYearly ? plan.price.yearly : plan.price.monthly}
          </span>
          <span className="text-slate-400 text-sm">/month</span>
        </div>
        {isYearly && plan.price.monthly > 0 && (
          <p className="text-xs text-slate-500 mt-1">
            Billed annually (${plan.price.yearly * 12}/year)
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
            <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={handleCtaClick}
        className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${
          plan.popular
            ? "bg-[#6366f1] text-white hover:bg-[#5558e6]"
            : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        }`}
      >
        {plan.cta}
      </button>
    </motion.div>
  );
}

// ======================================================
// COMPOSANT PRICING CARDS
// ======================================================

interface PricingCardsProps {
  isYearly: boolean;
}

export function PricingCards({ isYearly }: PricingCardsProps) {
  const handleCheckout = async (priceId: string) => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <>
      {/* Desktop - 4 colonnes */}
      <div className="hidden lg:grid grid-cols-4 gap-6">
        {pricingPlans.map((plan: PricingPlan, index: number) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            index={index}
            isYearly={isYearly}
            onCheckout={handleCheckout}
          />
        ))}
      </div>

      {/* Tablet - 2 colonnes */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
        {pricingPlans.map((plan: PricingPlan, index: number) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            index={index}
            isYearly={isYearly}
            onCheckout={handleCheckout}
          />
        ))}
      </div>

      {/* Mobile - Carousel */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 scrollbar-hide">
          {pricingPlans.map((plan: PricingPlan, index: number) => (
            <div key={plan.id} className="snap-center flex-shrink-0">
              <PricingCard
                plan={plan}
                index={index}
                isYearly={isYearly}
                isMobile={true}
                onCheckout={handleCheckout}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`h-1.5 rounded-full transition-all ${
                plan.popular ? "w-8 bg-[#6366f1]" : "w-4 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// Style scrollbar
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(style);
}