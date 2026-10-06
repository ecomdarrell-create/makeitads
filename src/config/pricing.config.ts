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
  welcomeCredits: number;
  monthlyCredits: number;
  stripePriceId: string | null;
  features: string[];
  limits: {
    businesses: number; // -1 = unlimited

    // ─── Intelligence features ───
    competitorIntelligence: boolean;
    trendIntelligence: boolean;
    predictiveTrends: boolean;
    historicalIntelligence: boolean;

    // ─── Analysis features ───
    swotAnalysis: boolean;
    audienceInsights: boolean;
    marketShareAnalysis: boolean;
    trafficEstimation: boolean;
    growthForecast: boolean;
    keywordOpportunities: boolean;
    advertisingIntelligence: boolean;

    // ─── Strategy features (structure par plan) ───
    strategyFlash: boolean;             // Démo — 3 sections
    strategyCompleteBasic: boolean;     // Pro — 8 sections
    strategyCompleteAdvanced: boolean;  // Premium — 12 sections
    strategyCompleteElite: boolean;     // Élite — 16+ sections

    // ─── Export & Integration ───
    pdfExport: boolean;
    advancedReports: boolean;
    whiteLabelReports: boolean;
    apiAccess: boolean;
    customIntegrations: boolean;

    // ─── Support & Services ───
    prioritySupport: boolean;
    dedicatedManager: boolean;
    slaGuarantee: boolean;
    customTraining: boolean;

    // ─── Team features ───
    teamCollaboration: boolean;
    multiBrandManagement: boolean;
    ssoSaml: boolean;
  };
  popular?: boolean;
  cta: string;
}

// ======================================================
// COÛTS EN CRÉDITS (centralisés)
// ======================================================

