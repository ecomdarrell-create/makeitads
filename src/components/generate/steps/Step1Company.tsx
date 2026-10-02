import { FormData } from '../types';

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function Step1Company({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          Comprenons votre entreprise.
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Ces informations nous permettent de personnaliser votre stratégie.
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Nom de l'entreprise
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => updateFormData({ companyName: e.target.value })}
          placeholder="Ex: Maison K"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Que fait votre entreprise ?
        </label>
        <textarea
          value={formData.companyDescription}
          onChange={(e) => updateFormData({ companyDescription: e.target.value })}
          placeholder="Décrivez votre activité en quelques phrases..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Secteur d'activité
        </label>
        <select
          value={formData.sector}
          onChange={(e) => updateFormData({ sector: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="ecommerce">E-commerce</option>
          <option value="mode">Mode</option>
          <option value="beaute">Beauté</option>
          <option value="sante">Santé</option>
          <option value="immobilier">Immobilier</option>
          <option value="formation">Formation</option>
          <option value="services">Services</option>
          <option value="technologie">Technologie</option>
          <option value="restauration">Restauration</option>
          <option value="finance">Finance</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Depuis combien de temps existe votre activité ?
        </label>
        <select
          value={formData.companyAge}
          onChange={(e) => updateFormData({ companyAge: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="less_6_months">Moins de 6 mois</option>
          <option value="6_12_months">6-12 mois</option>
          <option value="1_3_years">1-3 ans</option>
          <option value="3_5_years">3-5 ans</option>
          <option value="5_plus_years">5 ans +</option>
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Taille actuelle
        </label>
        <select
          value={formData.companySize}
          onChange={(e) => updateFormData({ companySize: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="solo">Solo</option>
          <option value="2_5">2-5 personnes</option>
          <option value="6_20">6-20</option>
          <option value="21_50">21-50</option>
          <option value="50_plus">50+</option>
        </select>
      </div>
    </div>
  );
}