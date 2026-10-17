'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoadingGenerationProps {
  strategyType?: 'flash' | 'complete'; // Gardé pour éviter les erreurs dans le parent, mais non utilisé
}

export function LoadingGeneration({ strategyType }: LoadingGenerationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulation fluide de la progression jusqu'à 95%
    // Les 5% restants seront comblés quand l'API répondra réellement
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        // Incrémentation plus rapide au début, puis ralentit
        const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.5;
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center px-4">
      {/* Étoile qui tourbillonne */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#6366F1]/10"
      >
        <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-[#6366F1]" />
      </motion.div>

      {/* Pourcentage uniquement, sans aucun message */}
      <p className="text-2xl sm:text-3xl font-bold text-[#18181B]">
        {Math.round(progress)}%
      </p>
    </div>
  );
}