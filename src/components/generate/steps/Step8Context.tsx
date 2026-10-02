import { FormData } from '../types';

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function Step8Context({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          Y a-t-il quelque chose que MakeItAds doit savoir ?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Ces informations contextuelles nous aident à affiner votre stratégie.
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Contraintes budgétaires (optionnel)
        </label>
        <textarea
          value={formData.budgetConstraints}
          onChange={(e) => updateFormData({ budgetConstraints: e.target.value })}
          placeholder="Ex: Budget limité, besoin de ROI rapide..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Saisonnalité (optionnel)
        </label>
        <input
          type="text"
          value={formData.seasonality}
          onChange={(e) => updateFormData({ seasonality: e.target.value })}
          placeholder="Ex: Pic en décembre, creux en août..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Promotions à venir (optionnel)
        </label>
        <input
          type="text"
          value={formData.upcomingPromotions}
          onChange={(e) => updateFormData({ upcomingPromotions: e.target.value })}
          placeholder="Ex: Black Friday, soldes d'été..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Date de lancement prévue (optionnel)
        </label>
        <input
          type="date"
          value={formData.launchDate}
          onChange={(e) => updateFormData({ launchDate: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Informations supplémentaires (optionnel)
        </label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
          placeholder="Tout ce que vous jugez utile de nous communiquer..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
    </div>
  );
}