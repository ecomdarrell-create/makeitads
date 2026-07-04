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
    <section className="relative w-full min-h-screen overflow-hidden bg-[#080810] text-white">
      
      {/* IMAGES PLEIN ÉCRAN EN CAROUSEL */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Overlay sombre 40% */}
        <div className="absolute inset-0 bg-[#080810]/40" />
        
        {/* Gradient radial pour focus central */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#080810]/60" />
      </div>

      {/* CONTENU CENTRÉ - Style Apple/Stripe */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 mb-6">
              <BarChart3 className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Market Intelligence</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
              {current.title}
            </h2>
            
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed mb-10">
              {current.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots de pagination discrets */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {marketSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-8" : "bg-white/30 w-1.5 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={handleMarketCta}
          className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-2xl hover:bg-slate-100 transition-all hover:scale-105"
        >
          {getCTAText("marketIntelligence", !!user)}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080810] to-transparent z-10" />
    </section>
  );
}