'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ScanFace, KeyRound, Loader2, X } from 'lucide-react';
import type { PasskeyLabel } from '@/lib/passkey/detect';

type Props = {
  open: boolean;
  label: PasskeyLabel;
  loading: boolean;
  error: string;
  onAccept: () => void;
  onDismiss: () => void;
};

export function PasskeySetupPrompt({ open, label, loading, error, onAccept, onDismiss }: Props) {
  const Icon = label.icon === 'face' ? ScanFace : label.icon === 'key' ? KeyRound : Fingerprint;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="passkey-setup-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-[380px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <button
              type="button"
              onClick={onDismiss}
              disabled={loading}
              aria-label="Fermer"
              className="absolute right-3 top-3 text-slate-400 transition-colors hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-[#6366F1]">
              <Icon className="h-5 w-5" />
            </div>

            <h2 id="passkey-setup-title" className="mb-1 text-sm font-semibold text-slate-900">
              Accélérez vos prochaines connexions avec {label.label}.
            </h2>
            <p className="mb-4 text-[12px] leading-relaxed text-slate-500">
              Connectez-vous plus rapidement et en toute sécurité grâce à la biométrie
              de votre appareil. Votre empreinte ou votre visage ne quittent jamais
              votre téléphone.
            </p>

            {error && (
              <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-[11px] text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onAccept}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6366F1] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#5558e6] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
                {loading ? 'Activation…' : 'Activer la connexion rapide'}
              </button>
              <button
                type="button"
                onClick={onDismiss}
                disabled={loading}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-60"
              >
                Plus tard
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}