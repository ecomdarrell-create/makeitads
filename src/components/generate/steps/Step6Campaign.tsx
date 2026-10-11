import { FormData } from '../types';
import { getCurrencySymbol, normalizeCurrency } from '@/lib/currency';

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  currency?: string;
}

export function Step6Campaign({ formData, updateFormData, currency = 'XOF' }: StepProps) {
  // ✅ Symbole de devise dynamique (FCFA, €, $)
  const currencySymbol = getCurrencySymbol(normalizeCurrency(currency));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          Construisons votre campagne.
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Définissez les paramètres techniques de votre campagne publicitaire.
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Plateforme principale
        </label>
        <select
          value={formData.platform}
          onChange={(e) => updateFormData({ platform: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="meta">Meta (Facebook/Instagram)</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="google">Google</option>
          <option value="multiple">Plusieurs plateformes</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Budget quotidien ({currencySymbol})
          </label>
          <input
            type="text"
            value={formData.dailyBudget}
            onChange={(e) => updateFormData({ dailyBudget: e.target.value })}
            placeholder="10000"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Durée prévue
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => updateFormData({ duration: e.target.value })}
            placeholder="Ex: 30 jours"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Destination de la publicité
        </label>
        <select
          value={formData.destination}
          onChange={(e) => updateFormData({ destination: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="website">Site web</option>
          <option value="landing_page">Landing page</option>
          <option value="form">Formulaire</option>
          <option value="instagram">Instagram</option>
          <option value="messenger">Messenger</option>
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Avez-vous déjà une campagne active ?
        </label>
        <select
          value={formData.hasActiveCampaign}
          onChange={(e) => updateFormData({ hasActiveCampaign: e.target.value })}
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