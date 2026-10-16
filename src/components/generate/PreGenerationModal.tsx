'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PreGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  plan: string;
  strategyType: 'flash' | 'complete';
  creditsBalance: number;
}

const PLAN_BENEFITS: Record<string, { title: string; features: string[] }> = {
  free: {
    title: 'Vous êtes sur le plan Démo',
    features: [
      'Diagnostic Flash : aperçu en 3 sections (diagnostic, avatar client, angle)',
      'Analyse calibrée pour le marché africain',
      'Résultats actionnables immédiatement',
      'Upgrade possible à tout moment pour des stratégies complètes',
    ],
  },
  pro: {
    title: 'Vous êtes sur le plan Pro',
    features: [
      'Stratégie complète en 12 sections détaillées',
      'Scripts WhatsApp prêts à copier-coller',
      'Allocation budgétaire sur 7 jours',
      'Ciblage précis par ville et audience',
    ],
  },
  premium: {
    title: 'Vous êtes sur le plan Premium',
    features: [
      'Stratégie complète en 12 sections + analyses avancées',
      'Analyse concurrentielle approfondie',
      '5 variantes de hooks publicitaires',
      'Plan de croissance sur 3 mois',
    ],
  },
  enterprise: {
    title: 'Vous êtes sur le plan Élite',
    features: [
      'Stratégie complète en 12 sections + recommandations élite',
      'Analyses avancées et prévisions de croissance',
      'Rapports white-label prêts à partager',
      'Support prioritaire 24/7',
    ],
  },
};

export function PreGenerationModal({
  isOpen,
  onClose,
  onContinue,
  plan,
  strategyType,
  creditsBalance,
}: PreGenerationModalProps) {
  const benefits = PLAN_BENEFITS[plan] || PLAN_BENEFITS.free;
  const cost = strategyType === 'flash' ? 4 : 10;
  const afterBalance = creditsBalance - cost;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Avant de générer
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Voici ce que vous allez obtenir
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
              <p className="mb-3 text-[12px] font-medium text-[#6366F1]">
                {benefits.title}
              </p>

              <ul className="space-y-2 mb-4">
                {benefits.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Coût de cette génération</span>
                  <span className="font-semibold text-slate-900">{cost} crédits</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Solde après génération</span>
                  <span className={`font-semibold ${afterBalance < 0 ? 'text-red-600' : afterBalance < 4 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {afterBalance} crédit{afterBalance > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={onContinue}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#6366F1] px-5 py-2 text-xs font-semibold text-white shadow-md shadow-[#6366F1]/20 transition-colors hover:bg-[#5558e6]"
              >
                Continuer
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}