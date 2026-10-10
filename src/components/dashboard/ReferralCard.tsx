'use client';

import { useState } from 'react';
import { Copy, Check, Users } from 'lucide-react';

interface ReferralCardProps {
  code: string | null;
  count: number;
}

export function ReferralCard({ code, count }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      const url = `${window.location.origin}/signup?ref=${code}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencieux
    }
  };

  return (
    <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 sm:h-10 sm:w-10">
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[13px] font-semibold text-slate-900 sm:text-sm">
            Programme de parrainage
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
            Invitez vos amis et gagnez des crédits bonus.
          </p>

          {code ? (
            <>
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 sm:mt-4 sm:px-3">
                <span className="flex-1 truncate font-mono text-[12px] font-semibold tracking-wider text-slate-900 sm:text-sm">
                  {code}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copier le lien de parrainage"
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200 sm:px-3 sm:text-[11px]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" /> Copié
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copier
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-[10px] text-slate-500 sm:text-[11px]">
                <span className="font-semibold text-slate-700">{count}</span>{' '}
                {count === 1 ? 'filleul inscrit' : 'filleuls inscrits'}
              </p>
            </>
          ) : (
            <p className="mt-3 text-[10px] italic text-slate-400 sm:text-[11px]">
              Votre code de parrainage apparaîtra ici après votre première activité.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}