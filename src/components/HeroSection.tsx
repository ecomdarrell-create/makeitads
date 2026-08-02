"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";
import { getCTAHref } from "@/config/cta.config";

export default function HeroSection() {
  const { user } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleHeroCta = () => {
    window.location.href = getCTAHref("hero", !!user);
  };

  if (!mounted) return null;

  return (
    <section className="relative z-10 min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16">
      {/* Fond premium avec halos */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_40%),linear-gradient(180deg,#080810_0%,#0a0a14_100%)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-left">
          
          {/* TITRE */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.1] text-white mb-6"
          >
            <span className="block">Know your <span className="text-[#8b5cf6]">market</span>.</span>
            <span className="block">Outsmart <span className="text-[#8b5cf6]">competitors</span>.</span>
            <span className="block">Scale with <span className="text-[#8b5cf6]">confidence</span>.</span>
          </motion.h1>

          {/* SOUS-TITRE */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 leading-relaxed mb-8"
          >
            MakeItAds turns competitor tracking, market analysis and positioning into one complete growth strategy your team can act on.
          </motion.p>

          {/* IMAGE HERO - Mockup multi-devices avec fond transparent */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.16, ease: "easeOut" }}
            className="relative w-full mb-10"
          >
            {/* Halo lumineux derrière */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] bg-[#6366f1]/15 blur-[120px] rounded-full -z-10" />
            
            {/* Container avec fond sombre pour absorber le blanc de l'image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0a0a14]">
              <Image
                src="/images/couv-X.png"
                alt="MakeItAds Dashboard - Multi-device preview"
                width={1400}
                height={900}
                priority
                className="w-full h-auto object-contain"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'drop-shadow(0 20px 60px rgba(99, 102, 241, 0.3))'
                }}
              />
            </div>
          </motion.div>

          {/* BOUTONS D'ACTION */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-xl mx-auto sm:mx-0"
          >
            <button
              onClick={handleHeroCta}
              className="group flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-[1.02] w-full sm:w-auto"
            >
              Open Your Workspace
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-bold text-white hover:bg-white/[0.06] transition-all w-full sm:w-auto"
            >
              See How It Works
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}