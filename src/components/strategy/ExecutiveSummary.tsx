'use client';

import { Sparkles, Target, AlertTriangle, Crosshair } from 'lucide-react';

interface ExecutiveSummaryProps {
  summary: {
    synthese: string;
    preparation: number;
    opportunite: 'Faible' | 'Moyenne' | 'Élevée';
    risque_principal: string;
    priorite: string;
  };
}

export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  const { synthese, preparation, opportunite, risque_principal, priorite } = summary;

  const getPrepHue = () => {
    if (preparation >= 80) return { color: 'text-emerald-600', bg: 'bg-emerald-500' };
    if (preparation >= 60) return { color: 'text-amber-600', bg: 'bg-amber-500' };
    return { color: 'text-slate-600', bg: 'bg-slate-400' };
  };

  const prep = getPrepHue();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
      {/* En-tête */}
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#6366F1]" />
        <h2 className="text-sm font-semibold text-[#18181B]">
          Votre stratégie en un coup d&apos;œil
        </h2>
      </div>

      {/* Synthèse */}
      <p className="mb-5 text-sm leading-relaxed text-slate-700">
        {synthese}
      </p>

      {/* Indicateurs */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Préparation */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Préparation
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${prep.color}`}>
              {preparation}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ${prep.bg}`}
              style={{ width: `${preparation}%` }}
            />
          </div>
        </div>

        {/* Opportunité */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Crosshair className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Opportunité
            </span>
          </div>
          <span
            className={`text-lg font-semibold ${
              opportunite === 'Élevée'
                ? 'text-emerald-600'
                : opportunite === 'Moyenne'
                  ? 'text-amber-600'
                  : 'text-slate-600'
            }`}
          >
            {opportunite}
          </span>
        </div>

        {/* Risque principal */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Risque principal
            </span>
          </div>
          <p className="text-xs leading-snug text-slate-700">{risque_principal}</p>
        </div>
      </div>

      {/* Priorité absolue */}
      <div className="mt-3 rounded-lg border border-[#6366F1]/20 bg-[#6366F1]/5 p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6366F1]">
          Priorité immédiate
        </span>
        <p className="mt-1 text-xs leading-snug text-[#18181B]">{priorite}</p>
      </div>
    </section>
  );
}