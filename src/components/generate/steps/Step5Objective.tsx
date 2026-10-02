import { FormData } from '../types';

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function Step5Objective({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          Quel résultat voulez-vous obtenir ?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Un objectif clair permet de mesurer le succès de votre campagne.
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Objectif principal
        </label>
        <select
          value={formData.mainObjective}
          onChange={(e) => updateFormData({ mainObjective: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="sales">Ventes</option>
          <option value="leads">Leads</option>
          <option value="whatsapp_messages">Messages WhatsApp</option>
          <option value="traffic">Trafic</option>
          <option value="downloads">Téléchargements</option>
          <option value="appointments">Rendez-vous</option>
          <option value="awareness">Notoriété</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Objectif chiffré
          </label>
          <input
            type="text"
            value={formData.numericObjective}
            onChange={(e) => updateFormData({ numericObjective: e.target.value })}
            placeholder="Ex: 50 prospects/mois"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Délai
          </label>
          <input
            type="text"
            value={formData.deadline}
            onChange={(e) => updateFormData({ deadline: e.target.value })}
            placeholder="Ex: 30 jours"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Priorité
        </label>
        <select
          value={formData.priority}
          onChange={(e) => updateFormData({ priority: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="immediate">Immédiate</option>
          <option value="30_days">30 jours</option>
          <option value="90_days">90 jours</option>
        </select>
      </div>
    </div>
  );
}