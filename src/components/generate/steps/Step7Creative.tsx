import { FormData } from '../types';

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function Step7Creative({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          Comment voulez-vous parler à votre audience ?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Le ton et les visuels sont essentiels pour capter l'attention.
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Ton de communication
        </label>
        <select
          value={formData.communicationTone}
          onChange={(e) => updateFormData({ communicationTone: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="professional">Professionnel</option>
          <option value="premium">Premium</option>
          <option value="direct">Direct</option>
          <option value="educational">Éducatif</option>
          <option value="emotional">Émotionnel</option>
          <option value="humorous">Humoristique</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Type de contenu disponible
        </label>
        <select
          value={formData.availableContent}
          onChange={(e) => updateFormData({ availableContent: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="photos">Photos</option>
          <option value="videos">Vidéos</option>
          <option value="ugc">UGC (contenu utilisateur)</option>
          <option value="testimonials">Témoignages</option>
          <option value="demos">Démonstrations</option>
          <option value="before_after">Avant/Après</option>
          <option value="none">Aucun</option>
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Avez-vous une personne pouvant apparaître dans les publicités ?
        </label>
        <select
          value={formData.hasSpokesperson}
          onChange={(e) => updateFormData({ hasSpokesperson: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="yes">Oui</option>
          <option value="no">Non</option>
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Principaux arguments de vente
        </label>
        <textarea
          value={formData.mainArguments}
          onChange={(e) => updateFormData({ mainArguments: e.target.value })}
          placeholder="Listez vos 3-5 arguments principaux..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
    </div>
  );
}