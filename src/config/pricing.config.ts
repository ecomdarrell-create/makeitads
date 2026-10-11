// ======================================================
// PRICING CONFIGURATION - SOURCE UNIQUE DE VÉRITÉ
// ⚠️ Tous les prix sont exprimés en XOF (base)
// La conversion vers EUR/USD se fait à l'affichage via lib/currency.ts
// ======================================================

import {
  type Currency,
  normalizeCurrency,
  convertFromXOF,
  formatPriceFromXOF,
  getCurrencySymbol,
} from '@/lib/currency';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number; // ⚠️ en XOF
  yearlyPrice: number;  // ⚠️ en XOF
  welcomeCredits: number;
  monthlyCredits: number;
  stripePriceId: string | null;
  features: string[];
  limits: {
    businesses: number;
    competitorIntelligence: boolean;
    trendIntelligence: boolean;
    predictiveTrends: boolean;
    historicalIntelligence: boolean;
    swotAnalysis: boolean;
    audienceInsights: boolean;
    marketShareAnalysis: boolean;
    trafficEstimation: boolean;
    growthForecast: boolean;
    keywordOpportunities: boolean;
    advertisingIntelligence: boolean;
    strategyFlash: boolean;
    strategyCompleteBasic: boolean;
    strategyCompleteAdvanced: boolean;
    strategyCompleteElite: boolean;
    pdfExport: boolean;
    advancedReports: boolean;
    whiteLabelReports: boolean;
    apiAccess: boolean;
    customIntegrations: boolean;
    prioritySupport: boolean;
    dedicatedManager: boolean;
    slaGuarantee: boolean;
    customTraining: boolean;
    teamCollaboration: boolean;
    multiBrandManagement: boolean;
    ssoSaml: boolean;
  };
  popular?: boolean;
  cta: string;
}

