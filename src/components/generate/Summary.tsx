'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  Target,
  Globe2,
  Crosshair,
  Layers,
  Wallet,
  Sparkles,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import type { FormData } from './types';

// ============================================
// TYPES
// ============================================

interface SummaryProps {
  formData: FormData;
  creditsBalance: number;
  generationCost: number;
  onGenerate: () => void;
  isGenerating: boolean;
}

// ============================================
// COMPOSANT
// ============================================

export function Summary({
  formData,
  creditsBalance,
  generationCost,
  onGenerate,
  isGenerating,
}: SummaryProps) {
  const remainingCredits = Math.max(0, creditsBalance - generationCost);
  const canAfford = creditsBalance >= generationCost;
  const isLowBalance = remainingCredits > 0 && remainingCredits < 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* ═══════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════ */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#6366F1]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6366F1]">
            Vérification finale
          </span>
        </div>
        <h2 className="text-base font-semibold text-[#18181B]">
          Vérifiez les informations avant la génération
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Ces informations servent à construire une stratégie adaptée à votre
          business. Vous pourrez générer une nouvelle stratégie à tout moment.
        </p>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* RÉCAPITULATIF */}
      {/* ═══════════════════════════════════════ */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-[#18181B]">
            Récapitulatif du brief
          </h3>
        </div>

        <div className="space-y-3">
          <SummaryRow
            icon={<Building2 className="h-3.5 w-3.5" />}
            label="Entreprise"
            value={formData.companyName || 'Non renseigné'}
          />
          <SummaryRow
            icon={<Layers className="h-3.5 w-3.5" />}
            label="Secteur"
            value={formData.sector || 'Non renseigné'}
          />
          <SummaryRow
            icon={<Target className="h-3.5 w-3.5" />}
            label="Produit principal"
            value={formData.mainProduct || 'Non renseigné'}
          />
          <SummaryRow
            icon={<Crosshair className="h-3.5 w-3.5" />}
            label="Client idéal"
            value={formData.idealClient || 'Non renseigné'}
          />
          <SummaryRow
            icon={<Globe2 className="h-3.5 w-3.5" />}
            label="Marché ciblé"
            value={
              [formData.mainCountry, formData.geographicZone]
                .filter(Boolean)
                .join(' · ') || 'Non renseigné'
            }
          />
          <SummaryRow
            icon={<Target className="h-3.5 w-3.5" />}
            label="Objectif principal"
            value={formData.mainObjective || 'Non renseigné'}
          />
          {formData.platform && (
            <SummaryRow
              icon={<Layers className="h-3.5 w-3.5" />}
              label="Plateforme"
              value={formData.platform}
            />
          )}
          {(formData.dailyBudget || formData.totalBudget) && (
            <SummaryRow
              icon={<Wallet className="h-3.5 w-3.5" />}
              label="Budget"
              value={
                formData.totalBudget
                  ? `${formData.totalBudget} FCFA${
                      formData.duration ? ` sur ${formData.duration}` : ''
                    }`
                  : `${formData.dailyBudget} FCFA/jour`
              }
            />
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* COÛT EN CRÉDITS */}
      {/* ═══════════════════════════════════════ */}
      <div
        className={`rounded-xl border p-5 ${
          !canAfford
            ? 'border-red-200 bg-red-50/50'
            : isLowBalance
              ? 'border-amber-200 bg-amber-50/50'
              : 'border-slate-200 bg-white'
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-[#18181B]">
              Coût de la génération
            </h3>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Crédits
          </span>
        </div>

        <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
          <span className="text-xs text-slate-600">
            Coût de cette stratégie
          </span>
          <span className="text-lg font-bold text-[#18181B]">
            {generationCost}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-3">
          <span className="text-xs text-slate-600">
            Solde après génération
          </span>
          <span
            className={`text-lg font-bold ${
              !canAfford
                ? 'text-red-600'
                : isLowBalance
                  ? 'text-amber-600'
                  : 'text-emerald-600'
            }`}
          >
            {remainingCredits}
          </span>
        </div>

        {/* Messages contextuels */}
        {!canAfford && (
          <div className="mt-3 rounded-lg border border-red-200 bg-white p-3">
            <p className="text-[11px] leading-relaxed text-red-700">
              Vous n&apos;avez pas assez de crédits pour cette génération.
              Passez à un plan supérieur pour continuer.
            </p>
          </div>
        )}

        {canAfford && isLowBalance && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-white p-3">
            <p className="text-[11px] leading-relaxed text-amber-800">
              Votre solde sera faible après cette génération. Pensez à recharger
              ou à passer au plan supérieur pour ne pas être bloqué.
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* ACTIONS */}
      {/* ═══════════════════════════════════════ */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            // Retour géré par le parent via le bouton existant
            const event = new CustomEvent('summary-back');
            window.dispatchEvent(event);
          }}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#18181B] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour
        </button>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!canAfford || isGenerating}
          className="inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#6366F1]/20 transition-colors hover:bg-[#5558e6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!canAfford ? (
            <>
              <Lock className="h-3.5 w-3.5" />
              Crédits insuffisants
            </>
          ) : isGenerating ? (
            <>
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Génération en cours
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Générer ma stratégie
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ============================================
// SOUS-COMPOSANT
// ============================================

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 break-words text-xs leading-relaxed text-[#18181B]">
          {value}
        </p>
      </div>
    </div>
  );
}