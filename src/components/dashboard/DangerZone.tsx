'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const REASONS = [
  { id: 'too_expensive', label: 'Le service est trop cher' },
  { id: 'not_using', label: 'Je ne l\'utilise pas assez' },
  { id: 'missing_features', label: 'Il manque des fonctionnalités dont j\'ai besoin' },
  { id: 'switching', label: 'Je passe à un concurrent' },
  { id: 'technical', label: 'Problèmes techniques récurrents' },
  { id: 'other', label: 'Autre raison' },
];

export function DangerZone() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const toggleReason = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async () => {
    if (selected.size === 0) {
      setError('Merci de cocher au moins une raison.');
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reasons: Array.from(selected),
          comment: comment.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Erreur lors de la suppression');
        setDeleting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 3500);
    } catch {
      setError('Impossible de supprimer le compte. Réessayez.');
      setDeleting(false);
    }
  };

  if (success) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:rounded-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <Check className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="mb-2 text-base font-semibold text-slate-900 sm:text-lg">
          Compte supprimé
        </h3>
        <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
          Votre compte et toutes vos données ont été supprimés de nos serveurs.
          <br /><br />
          <strong>Vous changez d&apos;avis ?</strong> Si vous revenez dans les <strong>30 prochains jours</strong> avec le même email, nous restaurerons automatiquement votre historique, vos stratégies et vos crédits.
        </p>
        <p className="mt-4 text-[10px] text-slate-400">Redirection en cours…</p>
      </section>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white shadow-sm sm:rounded-2xl">
        <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[13px] font-semibold text-red-900 sm:text-sm">
              Zone de danger
            </h2>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800/80 sm:text-xs">
              La suppression de votre compte est <strong>définitive et irréversible</strong>. Toutes vos stratégies,
              crédits, données de profil et l&apos;historique complet seront effacés de nos serveurs.
            </p>
            <p className="mt-1.5 text-[10px] leading-relaxed text-red-700/70 sm:text-[11px]">
              💡 <strong>Bon à savoir :</strong> si vous revenez dans les 30 jours avec le même email, nous
              restaurons automatiquement votre historique.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-300 bg-white px-4 py-2 text-[11px] font-semibold text-red-700 transition-colors hover:bg-red-50 sm:text-xs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer mon compte
            </button>
          </div>
        </div>
      </section>

      {/* Modal confirmation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
            onClick={() => !deleting && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Confirmer la suppression
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Cette action est définitive.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !deleting && setOpen(false)}
                  className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
                <p className="mb-3 text-xs font-medium text-slate-700">
                  Pourquoi quittez-vous MakeItAds ? <span className="text-red-600">*</span>
                </p>

                <div className="space-y-2">
                  {REASONS.map((r) => (
                    <label
                      key={r.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                        selected.has(r.id)
                          ? 'border-[#6366F1] bg-indigo-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={() => toggleReason(r.id)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]"
                      />
                      <span className="text-xs text-slate-700">{r.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
                    Un commentaire ? (optionnel)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Dites-nous en plus…"
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition-colors focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {error && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-700">
                    {error}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setOpen(false)}
                  disabled={deleting}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Suppression…
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Supprimer définitivement
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}