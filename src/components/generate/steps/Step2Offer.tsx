import { FormData } from '../types';
import { RequiredLabel } from '../RequiredLabel';
import { getCurrencySymbol, normalizeCurrency } from '@/lib/currency';

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  currency?: string;
}

export function Step2Offer({ formData, updateFormData, currency = 'XOF' }: StepProps) {
  // ✅ Symbole de devise dynamique (FCFA, €, $)
  const currencySymbol = getCurrencySymbol(normalizeCurrency(currency));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          Que cherchez-vous à vendre ?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Comprendre votre offre nous aide à construire un message percutant.
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          <RequiredLabel>Produit ou service principal</RequiredLabel>
        </label>
        <input
          type="text"
          required
          value={formData.mainProduct}
          onChange={(e) => updateFormData({ mainProduct: e.target.value })}
          placeholder="Ex: Crème hydratante bio"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Prix ({currencySymbol})
          </label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => updateFormData({ price: e.target.value })}
            placeholder="15000"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Prix promo (optionnel)
          </label>
          <input
            type="text"
            value={formData.promoPrice}
            onChange={(e) => updateFormData({ promoPrice: e.target.value })}
            placeholder="12000"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Pourquoi un client devrait-il vous choisir ?
        </label>
        <textarea
          value={formData.whyChooseYou}
          onChange={(e) => updateFormData({ whyChooseYou: e.target.value })}
          placeholder="Votre avantage concurrentiel principal..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Quel problème résolvez-vous ?
        </label>
        <textarea
          value={formData.problemSolved}
          onChange={(e) => updateFormData({ problemSolved: e.target.value })}
          placeholder="Le problème principal que votre produit résout..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          L&apos;offre est-elle déjà commercialisée ?
        </label>
        <select
          value={formData.isCommercialized}
          onChange={(e) => updateFormData({ isCommercialized: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="yes">Oui</option>
          <option value="no">Non</option>
        </select>
      </div>
    </div>
  );
}