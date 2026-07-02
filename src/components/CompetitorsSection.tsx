"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";
import { getCTAText, getCTAHref } from "@/config/cta.config";

export default function CompetitorsSection() {
  const { user } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCompetitorCta = () => {
    window.location.href = getCTAHref("competitorIntelligence", !!user);
  };

  if (!mounted) return null;

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#080810] text-white">
      
      {/* IMAGE ÉDITORIALE PLEIN ÉCRAN */}
      <div className="absolute inset-0">
        <div className="hidden lg:block w-full h-full">
          <Image
            src="/images/competitors-editorial-desktop.webp"
            alt="Competitive Intelligence War Room"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="lg:hidden w-full h-full">
          <Image
            src="/images/competitors-editorial-mobile.webp"
            alt="Competitive Intelligence"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {/* ✅ Overlay sombre pour garder l'image visible */}
        <div className="absolute inset-0 bg-[#080810]/80" />
      </div>

      {/* CONTENU CENTRÉ */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-4xl"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white">
            Know what competitors are doing{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
              before it affects your business.
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Real-time competitive intelligence that keeps you one step ahead.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <button 
            onClick={handleCompetitorCta}
            className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105"
          >
            {getCTAText("competitorIntelligence", !!user)} 
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080810] to-transparent z-10" />
    </section>
  );
}