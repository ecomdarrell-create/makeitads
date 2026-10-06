'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';
import { PLAN_LABELS, type PlanTier } from '@/config/strategy-sections.config';

// ============================================
// TYPES
// ============================================

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlan: PlanTier;
  sectionTitle?: string;
}

// ============================================
// BÉNÉFICES PAR PLAN
// ============================================

const PLAN_BENEFITS: Record<PlanTier, string[]> = {
  free: [],
  pro: [
    "Stratégie complète en 8 sections",
    "Scripts WhatsApp prêts à copier-coller",
    "Allocation budgétaire détaillée sur 7 jours",
    "Ciblage précis par ville et intérêts",
    "Guide créatif pour vos visuels",
    "KPIs à suivre pour piloter votre campagne",
  ],
  premium: [
    "Tout le plan Pro inclus",
    "Analyse concurrentielle approfondie",
    "5 variantes de hooks publicitaires",
    "Analyse d'audience avancée",
    "Stratégie de croissance sur 3 mois",
    "Support prioritaire sous 12 heures",
  ],
  enterprise: [
    "Tout le plan Premium inclus",
    "Consulting stratégique mensuel",
    "Formation personnalisée pour votre équipe",
    "Accompagnement avancé avec suivi",
    "Rapports white-label exportables",
    "Support prioritaire 24/7 et accès API",
  ],
};

// ============================================
// COMPOSANT
// ============================================

export function UpgradeModal({
  isOpen,
  onClose,
  targetPlan,
  sectionTitle,
}: UpgradeModalProps) {
  // Fermeture avec Echap
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Bloque le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const benefits = PLAN_BENEFITS[targetPlan] || [];
  const targetLabel = PLAN_LABELS[targetPlan];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[300] bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
            >
              {/* Bouton fermeture */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="border-b border-slate-100 px-6 pb-5 pt-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366F1]/10">
                  <Sparkles className="h-5 w-5 text-[#6366F1]" />
                </div>
                <h2 className="text-base font-semibold text-[#18181B]">
                  {sectionTitle
                    ? `« ${sectionTitle} » est disponible avec ${targetLabel}`
                    : `Débloquez les fonctionnalités ${targetLabel}`}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  Vous débloquerez également l&apos;ensemble des fonctionnalités
                  incluses dans ce plan.
                </p>
              </div>

              {/* Bénéfices */}
              <div className="px-6 py-5">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Ce que vous obtiendrez
                </p>
                <ul className="space-y-2.5">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                        <Check
                          className="h-2.5 w-2.5 text-emerald-600"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-xs leading-relaxed text-slate-700">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 bg-slate-50/40 px-6 py-5">
                <Link
                  href="/dashboard/pricing"
                  className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#6366F1]/20 transition-colors hover:bg-[#5558e6]"
                >
                  Passer au plan {targetLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full text-center text-[11px] font-medium text-slate-500 transition-colors hover:text-slate-700"
                >
                  Voir plus tard
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}