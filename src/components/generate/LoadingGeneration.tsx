'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoadingGenerationProps {
  strategyType?: 'flash' | 'complete';
}

// AJOUT : messages dynamiques affichés selon l'avancement
const LOADING_MESSAGES = [
  { threshold: 0, text: 'Analyse de votre marché...' },
  { threshold: 20, text: 'Recherche des concurrents...' },
  { threshold: 40, text: 'Identification de votre audience cible...' },
  { threshold: 60, text: 'Calibration du budget publicitaire...' },
  { threshold: 80, text: 'Structuration de votre plan d\'action...' },
  { threshold: 95, text: 'Finalisation de votre stratégie...' },
];

export function LoadingGeneration({ strategyType }: LoadingGenerationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulation fluide de la progression jusqu'à 95%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.5;
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // AJOUT : calcul du message correspondant au progress actuel
  const currentMessage = LOADING_MESSAGES.reduce(
    (acc, msg) => (progress >= msg.threshold ? msg.text : acc),
    LOADING_MESSAGES[0].text
  );

  return (
    <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center px-4">
      {/* AJOUT : titre en haut de l'étoile */}
      <p className="mb-6 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:mb-8 sm:text-xs">
        Génération de votre stratégie
      </p>

      {/* Étoile qui tourbillonne — INCHANGÉE */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#6366F1]/10"
      >
        <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-[#6366F1]" />
      </motion.div>

      {/* Pourcentage — INCHANGÉ */}
      <p className="text-2xl sm:text-3xl font-bold text-[#18181B]">
        {Math.round(progress)}%
      </p>

      {/* AJOUT : message dynamique en bas du pourcentage (avec fade) */}
      <div className="mt-4 flex h-5 items-center justify-center sm:mt-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="text-center text-xs font-medium text-slate-500 sm:text-sm"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* AJOUT : message de réassurance */}
      <p className="mt-6 max-w-[260px] text-center text-[10px] leading-relaxed text-slate-400 sm:mt-8 sm:text-xs">
        Ne fermez pas cette page. La génération peut prendre quelques instants.
      </p>
    </div>
  );
}