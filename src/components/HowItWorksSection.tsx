"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";
import { getCTAText, getCTAHref } from "@/config/cta.config";

export default function HeroSection() {
  const { user } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleHeroCta = () => {
    window.location.href = getCTAHref("hero", !!user);
  };

  if (!mounted) return null;

  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="hidden md:block absolute inset-0">
          <Image
            src="/images/hero-realistic-v2.webp"
            alt="MakeItAds - AI Marketing Intelligence"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={90}
          />
        </div>

        <div className="md:hidden absolute inset-0">
          <Image
            src="/images/hero-realistic-v2.webp"
            alt="MakeItAds - AI Marketing Intelligence"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={85}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#080810]/80 via-[#080810]/50 to-[#080810]/90" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1] text-white"
          >
            Still guessing which ads will actually{" "}
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent inline-block"
            >
              convert?
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto px-2"
          >
            MakeItAds analyzes your market, benchmarks your competitors, and
            builds data-backed strategies so every dollar you spend has a clear
            reason behind it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto sm:max-w-none"
          >
            <button
              onClick={handleHeroCta}
              className="group flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105 w-full sm:w-auto"
            >
              {getCTAText("hero", !!user)}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* MODIFICATION ICI : Le lien pointe maintenant vers #how-it-works */}
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all w-full sm:w-auto"
            >
              See How It Works
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}