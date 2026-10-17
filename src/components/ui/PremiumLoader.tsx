'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface PremiumLoaderProps {
  fullScreen?: boolean;
  // Le prop 'message' est conservé pour éviter les erreurs TypeScript 
  // dans les fichiers qui l'utilisent déjà, mais il ne s'affichera plus.
  message?: string; 
}

export function PremiumLoader({ fullScreen = false }: PremiumLoaderProps) {
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

  const wrapperClass = fullScreen
    ? 'fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md'
    : 'flex flex-col items-center justify-center py-12 px-4';

  return (
    <div className={wrapperClass} role="status" aria-live="polite">
      {/* Étoile qui tourbillonne (taille compacte et adaptée mobile/PC) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#6366F1]/10"
      >
        <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-[#6366F1]" />
      </motion.div>

      {/* Pourcentage uniquement. AUCUN message, AUCUN "M" */}
      <p className="text-2xl sm:text-3xl font-bold text-[#18181B] tabular-nums">
        {Math.round(progress)}%
      </p>
    </div>
  );
}