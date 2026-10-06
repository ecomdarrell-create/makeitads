import { FormData } from '../types';
import { RequiredLabel } from '../RequiredLabel';

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function Step3Audience({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          À qui voulez-vous vendre ?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Un ciblage précis augmente vos chances de conversion.
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          <RequiredLabel>Client idéal (description)</RequiredLabel>
        </label>
        <textarea
          value={formData.idealClient}
          required
          onChange={(e) => updateFormData({ idealClient: e.target.value })}
          placeholder="Ex: Femmes actives 25-40 ans, soucieuses de leur apparence..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Sexe
          </label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData({ gender: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Sélectionnez...</option>
            <option value="men">Hommes</option>
            <option value="women">Femmes</option>
            <option value="all">Tous</option>
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Tranche d&apos;âge
          </label>
          <input
            type="text"
            value={formData.ageRange}
            onChange={(e) => updateFormData({ ageRange: e.target.value })}
            placeholder="25-40"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            <RequiredLabel>Pays ciblé</RequiredLabel>
          </label>
          <input
            type="text"
            required
            value={formData.country}
            onChange={(e) => updateFormData({ country: e.target.value })}
            placeholder="Cameroun"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Ville / région
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            placeholder="Douala"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Pouvoir d&apos;achat approximatif
        </label>
        <select
          value={formData.purchasingPower}
          onChange={(e) => updateFormData({ purchasingPower: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="low">Faible</option>
          <option value="medium">Moyen</option>
          <option value="high">Élevé</option>
          <option value="very_high">Très élevé</option>
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Comment ces clients découvrent-ils actuellement votre produit ?
        </label>
        <select
          value={formData.discoveryChannel}
          onChange={(e) => updateFormData({ discoveryChannel: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="google">Google</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="word_of_mouth">Bouche-à-oreille</option>
          <option value="other">Autre</option>
        </select>
      </div>
    </div>
  );
}