export const CREDIT_COSTS = {
  DIAGNOSTIC_FLASH: 1,
  STRATEGIE_COMPLETE: 5,
  ANALYSE_CONCURRENTIELLE: 3,
  ANALYSE_PUBLICITAIRE: 2,
  GENERATION_HOOKS: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

// ======================================================
// CONFIGURATION DES PLANS
// ======================================================

export const PRICING_CONFIG: Record<string, PricingPlan> = {
  // ─── DÉMO ───
  free: {
    id: "free",
    name: "Démo",
    description: "Découvrez la qualité de l'intelligence MakeItAds.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    welcomeCredits: 10,
    monthlyCredits: 0,
    stripePriceId: null,
    features: [
      "10 crédits de bienvenue (offre unique)",
      "Diagnostic Flash (3 sections)",
      "Accès au dashboard",
      "Support communautaire",
    ],
    limits: {
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

      // Strategy
      strategyFlash: true,
      strategyCompleteBasic: false,
      strategyCompleteAdvanced: false,
      strategyCompleteElite: false,

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
    cta: "Commencer",
  },

  // ─── PRO ───
  pro: {
    id: "pro",
    name: "Pro",
    description: "Pour les entrepreneurs qui veulent scaler leurs premières ventes.",
    monthlyPrice: 10000,
    yearlyPrice: 10000,
    welcomeCredits: 0,
    monthlyCredits: 50,
    stripePriceId: "price_pro_monthly",
    features: [
      "Tout le plan Démo",
      "50 crédits renouvelés chaque mois",
      "Stratégie Complète Basique (8 sections)",
      "Scripts WhatsApp prêts à l'emploi",
      "Allocation budgétaire sur 7 jours",
      "Ciblage précis",
      "Guide créatif",
      "KPIs à suivre",
      "Support email (48h)",
    ],
    limits: {
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

      // Strategy
      strategyFlash: true,
      strategyCompleteBasic: true,
      strategyCompleteAdvanced: false,
      strategyCompleteElite: false,

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
    cta: "Choisir le Plan Pro",
  },

  // ─── PREMIUM ───
  premium: {
    id: "premium",
    name: "Premium",
    description: "Pour les marketeurs sérieux qui veulent dominer leur niche.",
    monthlyPrice: 25000,
    yearlyPrice: 25000,
    welcomeCredits: 0,
    monthlyCredits: 150,
    stripePriceId: "price_premium_monthly",
    features: [
      "Tout le plan Pro",
      "150 crédits renouvelés chaque mois",
      "Stratégie Complète Avancée (12 sections)",
      "Analyse concurrentielle",
      "Génération de hooks (5 variantes)",
      "Analyse d'audience approfondie",
      "Stratégie de croissance (3 mois)",
      "Support prioritaire (12h)",
      "Rapports avancés",
    ],
    limits: {
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

      // Strategy
      strategyFlash: true,
      strategyCompleteBasic: true,
      strategyCompleteAdvanced: true,
      strategyCompleteElite: false,

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
    cta: "Choisir le Plan Premium",
  },

  // ─── ÉLITE ───
  enterprise: {
    id: "enterprise",
    name: "Élite",
    description: "Pour les agences et équipes en croissance rapide.",
    monthlyPrice: 100000,
    yearlyPrice: 100000,
    welcomeCredits: 0,
    monthlyCredits: 500,
    stripePriceId: null,
    features: [
      "Tout le plan Premium",
      "500 crédits renouvelés chaque mois",
      "Stratégie Complète Élite (16+ sections)",
      "Consulting stratégique mensuel",
      "Formation personnalisée",
      "Accompagnement avancé",
      "Rapports white-label",
      "Support prioritaire 24/7",
      "Multi-marques",
      "Collaboration d'équipe (10 sièges)",
      "Accès API",
    ],
    limits: {
      businesses: -1,

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

      // Strategy
      strategyFlash: true,
      strategyCompleteBasic: true,
      strategyCompleteAdvanced: true,
      strategyCompleteElite: true,

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
    cta: "Choisir le Plan Élite",
  },
} as const;

export type PlanId = keyof typeof PRICING_CONFIG;

// ======================================================
// NORMALISATION DU PLAN
// ======================================================

export function normalizePlanId(planId?: string | null): PlanId {
  const normalized = (planId || 'free').toLowerCase().trim();
  const validPlans: PlanId[] = ['free', 'pro', 'premium', 'enterprise'];

  if (normalized === 'elite' || normalized === 'élite') {
    return 'enterprise';
  }

  return validPlans.includes(normalized as PlanId) ? (normalized as PlanId) : 'free';
}

// ======================================================
// HELPERS
// ======================================================

// Obtenir un plan par ID
export function getPlan(planId: string): PricingPlan | undefined {
  return PRICING_CONFIG[planId];
}

// Vérifier si un plan est supérieur ou égal à un autre
export function hasFeature(
  userPlanId: string,
  requiredPlanId: string
): boolean {
  const planOrder: PlanId[] = ["free", "pro", "premium", "enterprise"];
  const userIndex = planOrder.indexOf(userPlanId as PlanId);
  const requiredIndex = planOrder.indexOf(requiredPlanId as PlanId);
  return userIndex >= requiredIndex;
}

// Obtenir le prix
export function getPrice(planId: PlanId, isYearly: boolean): number {
  const plan = PRICING_CONFIG[planId];
  return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
}

// Vérifier si une feature spécifique est disponible
export function hasPermission(
  userPlanId: string,
  feature: keyof PricingPlan["limits"]
): boolean {
  const plan = PRICING_CONFIG[userPlanId];
  if (!plan) return false;
  return plan.limits[feature] === true;
}

// Obtenir la limite d'une feature
export function getLimit(
  userPlanId: string,
  feature: "monthlyCredits" | "businesses"
): number {
  const plan = PRICING_CONFIG[normalizePlanId(userPlanId)];
  if (!plan) return 0;
  return feature === 'monthlyCredits' ? plan.monthlyCredits : plan.limits.businesses;
}

// Vérifier si le quota est atteint
export function isQuotaReached(
  userPlanId: string,
  used: number
): boolean {
  const limit = getLimit(userPlanId, "monthlyCredits");
  if (limit === -1) return false;
  return used >= limit;
}

// Obtenir le quota restant
export function getQuotaRemaining(
  userPlanId: string,
  used: number
): number {
  const limit = getLimit(userPlanId, "monthlyCredits");
  if (limit === -1) return 9999;
  return Math.max(0, limit - used);
}

// Obtenir toutes les features disponibles pour un plan
export function getAvailableFeatures(planId: string): string[] {
  const plan = PRICING_CONFIG[planId];
  if (!plan) return [];
  return plan.features;
}

// Comparer deux plans
export function comparePlans(
  planId1: string,
  planId2: string
): number {
  const planOrder: PlanId[] = ["free", "pro", "premium", "enterprise"];
  const index1 = planOrder.indexOf(planId1 as PlanId);
  const index2 = planOrder.indexOf(planId2 as PlanId);
  return index1 - index2;
}

// Obtenir le plan suivant
export function getNextPlan(currentPlanId: string): PlanId | null {
  const planOrder: PlanId[] = ["free", "pro", "premium", "enterprise"];
  const currentIndex = planOrder.indexOf(currentPlanId as PlanId);
  if (currentIndex === -1 || currentIndex === planOrder.length - 1) {
    return null;
  }
  return planOrder[currentIndex + 1];
}

// Vérifier si un plan est "premium" ou supérieur
export function isPremiumOrAbove(planId: string): boolean {
  return hasFeature(planId, "premium");
}

// Vérifier si un plan est "enterprise"
export function isEnterprise(planId: string): boolean {
  return planId === "enterprise";
}

// Labels commerciaux (pour affichage UI)
export const PLAN_LABELS: Record<PlanId, string> = {
  free: "Démo",
  pro: "Pro",
  premium: "Premium",
  enterprise: "Élite",
};