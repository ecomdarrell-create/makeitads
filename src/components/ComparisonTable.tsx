"use client";

import { Check, X } from "lucide-react";
import { pricingPlans, type PricingPlan } from "./PricingCards";

// ======================================================
// TYPES
// ======================================================

type FeatureValue = boolean | string;

interface FeatureCategory {
  category: string;
  features: string[];
}

// ======================================================
// DONNÉES
// ======================================================

const allFeatures: FeatureCategory[] = [
  { category: "Strategy Generation", features: ["Strategies per month", "Business profiles", "Market analysis depth"] },
  { category: "Intelligence", features: ["Competitor intelligence", "Trend intelligence", "Historical intelligence", "Predictive trends", "Competitor database"] },
  { category: "Tools", features: ["Campaign builder", "Audience lab", "Creative studio", "Analytics dashboard", "Growth roadmap"] },
  { category: "Export & API", features: ["PDF export", "API access", "Custom integrations", "White-label reports"] },
  { category: "Support", features: ["Email support", "Priority support 24/7", "Dedicated account manager", "SLA guarantee"] },
  { category: "Enterprise", features: ["Multi-brand management", "Team collaboration", "Custom AI training", "On-premise option", "SSO & SAML"] },
];

const featureAvailability: Record<string, Record<string, FeatureValue>> = {
  "Strategies per month": { Free: "1", Pro: "Unlimited", Premium: "Unlimited", Enterprise: "Unlimited" },
  "Business profiles": { Free: "1", Pro: "3", Premium: "10", Enterprise: "Unlimited" },
  "Market analysis depth": { Free: "Basic", Pro: "Advanced", Premium: "Deep", Enterprise: "Deep" },
  "Competitor intelligence": { Free: "false", Pro: "true", Premium: "true", Enterprise: "true" },
  "Trend intelligence": { Free: "false", Pro: "true", Premium: "true", Enterprise: "true" },
  "Historical intelligence": { Free: "false", Pro: "false", Premium: "true", Enterprise: "true" },
  "Predictive trends": { Free: "false", Pro: "false", Premium: "true", Enterprise: "true" },
  "Competitor database": { Free: "false", Pro: "false", Premium: "true", Enterprise: "true" },
  "Campaign builder": { Free: "false", Pro: "true", Premium: "true", Enterprise: "true" },
  "Audience lab": { Free: "false", Pro: "true", Premium: "true", Enterprise: "true" },
  "Creative studio": { Free: "false", Pro: "true", Premium: "true", Enterprise: "true" },
  "Analytics dashboard": { Free: "Basic", Pro: "Advanced", Premium: "Advanced", Enterprise: "Advanced" },
  "Growth roadmap": { Free: "false", Pro: "true", Premium: "true", Enterprise: "true" },
  "PDF export": { Free: "false", Pro: "true", Premium: "true", Enterprise: "true" },
  "API access": { Free: "false", Pro: "false", Premium: "true", Enterprise: "true" },
  "Custom integrations": { Free: "false", Pro: "false", Premium: "true", Enterprise: "true" },
  "White-label reports": { Free: "false", Pro: "false", Premium: "true", Enterprise: "true" },
  "Email support": { Free: "true", Pro: "true", Premium: "true", Enterprise: "true" },
  "Priority support 24/7": { Free: "false", Pro: "false", Premium: "true", Enterprise: "true" },
  "Dedicated account manager": { Free: "false", Pro: "false", Premium: "false", Enterprise: "true" },
  "SLA guarantee": { Free: "false", Pro: "false", Premium: "false", Enterprise: "true" },
  "Multi-brand management": { Free: "false", Pro: "false", Premium: "false", Enterprise: "true" },
  "Team collaboration": { Free: "false", Pro: "false", Premium: "false", Enterprise: "true" },
  "Custom AI training": { Free: "false", Pro: "false", Premium: "false", Enterprise: "true" },
  "On-premise option": { Free: "false", Pro: "false", Premium: "false", Enterprise: "true" },
  "SSO & SAML": { Free: "false", Pro: "false", Premium: "false", Enterprise: "true" },
};

// ======================================================
// COMPOSANT CELLULE
// ======================================================

function CellValue({ value }: { value: FeatureValue }) {
  if (value === "true") return <Check className="h-4 w-4 text-emerald-400 mx-auto" />;
  if (value === "false") return <X className="h-4 w-4 text-slate-600 mx-auto" />;
  return <span className="text-xs text-slate-300 font-medium">{value}</span>;
}

// ======================================================
// COMPOSANT PRINCIPAL
// ======================================================

export default function ComparisonTable() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-3xl border border-white/10 bg-[#0f0f1a]/60 backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="text-sm font-bold text-white">Feature</div>
          {pricingPlans.map((plan: PricingPlan) => (
            <div key={plan.id} className="text-center">
              <div className="text-base font-bold text-white">{plan.name}</div>
            </div>
          ))}
        </div>

        {allFeatures.map((category: FeatureCategory) => (
          <div key={category.category}>
            <div className="p-4 bg-[#6366f1]/5 border-b border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b5cf6]">
                {category.category}
              </h3>
            </div>
            {category.features.map((feature: string, idx: number) => (
              <div
                key={feature}
                className={`grid grid-cols-5 gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center ${
                  idx % 2 === 0 ? "bg-white/[0.01]" : ""
                }`}
              >
                <div className="text-sm text-slate-300">{feature}</div>
                {pricingPlans.map((plan: PricingPlan) => (
                  <div key={plan.id} className="flex justify-center">
                    <CellValue
                      value={featureAvailability[feature]?.[plan.name] ?? "false"}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-6">
        {pricingPlans.map((plan: PricingPlan) => (
          <div
            key={plan.id}
            className="rounded-2xl border border-white/10 bg-[#0f0f1a]/60 backdrop-blur-xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#6366f1]/10 to-transparent">
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-sm text-slate-400 mt-1">
                ${plan.price.monthly}/month
              </p>
            </div>
            <div className="p-6 space-y-6">
              {allFeatures.map((category: FeatureCategory) => (
                <div key={category.category}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8b5cf6] mb-3">
                    {category.category}
                  </h4>
                  <div className="space-y-2">
                    {category.features.map((feature: string) => {
                      const value = featureAvailability[feature]?.[plan.name] ?? "false";
                      return (
                        <div
                          key={feature}
                          className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                        >
                          <span className="text-sm text-slate-300">
                            {feature}
                          </span>
                          <CellValue value={value} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}