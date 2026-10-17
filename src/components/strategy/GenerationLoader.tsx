'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface GenerationLoaderProps {
  error?: string | null; // Conservé pour éviter les erreurs TypeScript avec les composants parents
}

export default function GenerationLoader({ error }: GenerationLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulation fluide de la progression jusqu'à 95%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        const increment = prev < 50 ? 3 : prev < 80 ? 1.5 : 0.5;
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      {/* Étoile qui tourbillonne (taille compacte et adaptée mobile/PC) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#6366F1]/10"
      >
        <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-[#6366F1]" />
      </motion.div>

      {/* Pourcentage uniquement. AUCUN message, AUCUNE particule, AUCUN "M" */}
      <p className="text-2xl sm:text-3xl font-bold text-[#18181B] tabular-nums">
        {Math.round(progress)}%
      </p>

      {/* Fallback discret si une erreur critique est passée, sinon invisible */}
      {error && (
        <p className="mt-4 text-xs text-red-500 text-center">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}
    </div>
  );
}