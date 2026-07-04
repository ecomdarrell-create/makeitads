"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
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
      
      {/* IMAGE PLEIN ÉCRAN */}
      <div className="absolute inset-0 z-0">
        {/* Desktop */}
        <div className="hidden lg:block absolute inset-0">
          <Image
            src="/images/competitors-editorial-desktop.webp"
            alt="Competitive Intelligence War Room"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        
        {/* Mobile */}
        <div className="lg:hidden absolute inset-0">
          <Image
            src="/images/competitors-editorial-mobile.webp"
            alt="Competitive Intelligence"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        
        {/* Overlay sombre 40% */}
        <div className="absolute inset-0 bg-[#080810]/40" />
      </div>

      {/* CONTENU CENTRÉ - Style Apple/Stripe */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 mb-6">
            <Eye className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Competitive Intelligence</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
            Know what competitors are doing{" "}
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              before it affects your business.
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
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
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-2xl hover:bg-slate-100 transition-all hover:scale-105"
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