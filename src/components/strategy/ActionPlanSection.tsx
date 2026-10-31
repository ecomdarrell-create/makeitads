'use client';

import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

function cleanMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
    .replace(/(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)/g, '$1')
    .replace(/(?<!\w)_([^_\n]+?)_(?!\w)/g, '$1')
    .replace(/\*/g, '')
    .replace(/(?<!\w)_(?!\w)/g, '')
    .replace(/`/g, '')
    .replace(/^#{1,6}\s+/gm, '');
}

function renderRichText(text: string): React.ReactNode {
  if (!text) return null;
  const normalized = text.replace(/\*\*\*([^*]+)\*\*\*/g, '**$1**');
  const lines = normalized.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={lineIdx}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            const innerText = cleanMarkdown(part.slice(2, -2));
            if (!innerText) return null;
            return (
              <strong key={i} className="font-bold text-[#8B5CF6]">
                {innerText}
              </strong>
            );
          }
          const cleaned = cleanMarkdown(part);
          if (!cleaned) return null;
          return <span key={i}>{cleaned}</span>;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

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
                  {renderRichText(phase.titre)}
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
                  <span>{renderRichText(action)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}