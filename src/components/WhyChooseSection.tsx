"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

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
    title: "Messages qui convertissent",
    desc: "Des copies publicitaires prêtes à copier-coller, testées sur votre secteur spécifique, adaptées à votre audience réelle.",
  },
  {
    num: 4,
    title: "Maximiser chaque franc",
    desc: "Allocation budgétaire intelligente, KPIs clairs, erreurs à éviter. Chaque franc compte et nous le traitons comme tel.",
  },
];

export default function WhyChooseSection() {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  // Ordre DOM pour un cycle visuel parfait : 1 (HG), 2 (HD), 4 (BG), 3 (BD)
  // Cela permet aux flèches de faire 1->2->3->4->1 en cercle
  const gridOrder = [values[0], values[1], values[3], values[2]];

  return (
    <section className="relative z-10 py-10 md:py-20 bg-[#F1F1F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Titre et Sous-titre */}
        <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
          <h2 className="text-[22px] md:text-[32px] font-extrabold text-[#080810] mb-3 md:mb-4 leading-tight">
            Pourquoi choisir MakeItAds ?
          </h2>
          <p className="text-[13px] md:text-[15px] text-[#9094A8] leading-[1.6]">
            Depuis le premier jour, notre engagement n'a jamais changé: donner à chaque entrepreneur africain une stratégie publicitaire claire, précise et immédiatement actionnable.
          </p>
        </div>

        {/* Grille 2x2 stricte pour mobile et desktop */}
        <div className="relative grid grid-cols-2 gap-[10px] md:gap-[24px] max-w-[600px] md:max-w-4xl mx-auto">
          
          {gridOrder.map((val, i) => (
            <motion.div
              key={val.num}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-[#FFFFFF] rounded-[12px] md:rounded-[16px] p-[14px] md:p-[28px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:shadow-[0_2px_12px_rgba(0,0,0,0.06)] z-10 flex flex-col"
            >
              <div className="w-[34px] h-[34px] md:w-[48px] md:h-[48px] rounded-full bg-[#6366F1] flex items-center justify-center text-white font-extrabold text-[14px] md:text-[20px] mb-[10px] md:mb-[16px]">
                {val.num}
              </div>
              <h3 className="text-[12px] md:text-[18px] font-bold text-[#080810] mb-[6px] md:mb-[16px] leading-tight">
                {val.title}
              </h3>
              <p className="text-[11px] md:text-[14px] text-[#9094A8] leading-[1.5]">
                {val.desc}
              </p>
            </motion.div>
          ))}

          {/* Flèches SVG Overlay - Desktop */}
          <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 600 400">
            {/* 1 (HG) to 2 (HD) : Horizontal Right */}
            <path d="M 310 80 Q 300 60 290 80" fill="none" stroke="#8B5CF6" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
            {/* 2 (HD) to 3 (BD) : Vertical Down */}
            <path d="M 520 210 Q 540 200 520 190" fill="none" stroke="#8B5CF6" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
            {/* 3 (BD) to 4 (BG) : Horizontal Left */}
            <path d="M 310 320 Q 300 340 290 320" fill="none" stroke="#8B5CF6" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
            {/* 4 (BG) to 1 (HG) : Vertical Up */}
            <path d="M 80 210 Q 60 200 80 190" fill="none" stroke="#8B5CF6" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" />
              </marker>
            </defs>
          </svg>

          {/* Flèches SVG Overlay - Mobile */}
          <svg className="md:hidden absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 300 300">
            {/* 1 (HG) to 2 (HD) : Horizontal Right */}
            <path d="M 155 50 Q 150 40 145 50" fill="none" stroke="#8B5CF6" strokeWidth="1.5" markerEnd="url(#arrowhead-m)" />
            {/* 2 (HD) to 3 (BD) : Vertical Down */}
            <path d="M 250 155 Q 260 150 250 145" fill="none" stroke="#8B5CF6" strokeWidth="1.5" markerEnd="url(#arrowhead-m)" />
            {/* 3 (BD) to 4 (BG) : Horizontal Left */}
            <path d="M 155 250 Q 150 260 145 250" fill="none" stroke="#8B5CF6" strokeWidth="1.5" markerEnd="url(#arrowhead-m)" />
            {/* 4 (BG) to 1 (HG) : Vertical Up */}
            <path d="M 50 155 Q 40 150 50 145" fill="none" stroke="#8B5CF6" strokeWidth="1.5" markerEnd="url(#arrowhead-m)" />
            <defs>
              <marker id="arrowhead-m" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill="#8B5CF6" />
              </marker>
            </defs>
          </svg>

        </div>

        {/* CTA Final */}
        <div className="flex justify-center mt-10 md:mt-16 px-4">
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