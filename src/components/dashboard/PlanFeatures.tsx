import Link from 'next/link';
import { Check, Lock } from 'lucide-react';
import { normalizePlanId } from '@/config/pricing.config';
import { formatPlanPrice, normalizeCurrency, getCurrencySymbol, type Currency } from '@/lib/currency';

interface PlanFeaturesProps {
  currentPlan: string;
  currency?: string; // ✅ Ajout de la propriété currency (optionnelle)
}

interface Feature {
  name: string;
  available: boolean;
  required?: string;
}

// On sépare la configuration des fonctionnalités pour pouvoir injecter le prix dynamiquement
const featuresConfig: Record<string, Feature[]> = {
  free: [
    { name: '10 crédits de bienvenue (offre unique)', available: true },
    { name: 'Diagnostic Flash', available: true },
    { name: 'Stratégies basiques', available: true },
    { name: 'Support communautaire', available: true },
    { name: 'Stratégie complète 360°', available: false, required: 'pro' },
    { name: 'Analyse concurrentielle', available: false, required: 'premium' },
    { name: 'Génération de hooks avancée', available: false, required: 'premium' },
    { name: 'Support prioritaire', available: false, required: 'enterprise' },
    { name: 'Consulting dédié', available: false, required: 'enterprise' },
  ],
  pro: [
    { name: '15 crédits renouvelés chaque mois', available: true },
    { name: 'Diagnostic Flash', available: true },
    { name: 'Stratégie complète 360°', available: true },
    { name: 'Scripts WhatsApp', available: true },
    { name: 'Support email', available: true },
    { name: 'Analyse concurrentielle', available: false, required: 'premium' },
    { name: 'Génération de hooks avancée', available: false, required: 'premium' },
    { name: 'Support prioritaire', available: false, required: 'enterprise' },
    { name: 'Consulting dédié', available: false, required: 'enterprise' },
  ],
  premium: [
    { name: '30 crédits renouvelés chaque mois', available: true },
    { name: 'Toutes les fonctionnalités Pro', available: true },
    { name: 'Analyse concurrentielle', available: true },
    { name: 'Génération de hooks avancée', available: true },
    { name: "Analyse d'audience", available: true },
    { name: 'Support prioritaire', available: false, required: 'enterprise' },
    { name: 'Consulting dédié', available: false, required: 'enterprise' },
  ],
  enterprise: [
    { name: '80 crédits renouvelés chaque mois', available: true },
    { name: 'Toutes les fonctionnalités Premium', available: true },
    { name: 'Support prioritaire 24/7', available: true },
    { name: 'Consulting dédié mensuel', available: true },
    { name: 'Accès anticipé aux nouvelles fonctionnalités', available: true },
    { name: 'Formation personnalisée', available: true },
  ]
};

export function PlanFeatures({ currentPlan, currency }: PlanFeaturesProps) {
  const normalizedPlan = normalizePlanId(currentPlan);
  const safeCurrency = normalizeCurrency(currency); // Garantit que c'est 'XOF', 'EUR' ou 'USD'

  // Calcul du prix dynamique en fonction de la devise de l'utilisateur
  let dynamicPrice = `0 ${getCurrencySymbol(safeCurrency)}`;
  if (normalizedPlan === 'pro') dynamicPrice = formatPlanPrice('pro', safeCurrency);
  else if (normalizedPlan === 'premium') dynamicPrice = formatPlanPrice('premium', safeCurrency);
  else if (normalizedPlan === 'enterprise') dynamicPrice = formatPlanPrice('enterprise', safeCurrency);

  const planName = normalizedPlan === 'free' ? 'Démo' : normalizedPlan === 'enterprise' ? 'Élite' : normalizedPlan.charAt(0).toUpperCase() + normalizedPlan.slice(1);
  const planFeatures = featuresConfig[normalizedPlan] || featuresConfig.free;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-[#111827]">Votre plan : {planName}</h3>
          <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">{dynamicPrice}</p>
        </div>
        {currentPlan === 'free' && (
          <Link
            href="/dashboard/pricing"
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
                  Disponible avec le plan {featuresConfig[feature.required] ? (feature.required === 'enterprise' ? 'Élite' : feature.required.charAt(0).toUpperCase() + feature.required.slice(1)) : ''}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}