export const CREDIT_COSTS = {
  DIAGNOSTIC_FLASH: 5,
  STRATEGIE_COMPLETE: 10,
  ANALYSE_CONCURRENTIELLE: 3,
  ANALYSE_PUBLICITAIRE: 2,
  GENERATION_HOOKS: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export interface RechargePack {
  id: string;
  credits: number;
  price: number; // ⚠️ en XOF
  label: string;
  description: string;
  popular?: boolean;
  chariowUrl: string;
}

export const RECHARGE_PACKS: RechargePack[] = [
  {
    id: 'recharge-10',
    credits: 10,
    price: 1500,
    label: '+10 crédits',
    description: '1 stratégie complète',
    chariowUrl: 'https://makeitads.mychariow.com/prd_h75k9z3s/checkout',
  },
  {
    id: 'recharge-30',
    credits: 30,
    price: 4000,
    label: '+30 crédits',
    description: '3 stratégies complètes',
    popular: true,
    chariowUrl: 'https://makeitads.mychariow.com/prd_w4a49pog/checkout',
  },
  {
    id: 'recharge-80',
    credits: 80,
    price: 9000,
    label: '+80 crédits',
    description: '8 stratégies complètes',
    chariowUrl: 'https://makeitads.mychariow.com/prd_9oxkwnxl/checkout',
  },
];

export const PRICING_CONFIG: Record<string, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Démo',
    description: 'Découvrez la qualité de l\'intelligence MakeItAds.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    welcomeCredits: 10,
    monthlyCredits: 0,
    stripePriceId: null,
    features: [
      '10 crédits de bienvenue (offre unique)',
      '2 Diagnostics Flash',
      'Aperçu rapide de votre activité',
      'Support communautaire',
    ],
    limits: {
      businesses: 1,
      competitorIntelligence: false,
      trendIntelligence: false,
      predictiveTrends: false,
      historicalIntelligence: false,
      swotAnalysis: false,
      audienceInsights: false,
      marketShareAnalysis: false,
      trafficEstimation: false,
      growthForecast: false,
      keywordOpportunities: false,
      advertisingIntelligence: false,
      strategyFlash: true,
      strategyCompleteBasic: false,
      strategyCompleteAdvanced: false,
      strategyCompleteElite: false,
      pdfExport: false,
      advancedReports: false,
      whiteLabelReports: false,
      apiAccess: false,
      customIntegrations: false,
      prioritySupport: false,
      dedicatedManager: false,
      slaGuarantee: false,
      customTraining: false,
      teamCollaboration: false,
      multiBrandManagement: false,
      ssoSaml: false,
    },
    cta: 'Commencer',
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les entrepreneurs qui veulent scaler leurs ventes.',
    monthlyPrice: 10000,
    yearlyPrice: 10000,
    welcomeCredits: 0,
    monthlyCredits: 50,
    stripePriceId: 'price_pro_monthly',
    features: [
      'Tout le plan Démo',
      '50 crédits renouvelés chaque mois',
      '5 Stratégies Complètes / mois',
      '12 sections détaillées par stratégie',
      'Scripts WhatsApp prêts à l\'emploi',
      'Allocation budgétaire sur 7 jours',
      'Ciblage précis par ville',
      'Support email (48h)',
    ],
    limits: {
      businesses: 3,
      competitorIntelligence: true,
      trendIntelligence: true,
      predictiveTrends: false,
      historicalIntelligence: false,
      swotAnalysis: true,
      audienceInsights: true,
      marketShareAnalysis: false,
      trafficEstimation: false,
      growthForecast: false,
      keywordOpportunities: true,
      advertisingIntelligence: false,
      strategyFlash: false,
      strategyCompleteBasic: true,
      strategyCompleteAdvanced: false,
      strategyCompleteElite: false,
      pdfExport: true,
      advancedReports: false,
      whiteLabelReports: false,
      apiAccess: false,
      customIntegrations: false,
      prioritySupport: true,
      dedicatedManager: false,
      slaGuarantee: false,
      customTraining: false,
      teamCollaboration: false,
      multiBrandManagement: false,
      ssoSaml: false,
    },
    popular: true,
    cta: 'Choisir le Plan Pro',
  },

  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'Pour les marketeurs qui veulent dominer leur niche.',
    monthlyPrice: 25000,
    yearlyPrice: 25000,
    welcomeCredits: 0,
    monthlyCredits: 150,
    stripePriceId: 'price_premium_monthly',
    features: [
      'Tout le plan Pro',
      '150 crédits renouvelés chaque mois',
      '15 Stratégies Complètes / mois',
      'Analyse concurrentielle',
      '5 variantes de hooks',
      'Analyse d\'audience avancée',
      'Stratégie de croissance (3 mois)',
      'Support prioritaire (12h)',
    ],
    limits: {
      businesses: 10,
      competitorIntelligence: true,
      trendIntelligence: true,
      predictiveTrends: true,
      historicalIntelligence: true,
      swotAnalysis: true,
      audienceInsights: true,
      marketShareAnalysis: true,
      trafficEstimation: true,
      growthForecast: true,
      keywordOpportunities: true,
      advertisingIntelligence: true,
      strategyFlash: false,
      strategyCompleteBasic: true,
      strategyCompleteAdvanced: true,
      strategyCompleteElite: false,
      pdfExport: true,
      advancedReports: true,
      whiteLabelReports: true,
      apiAccess: true,
      customIntegrations: false,
      prioritySupport: true,
      dedicatedManager: false,
      slaGuarantee: false,
      customTraining: false,
      teamCollaboration: true,
      multiBrandManagement: false,
      ssoSaml: false,
    },
    cta: 'Choisir le Plan Premium',
  },

  enterprise: {
    id: 'enterprise',
    name: 'Élite',
    description: 'Pour les agences et équipes en croissance rapide.',
    monthlyPrice: 100000,
    yearlyPrice: 100000,
    welcomeCredits: 0,
    monthlyCredits: 500,
    stripePriceId: null,
    features: [
      'Tout le plan Premium',
      '500 crédits renouvelés chaque mois',
      '50 Stratégies Complètes / mois',
      'Consulting stratégique mensuel',
      'Formation personnalisée',
      'Rapports white-label',
      'Support prioritaire 24/7',
      'Accès API',
    ],
    limits: {
      businesses: -1,
      competitorIntelligence: true,
      trendIntelligence: true,
      predictiveTrends: true,
      historicalIntelligence: true,
      swotAnalysis: true,
      audienceInsights: true,
      marketShareAnalysis: true,
      trafficEstimation: true,
      growthForecast: true,
      keywordOpportunities: true,
      advertisingIntelligence: true,
      strategyFlash: false,
      strategyCompleteBasic: true,
      strategyCompleteAdvanced: true,
      strategyCompleteElite: true,
      pdfExport: true,
      advancedReports: true,
      whiteLabelReports: true,
      apiAccess: true,
      customIntegrations: true,
      prioritySupport: true,
      dedicatedManager: true,
      slaGuarantee: true,
      customTraining: true,
      teamCollaboration: true,
      multiBrandManagement: true,
      ssoSaml: true,
    },
    cta: 'Choisir le Plan Élite',
  },
} as const;

export type PlanId = keyof typeof PRICING_CONFIG;

export const PLAN_LABELS: Record<PlanId, string> = {
  free: 'Démo',
  pro: 'Pro',
  premium: 'Premium',
  enterprise: 'Élite',
};

export function normalizePlanId(planId?: string | null): PlanId {
  const normalized = (planId || 'free').toLowerCase().trim();
  const validPlans: PlanId[] = ['free', 'pro', 'premium', 'enterprise'];

  if (normalized === 'elite' || normalized === 'élite') {
    return 'enterprise';
  }

  return validPlans.includes(normalized as PlanId) ? (normalized as PlanId) : 'free';
}

export function getPlan(planId: string): PricingPlan | undefined {
  return PRICING_CONFIG[planId];
}

export function hasFeature(userPlanId: string, requiredPlanId: string): boolean {
  const planOrder: PlanId[] = ['free', 'pro', 'premium', 'enterprise'];
  const userIndex = planOrder.indexOf(userPlanId as PlanId);
  const requiredIndex = planOrder.indexOf(requiredPlanId as PlanId);
  return userIndex >= requiredIndex;
}

