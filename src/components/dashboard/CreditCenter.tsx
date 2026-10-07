'use client';

import Link from 'next/link';
import { Wallet, Zap, ArrowRight, TrendingDown, Zap as Flash, FileText } from 'lucide-react';
import { CREDIT_COSTS } from '@/config/pricing.config';

interface CreditCenterProps {
  balance: number;
  used: number;
  flashCount: number;
  completeCount: number;
  currency?: string;
}

export function CreditCenter({
  balance,
  used,
  flashCount,
  completeCount,
  currency = 'XOF',
}: CreditCenterProps) {
  // Calculs
  const flashCredits = flashCount * CREDIT_COSTS.DIAGNOSTIC_FLASH;
  const completeCredits = completeCount * CREDIT_COSTS.STRATEGIE_COMPLETE;
  const totalSpent = flashCredits + completeCredits;
  const remainingGenerations = Math.floor(balance / CREDIT_COSTS.STRATEGIE_COMPLETE);

  const isLow = balance < CREDIT_COSTS.STRATEGIE_COMPLETE * 2;
  const isEmpty = balance === 0;

  return (
    <div
      data-tour="credit-center"
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${
              isEmpty
                ? 'bg-red-50 text-red-600'
                : isLow
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-[#6366F1]/10 text-[#6366F1]'
            }`}
          >
            <Wallet className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-xs font-semibold text-[#18181B]">Crédits</h3>
        </div>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">
          {currency}
        </span>
      </div>

      {/* Solde principal */}
      <div data-tour="credit-balance" className="mb-3">
        <div className="flex items-baseline gap-1">
          <span
            className={`text-2xl font-bold ${
              isEmpty ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-[#18181B]'
            }`}
          >
            {balance}
          </span>
          <span className="text-xs text-gray-500">crédits disponibles</span>
        </div>
        <p className="mt-1 text-[11px] text-gray-500">
          {remainingGenerations > 0 ? (
            <>
              Soit <strong className="text-[#18181B]">{remainingGenerations}</strong>{' '}
              stratégie{remainingGenerations > 1 ? 's' : ''} complète{remainingGenerations > 1 ? 's' : ''}
            </>
          ) : (
            'Aucune stratégie complète possible'
          )}
        </p>
      </div>

      {/* Détails */}
      <div className="mb-3 space-y-1.5 rounded-lg border border-gray-100 bg-gray-50/50 p-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-gray-600">
            <Flash className="h-3 w-3 text-emerald-500" />
            Diagnostics Flash
          </span>
          <span className="font-medium text-[#18181B]">
            {flashCount} × {CREDIT_COSTS.DIAGNOSTIC_FLASH}c = {flashCredits}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-gray-600">
            <FileText className="h-3 w-3 text-[#6366F1]" />
            Stratégies Complètes
          </span>
          <span className="font-medium text-[#18181B]">
            {completeCount} × {CREDIT_COSTS.STRATEGIE_COMPLETE}c = {completeCredits}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-1.5 text-[11px]">
          <span className="flex items-center gap-1.5 font-medium text-gray-700">
            <TrendingDown className="h-3 w-3" />
            Total consommé
          </span>
          <span className="font-bold text-[#18181B]">{totalSpent} crédits</span>
        </div>
      </div>

      {/* CTA Recharge */}
      {isLow && (
        <Link
          href="/dashboard/credits"
          data-tour="credit-recharge-cta"
          className={`flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-white transition-colors ${
            isEmpty
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-amber-500 hover:bg-amber-600'
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          {isEmpty ? 'Recharger maintenant' : 'Recharger des crédits'}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}

      {!isLow && (
        <Link
          href="/dashboard/credits"
          data-tour="credit-manage-cta"
          className="flex w-full items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Zap className="h-3.5 w-3.5" />
          Gérer mes crédits
        </Link>
      )}
    </div>
  );
}