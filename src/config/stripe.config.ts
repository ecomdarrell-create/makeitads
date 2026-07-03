// Configuration Stripe - Prix des abonnements
// Les Price IDs sont chargés depuis les variables d'environnement Vercel

export const STRIPE_PRICES = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || '',
  },
  premium: {
    monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || '',
  },
  enterprise: {
    monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || '',
  },
} as const;

export type PlanName = 'pro' | 'premium' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

// ✅ CORRECTION : Vérification améliorée
export function getStripePriceId(planName: PlanName, billingCycle: BillingCycle): string {
  // Vérifier que le plan existe
  if (!(planName in STRIPE_PRICES)) {
    throw new Error(`Invalid plan: ${planName}. Available plans: pro, premium, enterprise.`);
  }

  const priceId = STRIPE_PRICES[planName][billingCycle];
  
  if (!priceId) {
    throw new Error(`Price ID not found for ${planName} ${billingCycle}. Check environment variables.`);
  }
  
  return priceId;
}

// ✅ NOUVELLE FONCTION : Vérifier si Stripe est configuré
export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_PRICE_PRO_MONTHLY &&
    process.env.STRIPE_PRICE_PRO_YEARLY &&
    process.env.STRIPE_PRICE_PREMIUM_MONTHLY &&
    process.env.STRIPE_PRICE_PREMIUM_YEARLY
  );
}

// Configuration des plans pour l'affichage
export const PLANS = {
  free: {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for testing the waters.',
    features: [
      '1 strategy per month',
      'Basic market analysis',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    price: { monthly: 29, yearly: 23 },
    description: 'For growing businesses.',
    features: [
      'Everything in Free',
      '10 strategies/month',
      'Competitor intelligence',
      'PDF Export',
    ],
    popular: true,
  },
  premium: {
    name: 'Premium',
    price: { monthly: 59, yearly: 47 },
    description: 'For serious marketers.',
    features: [
      'Everything in Pro',
      'Unlimited strategies',
      'Real-time tracking',
      'API access',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: { monthly: 149, yearly: 119 },
    description: 'For agencies & teams.',
    features: [
      'Everything in Premium',
      'Multi-brand',
      'Dedicated manager',
      'SLA guarantee',
    ],
  },
} as const;