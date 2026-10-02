'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface LoadingGenerationProps {
  strategyType: 'flash' | 'complete';
}

const steps = [
  { label: 'Analyse de votre entreprise', duration: 2000 },
  { label: 'Étude de votre marché', duration: 2500 },
  { label: 'Identification de votre audience', duration: 2000 },
  { label: 'Construction du positionnement', duration: 2500 },
  { label: 'Élaboration de la stratégie', duration: 3000 },
  { label: 'Génération des recommandations', duration: 2000 },
  { label: 'Finalisation de votre stratégie', duration: 1500 },
];

export function LoadingGeneration({ strategyType }: LoadingGenerationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    let accumulatedTime = 0;

    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index);
      }, accumulatedTime);
      timers.push(timer);
      accumulatedTime += step.duration;
    });

    const completeTimer = setTimeout(() => {
      setCompletedSteps(steps.map((_, i) => i));
    }, accumulatedTime);
    timers.push(completeTimer);

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center py-12">
      {/* Icône animée */}
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      </div>

      {/* Titre */}
      <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-2 text-center">
        {strategyType === 'complete' ? 'Construction de votre stratégie complète' : 'Génération de votre diagnostic'}
      </h2>
      <p className="text-xs text-gray-600 mb-8 text-center max-w-md">
        Notre IA analyse vos informations et construit une stratégie personnalisée. Cela peut prendre quelques instants.
      </p>

      {/* Étapes */}
      <div className="w-full max-w-md space-y-2.5">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index && !isCompleted;
          const isPending = index > currentStep && !isCompleted;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-50 border border-indigo-200'
                  : isCompleted
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200 opacity-50'
              }`}
            >
              {/* Icône */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                    ? 'bg-[#6366F1]'
                    : 'bg-gray-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                ) : (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium ${
                  isCompleted
                    ? 'text-green-700'
                    : isCurrent
                    ? 'text-[#6366F1]'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>

              {/* Status */}
              <div className="ml-auto">
                {isCompleted && (
                  <span className="text-[9px] text-green-600 font-medium">Terminé</span>
                )}
                {isCurrent && (
                  <span className="text-[9px] text-[#6366F1] font-medium">En cours...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message d'attente */}
      <p className="text-[10px] text-gray-500 mt-6 text-center">
        Veuillez ne pas fermer cette page pendant la génération.
      </p>
    </div>
  );
}