"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";
import { getCTAText, getCTAHref } from "@/config/cta.config";

// Composant compteur animé
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{count}</span>;
}

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
      
      {/* ✅ Image en fond PLEIN ÉCRAN */}
      <div className="absolute inset-0 z-0">
        {/* Desktop */}
        <div className="hidden lg:block absolute inset-0">
          <Image
            src="/images/hero-editorial-desktop.webp"
            alt="Strategy War Room"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        
        {/* Mobile */}
        <div className="lg:hidden absolute inset-0">
          <Image
            src="/images/hero-editorial-mobile.webp"
            alt="Strategy War Room"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        
        {/* Overlay léger pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-slate-100" />
      </div>

      {/* ✅ Contenu centré par-dessus */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-700 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Trusted by 12,400+ brands generating $50M+ in ad revenue
        </motion.div>

        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-slate-950"
        >
          Still guessing which ads will actually{" "}
          <motion.span
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent inline-block"
          >
            convert?
          </motion.span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-700 mb-10 leading-relaxed max-w-3xl mx-auto"
        >
          MakeItAds analyzes your market, benchmarks your competitors, and builds data-backed strategies so every dollar you spend has a clear reason behind it.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={handleHeroCta}
            className="group flex items-center gap-2 rounded-full bg-[#6366f1] px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105"
          >
            {getCTAText("hero", !!user)}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#walkthrough"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-all"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Compteur */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md px-3 py-1 text-emerald-300 border border-emerald-500/30">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-mono font-semibold">
              <AnimatedCounter target={2847} />
            </span>
            <span className="text-slate-300">campaigns generated this week</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}