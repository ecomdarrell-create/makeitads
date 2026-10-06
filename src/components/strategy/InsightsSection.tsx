'use client';

import { Lightbulb } from 'lucide-react';

interface Insight {
  titre: string;
  explication: string;
  impact: string;
}

interface InsightsSectionProps {
  insights: Insight[];
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-[#6366F1]" />
        <h2 className="text-sm font-semibold text-[#18181B]">
          Ce que nous avons identifié
        </h2>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-100 bg-slate-50/40 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#6366F1]/10 text-[10px] font-bold text-[#6366F1]">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-[#18181B]">
                  {insight.titre}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {insight.explication}
                </p>
                <div className="mt-2 border-t border-slate-100 pt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Impact
                  </span>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-700">
                    {insight.impact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}