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
    window.location.href = getCTAText("competitorIntelligence", !!user) === "Start Free" ? "/signup" : "/dashboard";
  };

  if (!mounted) return null;

  return (
    <section className="relative w-full py-16 md:py-24 px-6 overflow-hidden bg-[#080810] text-white">
      
      {/* Background subtil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6366f1]/10 rounded-full blur-[120px]" />
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
            <Eye className="h-3.5 w-3.5 text-[#6366f1]" />
            <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">Competitive Intelligence</span>
          </div>
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

        {/* Image en format carré 1:1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-[#0f0f1a] shadow-2xl shadow-[#6366f1]/10">
            <Image
              src="/images/competitors-square.png"
              alt="Competitive Intelligence Dashboard"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
    </section>
  );
}