"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown, Check, ArrowUp } from "lucide-react";

const values = [
  {
    num: 1,
    title: "Analyser avant tout",
    desc: "Chaque stratégie commence par une analyse complète de votre business, votre marché et vos concurrents. Pas de générique. Jamais.",
  },
  {
    num: 2,
    title: "Cibler avec précision",
    desc: "Nous identifions exactement qui est votre client idéal, où il se trouve, ce qui le motive et ce qui le retient d'acheter.",
  },
  {
    num: 3,
    title: "Générer des messages qui convertissent",
    desc: "Des copies publicitaires prêtes à copier-coller, testées sur votre secteur spécifique, adaptées à votre audience réelle.",
  },
  {
    num: 4,
    title: "Maximiser chaque franc investi",
    desc: "Allocation budgétaire intelligente, KPIs clairs, erreurs à éviter. Chaque franc compte et nous le traitons comme tel.",
  },
];

export default function WhyChooseSection() {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative z-10 py-10 md:py-20 bg-[#F8F8FC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Photo du fondateur */}
        <div className="mb-8 md:mb-14 flex justify-center">
          <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/founder/founder.jpg"
              alt="Fondateur de MakeItAds"
              width={800}
              height={420}
              className="w-full h-[200px] md:h-[420px] object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* Titre et Sous-titre */}
        <div className="text-center mb-8 md:mb-16 max-w-3xl mx-auto px-2">
          <h2 className="text-[22px] md:text-[32px] font-extrabold text-[#080810] mb-3 md:mb-4 leading-tight">
            Pourquoi choisir MakeItAds ?
          </h2>
          <p className="text-[13px] md:text-[15px] text-[#9094A8] leading-[1.6]">
            Depuis le premier jour, notre engagement n'a jamais changé: donner à chaque entrepreneur africain une stratégie publicitaire claire, précise et immédiatement actionnable.
          </p>
        </div>

        {/* Cycle des 4 valeurs (Adapté pour faire une boucle visuelle sur mobile) */}
        <div className="mb-12 md:mb-24">
          {/* Mobile: Flux vertical avec indication de boucle */}
          <div className="md:hidden relative pl-6 space-y-0">
            {/* Ligne continue à gauche */}
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-[#E2E2EC]" />
            
            {values.map((val, i) => (
              <div key={val.num} className="relative mb-6 last:mb-0">
                <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-extrabold text-[14px] z-10 border-4 border-[#F8F8FC]">
                  {val.num}
                </div>
                <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E2E2EC] shadow-sm">
                  <h3 className="font-bold text-[#080810] text-[14px] mb-1">{val.title}</h3>
                  <p className="text-[12px] text-[#9094A8] leading-relaxed">{val.desc}</p>
                </div>
                {/* Flèche vers le bas, sauf pour le dernier qui a une flèche de boucle */}
                {i < values.length - 1 ? (
                  <div className="flex justify-center my-2">
                    <ChevronDown className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-[#6366F1] font-medium bg-[#EEF2FF] py-2 rounded-lg border border-[#6366F1]/20">
                    <ArrowUp className="w-4 h-4" />
                    <span>Et la boucle est bouclée pour votre croissance</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: Cycle 2x2 avec flèches SVG */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 relative max-w-4xl mx-auto">
            {values.map((val, i) => (
              <motion.div
                key={val.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E2EC] z-10"
              >
                <div className="w-[56px] h-[56px] rounded-full bg-[#6366F1] flex items-center justify-center text-white font-extrabold text-[22px] mb-4">
                  {val.num}
                </div>
                <h3 className="font-bold text-[#080810] text-[18px] mb-2">{val.title}</h3>
                <p className="text-[14px] text-[#9094A8] leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 400">
              <path d="M 380 100 Q 400 50 420 100" fill="none" stroke="#8B5CF6" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
              <path d="M 500 180 Q 550 200 500 220" fill="none" stroke="#8B5CF6" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
              <path d="M 420 300 Q 400 350 380 300" fill="none" stroke="#8B5CF6" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
              <path d="M 300 220 Q 250 200 300 180" fill="none" stroke="#8B5CF6" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>

        {/* CTA Final */}
        <div className="flex justify-center px-4">
          <button
            onClick={scrollToPricing}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#6366F1] text-white font-bold text-[14px] md:text-[16px] px-8 md:px-12 py-3.5 md:py-4 shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:bg-[#8B5CF6] transition-colors duration-200"
          >
            Voir nos offres et choisir mon plan
            <Check className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}