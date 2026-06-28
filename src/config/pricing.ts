export const PRICING_PLANS = {
  free: {
    id: "free" as const,
    name: "Free",
    description: "Perfect for testing the waters.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stripePriceId: null,
    features: ["1 strategy per month", "Basic market analysis", "Email support", "Dashboard access", "Community access"],
    limits: { strategiesPerMonth: 1, businesses: 1, competitorIntelligence: false, trendIntelligence: false, pdfExport: false },
  },
  pro: {
    id: "pro" as const,
    name: "Pro",
    description: "For growing businesses.",
    monthlyPrice: 29,
    yearlyPrice: 23,
    stripePriceId: "price_pro_monthly",
    features: ["Everything in Free", "10 strategies per month", "Competitor intelligence", "Trend intelligence", "Campaign builder", "Audience lab", "Analytics dashboard", "Creative studio", "PDF export", "Growth roadmap", "Priority email support"],
    limits: { strategiesPerMonth: 10, businesses: 3, competitorIntelligence: true, trendIntelligence: true, pdfExport: true },
  },
  premium: {
    id: "premium" as const,
    name: "Premium",
    description: "For serious marketers.",
    monthlyPrice: 59,
    yearlyPrice: 47,
    stripePriceId: "price_premium_monthly",
    features: ["Everything in Pro", "Unlimited strategies", "Historical intelligence", "Predictive trends", "Competitor database", "API access", "Priority support 24/7", "Advanced reports", "Strategic intelligence", "White-label reports", "Custom integrations"],
    limits: { strategiesPerMonth: -1, businesses: 10, competitorIntelligence: true, trendIntelligence: true, pdfExport: true },
  },
  enterprise: {
    id: "enterprise" as const,
    name: "Enterprise",
    description: "For agencies & teams.",
    monthlyPrice: 149,
    yearlyPrice: 119,
    stripePriceId: null,
    features: ["Everything in Premium", "Multi-brand management", "Team collaboration (10+ seats)", "Custom AI training", "Dedicated account manager", "SLA guarantee", "On-premise option", "Custom contracts", "Advanced security", "SSO & SAML"],
    limits: { strategiesPerMonth: -1, businesses: -1, competitorIntelligence: true, trendIntelligence: true, pdfExport: true },
  },
} as const;

export type PlanId = keyof typeof PRICING_PLANS;
export type PricingPlan = (typeof PRICING_PLANS)[PlanId];

export function getPlanPrice(planId: PlanId, isYearly: boolean): number {
  const plan = PRICING_PLANS[planId];
  return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
}

export function isFeatureAvailable(userPlan: PlanId, requiredPlan: PlanId): boolean {
  const planOrder: PlanId[] = ["free", "pro", "premium", "enterprise"];
  return planOrder.indexOf(userPlan) >= planOrder.indexOf(requiredPlan);
}