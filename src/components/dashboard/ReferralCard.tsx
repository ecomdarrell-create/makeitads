'use client';

import { useState } from 'react';
import { Copy, Check, Users, Link2, KeyRound } from 'lucide-react';

interface ReferralCardProps {
  code: string | null;
  count: number;
}

export function ReferralCard({ code, count }: ReferralCardProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralUrl =
    typeof window !== 'undefined' && code
      ? `${window.location.origin}/signup?ref=${code}`
      : '';

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      /* silencieux */
    }
  };

  const handleCopyLink = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      /* silencieux */
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
            Invitez vos proches et gagnez des crédits bonus dès leur premier paiement.
          </p>

          {code ? (
            <>
              {/* ✅ OPTION 1 — CODE SEUL (plus « safe » pour les destinataires méfiants) */}
              <div className="mt-3 sm:mt-4">
                <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-[11px]">
                  <KeyRound className="h-3 w-3" />
                  Votre code
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 sm:px-3">
                  <span className="flex-1 truncate font-mono text-[13px] font-bold tracking-widest text-slate-900 sm:text-sm">
                    {code}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    aria-label="Copier le code de parrainage"
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200 sm:px-3 sm:text-[11px]"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-3 w-3" /> Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copier le code
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ✅ OPTION 2 — LIEN COMPLET */}
              <div className="mt-3">
                <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-[11px]">
                  <Link2 className="h-3 w-3" />
                  Votre lien d&apos;invitation
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 sm:px-3">
                  <span className="flex-1 truncate font-mono text-[10.5px] text-slate-600 sm:text-[11.5px]">
                    {referralUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Copier le lien d'invitation"
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200 sm:px-3 sm:text-[11px]"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3 w-3" /> Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copier le lien
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="mt-3 text-[10px] text-slate-500 sm:text-[11px]">
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