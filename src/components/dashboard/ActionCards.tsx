'use client';

import Link from 'next/link';

interface ActionCardsProps {
  creditsBalance: number;
  plan: string; // 'free' | 'pro' | 'premium' | 'enterprise'
}

export function ActionCards({ creditsBalance, plan }: ActionCardsProps) {
  const isFree = plan === 'free';

  // ─── PLAN PAYANT : uniquement la carte Complète ───
  if (!isFree) {
    return (
      <div>
        <h2 className="text-base font-semibold text-[#111827] mb-3">
          Que voulez-vous faire ?
        </h2>

        <Link
          href="/dashboard/generate?type=complete"
          className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-[#6366F1]"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#111827]">
              Nouvelle stratégie
            </h3>
            <span className="text-xs font-medium text-[#6366F1]">5 crédits</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Construisez une stratégie publicitaire complète adaptée à votre entreprise.
          </p>
          <span className="text-xs font-medium text-[#6366F1]">
            Créer une stratégie →
          </span>
        </Link>

        <p className="mt-3 text-[11px] italic leading-relaxed text-slate-500">
          Votre plan {plan} donne accès uniquement aux stratégies complètes.
        </p>
      </div>
    );
  }

  // ─── PLAN FREE : les 2 cartes (Flash + Complète) ───
  return (
    <div>
      <h2 className="text-base font-semibold text-[#111827] mb-3">
        Que voulez-vous faire ?
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        <Link
          href="/dashboard/generate?type=complete"
          className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-[#6366F1]"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#111827]">
              Nouvelle stratégie
            </h3>
            <span className="text-xs font-medium text-[#6366F1]">5 crédits</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Construisez une stratégie publicitaire complète adaptée à votre entreprise.
          </p>
          <span className="text-xs font-medium text-[#6366F1]">
            Créer une stratégie →
          </span>
        </Link>

        <Link
          href="/dashboard/generate?type=flash"
          className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-[#6366F1]"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#111827]">
              Diagnostic Flash
            </h3>
            <span className="text-xs font-medium text-[#6366F1]">1 crédit</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Identifiez rapidement les principaux problèmes de votre approche publicitaire.
          </p>
          <span className="text-xs font-medium text-[#6366F1]">
            Lancer le diagnostic →
          </span>
        </Link>
      </div>
    </div>
  );
}