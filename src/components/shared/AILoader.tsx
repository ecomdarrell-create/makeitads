'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AILoader() {
  const pathname = usePathname();

  // ✅ CORRECTION : Ignorer les routes du dashboard qui ont déjà leur propre loading.tsx
  // Cela empêche le double affichage du loader dans l'application.
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);

    // Progression fluide
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 3));
    }, 50);

    // Délai de sécurité pour assurer une transition douce
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 200);
      clearInterval(interval);
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-300">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="mb-3 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#6366F1]/10"
      >
        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#6366F1]" />
      </motion.div>
      
      {/* Pourcentage uniquement */}
      <p className="text-2xl font-bold text-[#18181B]">
        {Math.round(progress)}%
      </p>
    </div>
  );
}