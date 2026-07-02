"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";
import { getCTAText, getCTAHref } from "@/config/cta.config";

const marketSlides = [
  {
    id: 1,
    title: "Emerging Trends",
    subtitle: "Spot viral products before they peak.",
    image: "/images/market-trends-human.jpg",
  },
  {
    id: 2,
    title: "Opportunity Detection",
    subtitle: "Find gaps in saturated markets.",
    image: "/images/market-opportunities-human.jpg",
  },
  {
    id: 3,
    title: "Industry Benchmarks",
    subtitle: "Know exactly where you stand.",
    image: "/images/market-benchmarks-human.jpg",
  },
  {
    id: 4,
    title: "Competitor Watchlist",
    subtitle: "Track moves in real-time.",
    image: "/images/market-competitors-human.jpg",
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

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + marketSlides.length) % marketSlides.length);
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
      
      {/* IMAGE PLEIN ÉCRAN */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        {/* ✅ Overlay sombre pour garder l'image visible */}
        <div className="absolute inset-0 bg-[#080810]/80" />
      </div>

      {/* CONTENU CENTRÉ */}
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
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#6366f1] mb-4">
              Market Intelligence
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white">
              {current.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              {current.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={prevSlide}
            className="h-12 w-12 rounded-full border border-white/10 bg-white/5 shadow-sm flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          
          <div className="flex gap-2">
            {marketSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-[#6366f1] w-8" : "bg-white/20 w-2 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="h-12 w-12 rounded-full border border-white/10 bg-white/5 shadow-sm flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={handleMarketCta}
          className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105"
        >
          {getCTAText("marketIntelligence", !!user)}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080810] to-transparent z-10" />
    </section>
  );
}