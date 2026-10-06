'use client';

import { Calendar, ArrowRight } from 'lucide-react';

interface Phase {
  titre: string;
  duree: string;
  actions: string[];
}

interface ActionPlanSectionProps {
  plan: {
    phase_1: Phase;
    phase_2: Phase;
    phase_3: Phase;
  };
}

export function ActionPlanSection({ plan }: ActionPlanSectionProps) {
  const phases: Phase[] = [plan.phase_1, plan.phase_2, plan.phase_3];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-[#6366F1]" />
        <h2 className="text-sm font-semibold text-[#18181B]">
          Plan d&apos;exécution recommandé
        </h2>
      </div>

      <div className="space-y-3">
        {phases.map((phase, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-100 bg-slate-50/40 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#6366F1] text-[10px] font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-xs font-semibold text-[#18181B]">
                  {phase.titre}
                </h3>
              </div>
              <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                {phase.duree}
              </span>
            </div>

            <ul className="space-y-1.5">
              {phase.actions.map((action, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-700"
                >
                  <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#6366F1]" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}