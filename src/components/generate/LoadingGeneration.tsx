'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoadingGenerationProps {
  strategyType: 'flash' | 'complete';
}

// ============================================
// MESSAGES QUI DÉFILENT (éducatifs, sans mentir)
// ============================================

const FLASH_MESSAGES = [
  'Analyse de votre brief en cours',
  'Identification du diagnostic principal',
  'Construction de l\'avatar client',
  'Élaboration de l\'angle publicitaire',
  'Finalisation de votre diagnostic',
];

const COMPLETE_MESSAGES = [
  'Analyse de votre brief en cours',
  'Étude de votre marché et de vos concurrents',
  'Construction du ciblage précis',
  'Élaboration des angles marketing',
  'Rédaction des scripts WhatsApp',
  'Structuration budgétaire sur 7 jours',
  'Définition des KPIs à suivre',
  'Finalisation de votre stratégie',
];

// ============================================
// COMPOSANT
// ============================================

export function LoadingGeneration({ strategyType }: LoadingGenerationProps) {
  const messages =
    strategyType === 'flash' ? FLASH_MESSAGES : COMPLETE_MESSAGES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Rotation des messages toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, messages.length - 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  // Compteur de temps écoulé
  useEffect(() => {
    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Estimation : Flash ~20s, Complete ~40s
  const estimatedTime = strategyType === 'flash' ? 20 : 40;
  const progress = Math.min((elapsed / estimatedTime) * 100, 95);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-12">
      {/* Icône animée */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mb-8"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366F1]/10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="h-7 w-7 text-[#6366F1]" />
          </motion.div>
        </div>
        {/* Halo subtil */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inset-0 rounded-2xl bg-[#6366F1]/20"
        />
      </motion.div>

      {/* Titre */}
      <h2 className="mb-2 text-center text-lg font-semibold text-[#18181B]">
        {strategyType === 'flash'
          ? 'Génération de votre diagnostic'
          : 'Génération de votre stratégie'}
      </h2>

      {/* Message rotatif */}
      <div className="mb-8 flex h-6 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-slate-600"
          >
            {messages[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Barre de progression */}
      <div className="mb-3 w-full max-w-sm">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-[#6366F1]"
          />
        </div>
      </div>

      {/* Indicateurs */}
      <div className="flex items-center gap-3 text-[11px] text-slate-500">
        <span>
          {currentIndex + 1} / {messages.length}
        </span>
        <span className="text-slate-300">·</span>
        <span>{formatTime(elapsed)}</span>
      </div>

      {/* Note rassurante */}
      <p className="mt-6 max-w-xs text-center text-[11px] leading-relaxed text-slate-400">
        La génération prend généralement 20 à 45 secondes. Ne fermez pas cette page.
      </p>
    </div>
  );
}