"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";
import { getCTAText, getCTAHref } from "@/config/cta.config";

const marketSlides = [
  {
    id: 1,
    title: "Emerging Trends",
    subtitle: "Spot viral products before they peak.",
    image: "/images/market-intel-1.png",
  },
  {
    id: 2,
    title: "Opportunity Detection",
    subtitle: "Find gaps in saturated markets.",
    image: "/images/market-intel-2.png",
  },
  {
    id: 3,
    title: "Industry Benchmarks",
    subtitle: "Know exactly where you stand.",
    image: "/images/market-intel-3.png",
  },
  {
    id: 4,
    title: "Competitor Watchlist",
    subtitle: "Track moves in real-time.",
    image: "/images/market-intel-4.png",
  },
];

export default function MarketIntelligenceSection() {
  const { user } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % marketSlides.length);
  };

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [mounted]);

  const handleMarketCta = () => {
    window.location.href = getCTAHref("marketIntelligence", !!user);
  };

  if (!mounted) return null;

  const current = marketSlides[currentIndex];

  return (
    <section className="relative w-full py-16 md:py-24 px-6 overflow-hidden bg-[#080810] text-white">
      
      {/* Background subtil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#8b5cf6]/10 rounded-full blur-[120px]" />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
            <BarChart3 className="h-3.5 w-3.5 text-[#6366f1]" />
            <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">Market Intelligence</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Data-driven insights for{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
              smarter decisions
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            Real-time market intelligence that keeps you ahead of the competition.
          </p>
        </motion.div>

        {/* Carousel d'images en format carré 1:1 */}
        <div className="relative max-w-2xl mx-auto mb-10 md:mb-12">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-[#0f0f1a] shadow-2xl shadow-[#6366f1]/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                  priority={currentIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Texte animé sous l'image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto mb-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {current.title}
            </h3>
            <p className="text-base md:text-lg text-slate-400">
              {current.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots de navigation (sans flèches) */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {marketSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-[#6366f1] w-8" : "bg-white/20 w-2 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <button
            onClick={handleMarketCta}
            className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105"
          >
            {getCTAText("marketIntelligence", !!user)}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}