'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════ */
/* TYPEWRITER — effet d'écriture en boucle     */
/* ═══════════════════════════════════════════ */
function TypewriterWord({ text = 'stratégie.' }: { text?: string }) {
  const [display, setDisplay] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = 110;
    const deletingSpeed = 60;
    const pauseBeforeDelete = 2200;
    const pauseBeforeTyping = 400;

    if (!isDeleting && display === text) {
      const t = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      return () => clearTimeout(t);
    }

    if (isDeleting && display === '') {
      const t = setTimeout(() => setIsDeleting(false), pauseBeforeTyping);
      return () => clearTimeout(t);
    }

    const t = setTimeout(
      () => {
        setDisplay((prev) =>
          isDeleting ? text.substring(0, prev.length - 1) : text.substring(0, prev.length + 1)
        );
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(t);
  }, [display, isDeleting, text]);

  return (
    <span className="inline-flex items-baseline">
      <span className="bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] bg-clip-text text-transparent">
        {display}
      </span>
      <span
        aria-hidden="true"
        className="blink-cursor ml-0.5 inline-block w-[2px] self-stretch bg-[#6366F1] align-middle"
      />
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .blink-cursor {
          animation: blink 1s steps(1) infinite;
        }
      `}</style>
    </span>
  );
}

/* ═══════════════════════════════════════════ */
/* HERO SECTION                                 */
/* ═══════════════════════════════════════════ */
export default function HeroSection() {
  return (
    <section className="relative w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-x-14 lg:gap-y-0 xl:gap-x-20">

          {/* ═══ TITRE + SOUS-TITRE ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center lg:col-start-1 lg:row-start-1 lg:text-left"
          >
            {/* ✅ Titre — leading généreux + padding bas pour libérer la queue du "g" */}
            <h1 className="mb-6 text-[1.75rem] font-bold leading-[1.25] tracking-[-0.03em] text-[#0A0A0F] sm:mb-7 sm:text-[2.5rem] sm:leading-[1.2] md:text-5xl lg:mb-4 lg:pb-4 lg:text-[3rem] lg:leading-[1.25] xl:text-[3.5rem]">
              <span className="block lg:inline">
                Arrêtez de{' '}
                <span className="bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] bg-clip-text text-transparent">
                  deviner.
                </span>
              </span>{' '}
              <span className="block lg:inline">
                Passez à la <TypewriterWord text="stratégie." />
              </span>
            </h1>

            {/* ✅ Sous-titre poussé plus bas sur desktop (mt-4 lg) */}
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base lg:mx-0 lg:mt-4 lg:max-w-lg lg:text-[1.0625rem]">
              MakeItAds analyse votre activité, votre audience et votre marché pour construire la stratégie publicitaire complète derrière votre prochaine campagne. Prête à copier-coller, calibrée pour l&apos;Afrique.
            </p>
          </motion.div>

          {/* ═══ IMAGE ═══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-md lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:max-w-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-main.png"
              alt="MakeItAds sur iPhone — Dashboard stratégie et Analytics"
              className="block h-auto w-full select-none"
              draggable={false}
            />
          </motion.div>

          {/* ═══ CTA ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            className="lg:col-start-1 lg:row-start-2 lg:self-start"
          >
            <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-center lg:justify-start lg:gap-3">
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#6366F1]/25 transition-all hover:bg-[#5558e6] hover:scale-[1.02] sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Obtenir une démo
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-[#0A0A0F] transition-all hover:border-slate-300 hover:bg-slate-50 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Voir comment ça marche
              </a>
            </div>
          </motion.div>
        </div>

        <div className="h-14 sm:h-20 lg:h-24" />
      </div>
    </section>
  );
}