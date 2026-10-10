'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function ComingSoonModal({
  isOpen,
  onClose,
  provider = 'Apple',
  ctaHref = '/signup',
  ctaLabel = 'Créer un compte avec email',
}: ComingSoonModalProps) {
  // Fermer avec Échap
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Bloquer le scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Halo décoratif */}
            <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#6366F1]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 right-0 h-32 w-32 rounded-full bg-[#8B5CF6]/10 blur-3xl" />

            {/* Bouton fermer */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative px-6 pt-8 pb-6 text-center">
              {/* Icône */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-6 w-6 text-white" strokeWidth={2.2} />
              </div>

              {/* Titre */}
              <h2 className="text-lg font-bold text-slate-900">
                Bientôt disponible
              </h2>

              {/* Sous-titre */}
              <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                La connexion avec <span className="font-semibold text-slate-700">{provider}</span> arrive très bientôt sur MakeItAds.
                <br />
                En attendant, créez votre compte avec votre email.
              </p>

              {/* CTA */}
              <Link
                href={ctaHref}
                onClick={onClose}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6366F1] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-[#5558e6] hover:scale-[1.02]"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Note */}
              <p className="mt-3 text-[10px] text-slate-400">
                Vous serez notifié dès que la fonctionnalité sera disponible.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}