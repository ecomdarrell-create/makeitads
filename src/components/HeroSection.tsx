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
    <section className="relative z-10 min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16 bg-[#FFFFFF]">
      {/* Fond premium avec halos adaptés au white theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#6366f1]/8 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 right-0 w-[800px] h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]" style={{ maskImage: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,0,0,0.08) 0%, transparent 100%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-left">
          
          {/* TITRE - Texte premium noir */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.1] text-[#0F172A] mb-6"
          >
            <span className="block">Know your <span className="text-[#8b5cf6]">market</span>.</span>
            <span className="block">Outsmart <span className="text-[#8b5cf6]">competitors</span>.</span>
            <span className="block">Scale with <span className="text-[#8b5cf6]">confidence</span>.</span>
          </motion.h1>

          {/* SOUS-TITRE - Gris premium */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl text-[#475569] leading-relaxed mb-8"
          >
            MakeItAds turns competitor tracking, market analysis and positioning into one complete growth strategy your team can act on.
          </motion.p>

          {/* IMAGE HERO - Effet Apple/Stripe premium sur fond blanc */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.16, ease: "easeOut" }}
            className="relative w-full mb-10"
          >
            {/* Halo lumineux violet subtil derrière */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[70%] bg-gradient-to-br from-[#6366f1]/10 via-[#8b5cf6]/5 to-transparent blur-[100px] rounded-full -z-10" />
            
            {/* Container premium avec ombre studio */}
            <div className="relative">
              {/* Ombre portée réaliste sous l'image (effet flottant) */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-[#0F172A]/10 blur-[40px] rounded-full" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-[#6366f1]/10 blur-[30px] rounded-full" />
              
              <Image
                src="/images/couv-X.png"
                alt="MakeItAds Dashboard - Multi-device preview"
                width={1400}
                height={900}
                priority
                className="w-full h-auto object-contain relative z-10"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(15, 23, 42, 0.15)) drop-shadow(0 10px 20px rgba(99, 102, 241, 0.1))'
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
            {/* Bouton principal violet - texte blanc conservé */}
            <button
              onClick={handleHeroCta}
              className="group flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-[1.02] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.7)] w-full sm:w-auto"
            >
              Open Your Workspace
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Bouton secondaire - adapté au white theme */}
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-[0_2px_10px_rgba(15,23,42,0.04)] w-full sm:w-auto"
            >
              See How It Works
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}