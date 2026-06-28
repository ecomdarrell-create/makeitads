// ======================================================
// PRICING CONFIGURATION - SOURCE UNIQUE DE VÉRITÉ
// Utilisé par : Landing, Pricing Page, Billing, Stripe, Dashboard
// ======================================================

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  stripePriceId: string | null;
  features: string[];
  limits: {
    strategiesPerMonth: number; // -1 = unlimited
    businesses: number; // -1 = unlimited
    // Intelligence features
    competitorIntelligence: boolean;
    trendIntelligence: boolean;
    predictiveTrends: boolean;
    historicalIntelligence: boolean;
    // Analysis features
    swotAnalysis: boolean;
    audienceInsights: boolean;
    marketShareAnalysis: boolean;
    trafficEstimation: boolean;
    growthForecast: boolean;
    keywordOpportunities: boolean;
    advertisingIntelligence: boolean;
    // Export & Integration
    pdfExport: boolean;
    advancedReports: boolean;
    whiteLabelReports: boolean;
    apiAccess: boolean;
    customIntegrations: boolean;
    // Support & Services
    prioritySupport: boolean;
    dedicatedManager: boolean;
    slaGuarantee: boolean;
    customTraining: boolean;
    // Team features
    teamCollaboration: boolean;
    multiBrandManagement: boolean;
    ssoSaml: boolean;
  };
  popular?: boolean;
  cta: string;
}

export const PRICING_CONFIG: Record<string, PricingPlan> = {
  free: {
    id: "free",
    name: "Free",
    description: "Perfect for testing the waters.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stripePriceId: null,
    features: [
      "1 strategy per month",
      "Basic market analysis",
      "Email support",
      "Dashboard access",
      "Community access",
    ],
    limits: {
      strategiesPerMonth: 1,
      businesses: 1,
      // Intelligence
      competitorIntelligence: false,
      trendIntelligence: false,
      predictiveTrends: false,
      historicalIntelligence: false,
      // Analysis
      swotAnalysis: false,
      audienceInsights: false,
      marketShareAnalysis: false,
      trafficEstimation: false,
      growthForecast: false,
      keywordOpportunities: false,
      advertisingIntelligence: false,
      // Export
      pdfExport: false,
      advancedReports: false,
      whiteLabelReports: false,
      apiAccess: false,
      customIntegrations: false,
      // Support
      prioritySupport: false,
      dedicatedManager: false,
      slaGuarantee: false,
      customTraining: false,
      // Team
      teamCollaboration: false,
      multiBrandManagement: false,
      ssoSaml: false,
    },
    cta: "Current plan",
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For growing businesses.",
    monthlyPrice: 29,
    yearlyPrice: 23,
    stripePriceId: "price_pro_monthly",
    features: [
      "Everything in Free",
      "10 strategies per month",
      "Competitor intelligence",
      "Trend intelligence",
      "SWOT analysis",
      "Audience insights",
      "Campaign builder",
      "Analytics dashboard",
      "Creative studio",
      "PDF export",
      "Growth roadmap",
      "Priority email support",
    ],
    limits: {
      strategiesPerMonth: 10,
      businesses: 3,
      // Intelligence
      competitorIntelligence: true,
      trendIntelligence: true,
      predictiveTrends: false,
      historicalIntelligence: false,
      // Analysis
      swotAnalysis: true,
      audienceInsights: true,
      marketShareAnalysis: false,
      trafficEstimation: false,
      growthForecast: false,
      keywordOpportunities: true,
      advertisingIntelligence: false,
      // Export
      pdfExport: true,
      advancedReports: false,
      whiteLabelReports: false,
      apiAccess: false,
      customIntegrations: false,
      // Support
      prioritySupport: true,
      dedicatedManager: false,
      slaGuarantee: false,
      customTraining: false,
      // Team
      teamCollaboration: false,
      multiBrandManagement: false,
      ssoSaml: false,
    },
    popular: true,
    cta: "Upgrade to Pro",
  },
  premium: {
    id: "premium",
    name: "Premium",
    description: "For serious marketers.",
    monthlyPrice: 59,
    yearlyPrice: 47,
    stripePriceId: "price_premium_monthly",
    features: [
      "Everything in Pro",
      "Unlimited strategies",
      "Predictive trends",
      "Historical intelligence",
      "Market share analysis",
      "Traffic estimation",
      "Growth forecast",
      "Advertising intelligence",
      "Advanced reports",
      "API access",
      "Priority support 24/7",
      "White-label reports",
    ],
    limits: {
      strategiesPerMonth: -1, // unlimited
      businesses: 10,
      // Intelligence
      competitorIntelligence: true,
      trendIntelligence: true,
      predictiveTrends: true,
      historicalIntelligence: true,
      // Analysis
      swotAnalysis: true,
      audienceInsights: true,
      marketShareAnalysis: true,
      trafficEstimation: true,
      growthForecast: true,
      keywordOpportunities: true,
      advertisingIntelligence: true,
      // Export
      pdfExport: true,
      advancedReports: true,
      whiteLabelReports: true,
      apiAccess: true,
      customIntegrations: false,
      // Support
      prioritySupport: true,
      dedicatedManager: false,
      slaGuarantee: false,
      customTraining: false,
      // Team
      teamCollaboration: true,
      multiBrandManagement: false,
      ssoSaml: false,
    },
    cta: "Go Premium",
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "For agencies & teams.",
    monthlyPrice: 149,
    yearlyPrice: 119,
    stripePriceId: null,
    features: [
      "Everything in Premium",
      "Multi-brand management",
      "Team collaboration (10+ seats)",
      "Custom AI training",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
      "Advanced security",
      "SSO & SAML",
      "Custom contracts",
    ],
    limits: {
      strategiesPerMonth: -1, // unlimited
      businesses: -1, // unlimited
      // Intelligence
      competitorIntelligence: true,
      trendIntelligence: true,
      predictiveTrends: true,
      historicalIntelligence: true,
      // Analysis
      swotAnalysis: true,
      audienceInsights: true,
      marketShareAnalysis: true,
      trafficEstimation: true,
      growthForecast: true,
      keywordOpportunities: true,
      advertisingIntelligence: true,
      // Export
      pdfExport: true,
      advancedReports: true,
      whiteLabelReports: true,
      apiAccess: true,
      customIntegrations: true,
      // Support
      prioritySupport: true,
      dedicatedManager: true,
      slaGuarantee: true,
      customTraining: true,
      // Team
      teamCollaboration: true,
      multiBrandManagement: true,
      ssoSaml: true,
    },
    cta: "Book a call",
  },
} as const;

