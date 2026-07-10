"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";
import { getCTAHref } from "@/config/cta.config";

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
      {/* IMAGE PLEIN ÉCRAN - RESPONSIVE MOBILE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/competitors-section.webp"
          alt="Competitive Intelligence"
          fill
          className="object-cover object-center md:object-cover"
          priority
          sizes="100vw"
          quality={90}
        />

        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-[#080810]/60" />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 mb-6">
            <Eye className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Competitive Intelligence
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            Know what{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
              competitors
            </span>{" "}
            are doing{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
              before it affects
            </span>{" "}
            your business.
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Real-time competitive intelligence that keeps you one step ahead.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center w-full max-w-sm"
        >
          <button
            onClick={handleCompetitorCta}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105 w-full"
          >
            Start Tracking Competitors
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080810] to-transparent z-10" />
    </section>
  );
}