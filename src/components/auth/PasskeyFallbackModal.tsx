'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, KeyRound, RotateCcw } from 'lucide-react';

type Props = {
  open: boolean;
  onRetry: () => void;
  onUsePassword: () => void;
};

export function PasskeyFallbackModal({ open, onRetry, onUsePassword }: Props) {
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
          aria-labelledby="passkey-fallback-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-[360px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2
              id="passkey-fallback-title"
              className="mb-1 text-sm font-semibold text-slate-900"
            >
              Authentification non aboutie
            </h2>
            <p className="mb-4 text-[12px] leading-relaxed text-slate-500">
              Nous n&apos;avons pas pu confirmer votre identité. Vous pouvez réessayer
              ou utiliser votre méthode de connexion habituelle.
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onRetry}
                autoFocus
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6366F1] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#5558e6]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Réessayer
              </button>
              <button
                type="button"
                onClick={onUsePassword}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Se connecter avec mon mot de passe
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}