export type PlanId = keyof typeof PRICING_CONFIG;

// ======================================================
// HELPERS
// ======================================================

// Helper : obtenir un plan par ID
export function getPlan(planId: string): PricingPlan | undefined {
  return PRICING_CONFIG[planId];
}

// Helper : vérifier si un plan est supérieur ou égal à un autre
export function hasFeature(
  userPlanId: string,
  requiredPlanId: string
): boolean {
  const planOrder: PlanId[] = ["free", "pro", "premium", "enterprise"];
  const userIndex = planOrder.indexOf(userPlanId as PlanId);
  const requiredIndex = planOrder.indexOf(requiredPlanId as PlanId);
  return userIndex >= requiredIndex;
}

// Helper : obtenir le prix
export function getPrice(planId: PlanId, isYearly: boolean): number {
  const plan = PRICING_CONFIG[planId];
  return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
}

// Helper : vérifier si une feature spécifique est disponible
export function hasPermission(
  userPlanId: string,
  feature: keyof PricingPlan["limits"]
): boolean {
  const plan = PRICING_CONFIG[userPlanId];
  if (!plan) return false;
  return plan.limits[feature] === true;
}

// Helper : obtenir la limite d'une feature
export function getLimit(
  userPlanId: string,
  feature: "strategiesPerMonth" | "businesses"
): number {
  const plan = PRICING_CONFIG[userPlanId];
  if (!plan) return 0;
  return plan.limits[feature];
}

// Helper : vérifier si le quota est atteint
export function isQuotaReached(
  userPlanId: string,
  used: number
): boolean {
  const limit = getLimit(userPlanId, "strategiesPerMonth");
  if (limit === -1) return false; // unlimited
  return used >= limit;
}

// Helper : obtenir le quota restant
export function getQuotaRemaining(
  userPlanId: string,
  used: number
): number {
  const limit = getLimit(userPlanId, "strategiesPerMonth");
  if (limit === -1) return 9999; // unlimited
  return Math.max(0, limit - used);
}

// Helper : obtenir toutes les features disponibles pour un plan
export function getAvailableFeatures(planId: string): string[] {
  const plan = PRICING_CONFIG[planId];
  if (!plan) return [];
  return plan.features;
}

// Helper : comparer deux plans
export function comparePlans(
  planId1: string,
  planId2: string
): number {
  const planOrder: PlanId[] = ["free", "pro", "premium", "enterprise"];
  const index1 = planOrder.indexOf(planId1 as PlanId);
  const index2 = planOrder.indexOf(planId2 as PlanId);
  return index1 - index2;
}

// Helper : obtenir le plan suivant
export function getNextPlan(currentPlanId: string): PlanId | null {
  const planOrder: PlanId[] = ["free", "pro", "premium", "enterprise"];
  const currentIndex = planOrder.indexOf(currentPlanId as PlanId);
  if (currentIndex === -1 || currentIndex === planOrder.length - 1) {
    return null;
  }
  return planOrder[currentIndex + 1];
}

// Helper : vérifier si un plan est "premium" ou supérieur
export function isPremiumOrAbove(planId: string): boolean {
  return hasFeature(planId, "premium");
}

// Helper : vérifier si un plan est "enterprise"
export function isEnterprise(planId: string): boolean {
  return planId === "enterprise";
}