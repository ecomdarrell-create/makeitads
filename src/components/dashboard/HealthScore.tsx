'use client';

import { useState } from 'react';
import { ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react';

interface HealthScoreProps {
  score: number;
  profileComplete: boolean;
  strategyCount: number;
}

export function HealthScore({ score, profileComplete, strategyCount }: HealthScoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const recommendations = [
    ...(!profileComplete ? [{ title: 'Complétez les informations du profil', detail: 'Le prénom et le pays sont nécessaires pour contextualiser les recommandations générées.' }] : []),
    ...(strategyCount === 0
      ? [{ title: 'Générez un premier diagnostic', detail: 'Aucune stratégie n’est enregistrée. Les conseils marketing personnalisés seront disponibles après la première génération.' }]
      : [{ title: 'Consultez vos stratégies enregistrées', detail: `${strategyCount} stratégie${strategyCount > 1 ? 's' : ''} ${strategyCount > 1 ? 'sont' : 'est'} disponible${strategyCount > 1 ? 's' : ''} dans votre historique.` }]),
  ];

  let ringColor = '#ef4444';
  let message = 'Cet indice mesure les informations disponibles dans votre compte, pas les performances de vos campagnes.';

  if (score >= 50) {
    ringColor = '#f59e0b';
    message = 'Votre profil ou votre historique contient des éléments utiles. Les résultats de campagne ne sont pas mesurés ici.';
  }

  if (score >= 80) {
    ringColor = '#22c55e';
    message = 'Profil renseigné et stratégie enregistrée. Cet indice ne représente pas un score de performance publicitaire.';
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs sm:text-sm font-semibold text-[#111827]">Indice de préparation</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#6366F1]/10 px-2 py-0.5 text-[9px] font-medium text-[#6366F1]">
          <Sparkles className="h-2.5 w-2.5" />
          Données du compte
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-24 w-24 shrink-0">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 120 120" aria-label={`Indice de préparation ${score} sur 100`}>
            <circle cx="60" cy="60" r={radius} stroke="#E5E7EB" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={ringColor}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#111827]">{score}</span>
            <span className="text-[10px] text-gray-500">/100</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] leading-relaxed text-gray-600">{message}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[10px] font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        {isExpanded ? 'Masquer les recommandations' : 'Voir les recommandations'}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {recommendations.map((recommendation, index) => (
              <div key={recommendation.title} className="rounded-lg border border-gray-200 bg-[#F9FAFB] p-3">
              <div className="mb-1 flex items-center gap-2">
                {index === 0 ? <Target className="h-3.5 w-3.5 text-[#6366F1]" /> : <TrendingUp className="h-3.5 w-3.5 text-[#6366F1]" />}
                <p className="text-[11px] font-semibold text-[#111827]">{recommendation.title}</p>
              </div>
              <p className="text-[10px] leading-relaxed text-gray-600">{recommendation.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}