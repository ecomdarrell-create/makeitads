'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PostFlashUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingCredits: number;
  strategyId: string;
}

export function PostFlashUpgradeModal({
  isOpen,
  onClose,
  remainingCredits,
  strategyId,
}: PostFlashUpgradeModalProps) {
  const router = useRouter();

  const handleSeeStrategies = () => {
    router.push(`/dashboard/strategies/${strategyId}`);
  };

  const handleUpgrade = () => {
    router.push('/dashboard/pricing');
  };

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
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Header gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] px-5 py-5">
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Diagnostic Flash terminé ✨
                    </h3>
                    <p className="mt-0.5 text-[11px] text-white/80">
                      Votre premier diagnostic est prêt
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-5">
              {/* Statut crédits */}
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                <div className="flex items-start gap-2.5">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">
                      Il vous reste {remainingCredits} crédit{remainingCredits > 1 ? 's' : ''}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
                      Pas assez pour générer une <strong>stratégie complète</strong> (10 crédits).
                    </p>
                  </div>
                </div>
              </div>

              {/* Value prop */}
              <p className="mb-3 text-xs leading-relaxed text-slate-700">
                Vous avez découvert la qualité du <strong>Diagnostic Flash</strong>.
                Pour transformer ce diagnostic en <strong>plan d'action complet</strong>, passez à un plan supérieur :
              </p>

              <ul className="space-y-2 mb-4">
                {[
                  '12 sections détaillées (vs 3 pour le Flash)',
                  'Scripts WhatsApp prêts à copier-coller',
                  'Allocation budgétaire sur 7 jours',
                  'Ciblage précis par ville',
                  'Crédits renouvelés automatiquement chaque mois',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6366F1]" strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl border border-[#6366F1]/20 bg-gradient-to-br from-[#6366F1]/5 to-white p-3">
                <div className="flex items-start gap-2">
                  <Crown className="mt-0.5 h-4 w-4 shrink-0 text-[#6366F1]" />
                  <p className="text-[11px] leading-relaxed text-slate-700">
                    <strong className="text-[#6366F1]">Plan Pro</strong> dès 10 000 FCFA/an —
                    <strong> 50 crédits/mois</strong> + <strong>5 stratégies complètes/mois</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row">
              <button
                onClick={handleSeeStrategies}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                Voir mon diagnostic
              </button>
              <button
                onClick={handleUpgrade}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#6366F1]/30 transition-all hover:scale-[1.02]"
              >
                <Crown className="h-3.5 w-3.5" />
                Passer au plan Pro
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}