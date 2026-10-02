import { FormData } from './types';
import { Loader2 } from 'lucide-react';

interface SummaryProps {
  formData: FormData;
  creditsBalance: number;
  strategyType: 'flash' | 'complete';
  onGenerate: () => void;
  isGenerating: boolean;
}

export function Summary({ formData, creditsBalance, strategyType, onGenerate, isGenerating }: SummaryProps) {
  const cost = strategyType === 'complete' ? 5 : 1;
  const remainingCredits = creditsBalance - cost;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          Votre stratégie
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Vérifiez les informations avant de générer.
        </p>
      </div>

      <div className="space-y-3 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Entreprise</p>
            <p className="text-xs font-medium text-[#111827]">{formData.companyName || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Secteur</p>
            <p className="text-xs font-medium text-[#111827]">{formData.sector || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Produit</p>
            <p className="text-xs font-medium text-[#111827] truncate">{formData.mainProduct || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Audience</p>
            <p className="text-xs font-medium text-[#111827] truncate">{formData.idealClient || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Marché</p>
            <p className="text-xs font-medium text-[#111827]">{formData.mainCountry || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Objectif</p>
            <p className="text-xs font-medium text-[#111827]">{formData.mainObjective || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Budget</p>
            <p className="text-xs font-medium text-[#111827]">{formData.dailyBudget ? `${formData.dailyBudget} FCFA/j` : '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Plateforme</p>
            <p className="text-xs font-medium text-[#111827]">{formData.platform || '-'}</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Coût de génération</span>
          <span className="text-sm font-bold text-[#6366F1]">{cost} crédit{cost > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-700">Solde après génération</span>
          <span className={`text-sm font-bold ${remainingCredits < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {remainingCredits} crédit{remainingCredits !== 1 ? 's' : ''}
          </span>
        </div>
        {remainingCredits < 0 && (
          <p className="text-[10px] text-red-600 mt-2">
            Solde insuffisant. Veuillez recharger vos crédits.
          </p>
        )}
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || remainingCredits < 0}
        className="w-full py-3 px-4 text-sm font-medium text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-lg hover:from-[#5558e6] hover:to-[#7c3aed] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Génération en cours...
          </>
        ) : (
          'Générer ma stratégie'
        )}
      </button>
    </div>
  );
}