export function getPrice(planId: PlanId, isYearly: boolean): number {
  const plan = PRICING_CONFIG[planId];
  return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
}

export function hasPermission(
  userPlanId: string,
  feature: keyof PricingPlan['limits']
): boolean {
  const plan = PRICING_CONFIG[userPlanId];
  if (!plan) return false;
  return plan.limits[feature] === true;
}

export function getLimit(
  userPlanId: string,
  feature: 'monthlyCredits' | 'businesses'
): number {
  const plan = PRICING_CONFIG[normalizePlanId(userPlanId)];
  if (!plan) return 0;
  return feature === 'monthlyCredits' ? plan.monthlyCredits : plan.limits.businesses;
}

export function isQuotaReached(userPlanId: string, used: number): boolean {
  const limit = getLimit(userPlanId, 'monthlyCredits');
  if (limit === -1) return false;
  return used >= limit;
}

export function getQuotaRemaining(userPlanId: string, used: number): number {
  const limit = getLimit(userPlanId, 'monthlyCredits');
  if (limit === -1) return 9999;
  return Math.max(0, limit - used);
}

export function getAvailableFeatures(planId: string): string[] {
  const plan = PRICING_CONFIG[planId];
  if (!plan) return [];
  return plan.features;
}

export function comparePlans(planId1: string, planId2: string): number {
  const planOrder: PlanId[] = ['free', 'pro', 'premium', 'enterprise'];
  const index1 = planOrder.indexOf(planId1 as PlanId);
  const index2 = planOrder.indexOf(planId2 as PlanId);
  return index1 - index2;
}

export function getNextPlan(currentPlanId: string): PlanId | null {
  const planOrder: PlanId[] = ['free', 'pro', 'premium', 'enterprise'];
  const currentIndex = planOrder.indexOf(currentPlanId as PlanId);
  if (currentIndex === -1 || currentIndex === planOrder.length - 1) {
    return null;
  }
  return planOrder[currentIndex + 1];
}

export function isPremiumOrAbove(planId: string): boolean {
  return hasFeature(planId, 'premium');
}

export function isEnterprise(planId: string): boolean {
  return planId === 'enterprise';
}

export function getRemainingGenerations(credits: number, type: 'flash' | 'complete'): number {
  const cost = type === 'flash' ? CREDIT_COSTS.DIAGNOSTIC_FLASH : CREDIT_COSTS.STRATEGIE_COMPLETE;
  if (cost <= 0) return 0;
  return Math.floor(credits / cost);
}

// ======================================================
// ✅ HELPERS DEVISES — Utiliser ces fonctions dans les composants
// ======================================================

/**
 * Retourne le prix d'un plan dans la devise cible (converti depuis XOF).
 * @example getPlanPriceInCurrency('pro', 'EUR') // → 15.24
 */
export function getPlanPriceInCurrency(
  planId: PlanId | string,
  currency: Currency | string = 'XOF',
  isYearly: boolean = true
): number {
  const plan = PRICING_CONFIG[normalizePlanId(planId)];
  if (!plan) return 0;
  const baseXOF = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  return convertFromXOF(baseXOF, currency);
}

/**
 * Formate le prix d'un plan prêt à afficher.
 * @example formatPlanPrice('pro', 'EUR') // → "15,24 € /an"
 */
export function formatPlanPrice(
  planId: PlanId | string,
  currency: Currency | string = 'XOF',
  period: string = '/an',
  isYearly: boolean = true
): string {
  const plan = PRICING_CONFIG[normalizePlanId(planId)];
  if (!plan) return '—';
  const baseXOF = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  if (baseXOF === 0) return '0 FCFA';

  return `${formatPriceFromXOF(baseXOF, currency)}${period}`;
}

/**
 * Retourne le prix d'un pack de recharge dans la devise cible.
 * @example getRechargePrice(10, 'EUR') // → 2.29
 */
export function getRechargePrice(
  credits: number,
  currency: Currency | string = 'XOF'
): number {
  const pack = RECHARGE_PACKS.find((p) => p.credits === credits);
  if (!pack) return 0;
  return convertFromXOF(pack.price, currency);
}

/**
 * Formate le prix d'un pack de recharge.
 * @example formatRechargePrice(10, 'EUR') // → "2,29 €"
 */
export function formatRechargePrice(
  credits: number,
  currency: Currency | string = 'XOF'
): string {
  const pack = RECHARGE_PACKS.find((p) => p.credits === credits);
  if (!pack) return '—';
  return formatPriceFromXOF(pack.price, currency);
}

/**
 * Formate un montant arbitraire exprimé en XOF vers la devise du user.
 * Utile pour les crédits utilisés, revenus, etc.
 */
export function formatAmountFromXOF(
  amountXOF: number,
  currency: Currency | string = 'XOF'
): string {
  return formatPriceFromXOF(amountXOF, currency);
}