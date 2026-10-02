import Link from 'next/link';
import { Check, Lock } from 'lucide-react';
import { normalizePlanId } from '@/config/pricing.config';

interface PlanFeaturesProps {
  currentPlan: string;
}

interface Feature {
  name: string;
  available: boolean;
  required?: string;
}

interface Plan {
  name: string;
  price: string;
  features: Feature[];
}

const plans: Record<string, Plan> = {
  free: {
    name: 'Gratuit',
    price: '0 FCFA',
    features: [
      { name: '10 crédits de bienvenue (offre unique)', available: true },
      { name: 'Diagnostic Flash', available: true },
      { name: 'Stratégies basiques', available: true },
      { name: 'Support communautaire', available: true },
      { name: 'Stratégie complète 360°', available: false, required: 'pro' },
      { name: 'Analyse concurrentielle', available: false, required: 'premium' },
      { name: 'Génération de hooks avancée', available: false, required: 'premium' },
      { name: 'Support prioritaire', available: false, required: 'enterprise' },
      { name: 'Consulting dédié', available: false, required: 'enterprise' },
    ]
  },
  pro: {
    name: 'Pro',
    price: '10 000 FCFA/an',
    features: [
      { name: '15 crédits renouvelés chaque mois', available: true },
      { name: 'Diagnostic Flash', available: true },
      { name: 'Stratégie complète 360°', available: true },
      { name: 'Scripts WhatsApp', available: true },
      { name: 'Support email', available: true },
      { name: 'Analyse concurrentielle', available: false, required: 'premium' },
      { name: 'Génération de hooks avancée', available: false, required: 'premium' },
      { name: 'Support prioritaire', available: false, required: 'enterprise' },
      { name: 'Consulting dédié', available: false, required: 'enterprise' },
    ]
  },
  premium: {
    name: 'Premium',
    price: '25 000 FCFA/an',
    features: [
      { name: '30 crédits renouvelés chaque mois', available: true },
      { name: 'Toutes les fonctionnalités Pro', available: true },
      { name: 'Analyse concurrentielle', available: true },
      { name: 'Génération de hooks avancée', available: true },
      { name: 'Analyse d\'audience', available: true },
      { name: 'Support prioritaire', available: false, required: 'enterprise' },
      { name: 'Consulting dédié', available: false, required: 'enterprise' },
    ]
  },
  enterprise: {
    name: 'Élite',
    price: '100 000 FCFA/an',
    features: [
      { name: '80 crédits renouvelés chaque mois', available: true },
      { name: 'Toutes les fonctionnalités Premium', available: true },
      { name: 'Support prioritaire 24/7', available: true },
      { name: 'Consulting dédié mensuel', available: true },
      { name: 'Accès anticipé aux nouvelles fonctionnalités', available: true },
      { name: 'Formation personnalisée', available: true },
    ]
  }
};

export function PlanFeatures({ currentPlan }: PlanFeaturesProps) {
  const normalizedPlan = normalizePlanId(currentPlan);
  const planData = plans[normalizedPlan] || plans.free;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-[#111827]">Votre plan : {planData.name}</h3>
          <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">{planData.price}</p>
        </div>
        {currentPlan === 'free' && (
          <Link
            href="/pricing"
            className="text-[10px] sm:text-xs font-medium text-[#6366F1] bg-indigo-50 px-2.5 py-1 rounded hover:bg-indigo-100 transition-colors"
          >
            Upgrader
          </Link>
        )}
      </div>

      <div className="space-y-2">
        {planData.features.map((feature, index) => (
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
                  Disponible avec le plan {plans[feature.required]?.name}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}