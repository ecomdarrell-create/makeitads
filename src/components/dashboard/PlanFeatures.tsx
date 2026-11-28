import Link from 'next/link';
import { Check, Lock, Crown, ArrowRight } from 'lucide-react';
import { normalizePlanId, formatPlanPrice } from '@/config/pricing.config';
import { normalizeCurrency, getCurrencySymbol } from '@/lib/currency';

interface PlanFeaturesProps {
  currentPlan: string;
  currency?: string;
}

interface Feature {
  name: string;
  available: boolean;
  required?: string;
}

const featuresConfig: Record<string, Feature[]> = {
  free: [
    { name: '0 crédit inclus', available: false, required: 'pro' },
    { name: 'Génération de stratégies bloquée', available: false, required: 'pro' },
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
  const isFree = normalizedPlan === 'free';

  let dynamicPrice: string;
  if (isFree) {
    dynamicPrice = 'Aucun plan actif'; // ✅ Remplacement de "Gratuit"
  } else {
    dynamicPrice = formatPlanPrice(normalizedPlan as 'pro' | 'premium' | 'enterprise', safeCurrency, '/an');
  }

  const planName = isFree ? 'Aucun plan actif' : normalizedPlan === 'enterprise' ? 'Élite' : normalizedPlan.charAt(0).toUpperCase() + normalizedPlan.slice(1);
  const planFeatures = featuresConfig[normalizedPlan] || featuresConfig.free;

  return (
    <div data-tour="plan-features" className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-[#111827]">
            Votre plan
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium">
            {planName} {!isFree && `— ${dynamicPrice}`}
          </p>
        </div>
        
        {/* ✅ NOUVEAU BOUTON PILULE SOLIDE */}
        {isFree && (
          <Link
            href="/dashboard/pricing"
            prefetch={true}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#6366F1] px-3 py-1.5 text-[10px] sm:text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-[#5558e6]"
          >
            <Crown className="h-3 w-3" />
            Souscrire
            <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        )}
      </div>

      <div className="space-y-2">
        {planFeatures.map((feature, index) => (
          <div key={index} className={`flex items-start gap-2 ${!feature.available ? 'opacity-40' : ''}`}>
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
                  {feature.required === 'enterprise' ? 'Élite' : feature.required.charAt(0).toUpperCase() + feature.required.slice(1)}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}