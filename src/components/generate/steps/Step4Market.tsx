import { FormData } from '../types';

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function Step4Market({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          Comprenons votre environnement.
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Analyser votre marché nous aide à vous positionner efficacement.
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Pays principal de ciblage
        </label>
        <input
          type="text"
          value={formData.mainCountry}
          onChange={(e) => updateFormData({ mainCountry: e.target.value })}
          placeholder="Cameroun"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Niveau de concurrence
        </label>
        <select
          value={formData.competitionLevel}
          onChange={(e) => updateFormData({ competitionLevel: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="low">Faible</option>
          <option value="medium">Moyen</option>
          <option value="high">Élevé</option>
          <option value="unknown">Je ne sais pas</option>
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Principaux concurrents (jusqu'à 5)
        </label>
        <textarea
          value={formData.competitors}
          onChange={(e) => updateFormData({ competitors: e.target.value })}
          placeholder="Nom 1, Nom 2, Nom 3..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Quelle entreprise admirez-vous dans votre secteur ? (optionnel)
        </label>
        <input
          type="text"
          value={formData.admiredCompany}
          onChange={(e) => updateFormData({ admiredCompany: e.target.value })}
          placeholder="Ex: Apple, Nike..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Quelle est votre position actuelle ?
        </label>
        <select
          value={formData.currentPosition}
          onChange={(e) => updateFormData({ currentPosition: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="new">Nouveau</option>
          <option value="growing">En croissance</option>
          <option value="established">Établi</option>
          <option value="leader">Leader local</option>
        </select>
      </div>
    </div>
  );
}