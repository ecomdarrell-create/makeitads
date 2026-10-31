'use client';

import React from 'react';
import { ListChecks } from 'lucide-react';

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

interface Priority {
  niveau: 'Priorité immédiate' | 'À tester' | 'À optimiser' | 'À surveiller';
  titre: string;
  pourquoi: string;
  action: string;
  impact_attendu: string;
}

interface PrioritiesSectionProps {
  priorities: Priority[];
}

const NIVEAU_STYLES: Record<
  Priority['niveau'],
  { badge: string; dot: string }
> = {
  'Priorité immédiate': {
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
  'À tester': {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  'À optimiser': {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  'À surveiller': {
    badge: 'bg-slate-50 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export function PrioritiesSection({ priorities }: PrioritiesSectionProps) {
  if (!priorities || priorities.length === 0) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-[#6366F1]" />
        <h2 className="text-sm font-semibold text-[#18181B]">
          Ce que vous devriez faire maintenant
        </h2>
      </div>

      <div className="space-y-3">
        {priorities.map((priority, index) => {
          const style = NIVEAU_STYLES[priority.niveau];
          return (
            <div
              key={index}
              className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  <span className="text-xs font-semibold text-[#18181B]">
                    {String(index + 1).padStart(2, '0')} — {renderRichText(priority.titre)}
                  </span>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${style.badge}`}
                >
                  {priority.niveau}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Pourquoi
                  </span>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                    {renderRichText(priority.pourquoi)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </span>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-[#18181B]">
                    {renderRichText(priority.action)}
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Impact attendu
                  </span>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-700">
                    {renderRichText(priority.impact_attendu)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}