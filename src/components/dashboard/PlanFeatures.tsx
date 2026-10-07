import Link from 'next/link';
import { Check, Lock } from 'lucide-react';
import { normalizePlanId } from '@/config/pricing.config';
import { formatPlanPrice, normalizeCurrency, getCurrencySymbol } from '@/lib/currency';

interface PlanFeaturesProps {
  currentPlan: string;
  currency?: string;
}

interface Feature {
  name: string;
  available: boolean;
  required?: string;
}

// ============================================
// CONFIGURATION DES FONCTIONNALITÉS PAR PLAN
// (alignée sur pricing.config.ts)
// ============================================

const featuresConfig: Record<string, Feature[]> = {
  free: [
    { name: '10 crédits de bienvenue (offre unique)', available: true },
    { name: '2 Diagnostics Flash', available: true },
    { name: 'Aperçu rapide de votre activité', available: true },
    { name: 'Support communautaire', available: true },
    { name: 'Stratégie complète 360°', available: false, required: 'pro' },
    { name: 'Analyse concurrentielle', available: false, required: 'premium' },
    { name: 'Génération de hooks avancée', available: false, required: 'premium' },
    { name: 'Support prioritaire', available: false, required: 'enterprise' },
    { name: 'Consulting dédié', available: false, required: 'enterprise' },
  ],
  pro: [
    { name: '50 crédits renouvelés chaque mois', available: true },
    { name: '5 Stratégies complètes / mois', available: true },
    { name: '12 sections détaillées', available: true },
    { name: 'Scripts WhatsApp prêts à l\'emploi', available: true },
    { name: 'Support email (48h)', available: true },
    { name: 'Analyse concurrentielle', available: false, required: 'premium' },
    { name: 'Génération de hooks avancée', available: false, required: 'premium' },
    { name: 'Support prioritaire', available: false, required: 'enterprise' },
    { name: 'Consulting dédié', available: false, required: 'enterprise' },
  ],
  premium: [
    { name: '150 crédits renouvelés chaque mois', available: true },
    { name: '15 Stratégies complètes / mois', available: true },
    { name: 'Analyse concurrentielle', available: true },
    { name: '5 variantes de hooks', available: true },
    { name: 'Analyse d\'audience avancée', available: true },
    { name: 'Stratégie de croissance 3 mois', available: true },
    { name: 'Support prioritaire (12h)', available: true },
    { name: 'Support 24/7 dédié', available: false, required: 'enterprise' },
    { name: 'Consulting dédié', available: false, required: 'enterprise' },
  ],
  enterprise: [
    { name: '500 crédits renouvelés chaque mois', available: true },
    { name: '50 Stratégies complètes / mois', available: true },
    { name: 'Consulting stratégique mensuel', available: true },
    { name: 'Formation personnalisée', available: true },
    { name: 'Accompagnement avancé', available: true },
    { name: 'Rapports white-label', available: true },
    { name: 'Support prioritaire 24/7', available: true },
    { name: 'Accès API', available: true },
  ],
};

export function PlanFeatures({ currentPlan, currency }: PlanFeaturesProps) {
  const normalizedPlan = normalizePlanId(currentPlan);
  const safeCurrency = normalizeCurrency(currency);

  let dynamicPrice = `0 ${getCurrencySymbol(safeCurrency)}`;
  if (normalizedPlan === 'pro') dynamicPrice = formatPlanPrice('pro', safeCurrency);
  else if (normalizedPlan === 'premium') dynamicPrice = formatPlanPrice('premium', safeCurrency);
  else if (normalizedPlan === 'enterprise') dynamicPrice = formatPlanPrice('enterprise', safeCurrency);

  const planName =
    normalizedPlan === 'free'
      ? 'Démo'
      : normalizedPlan === 'enterprise'
        ? 'Élite'
        : normalizedPlan.charAt(0).toUpperCase() + normalizedPlan.slice(1);

  const planFeatures = featuresConfig[normalizedPlan] || featuresConfig.free;

  return (
    <div
      data-tour="plan-features"
      className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-[#111827]">
            Votre plan : {planName}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">
            {dynamicPrice}
          </p>
        </div>
        {currentPlan === 'free' && (
          <Link
            href="/dashboard/pricing"
            data-tour="plan-upgrade-cta"
            className="text-[10px] sm:text-xs font-medium text-[#6366F1] bg-indigo-50 px-2.5 py-1 rounded hover:bg-indigo-100 transition-colors"
          >
            Upgrader
          </Link>
        )}
      </div>

      <div className="space-y-2">
        {planFeatures.map((feature, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${!feature.available ? 'opacity-40' : ''}`}
          >
            {feature.available ? (
              <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-[10px] sm:text-xs text-gray-700 flex-1">
              {feature.name}
              {!feature.available && feature.required && (
                <span className="block text-[9px] text-gray-500 mt-0.5">
                  Disponible avec le plan{' '}
                  {feature.required === 'enterprise'
                    ? 'Élite'
                    : feature.required.charAt(0).toUpperCase() +
                      feature.required.slice(1)}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}