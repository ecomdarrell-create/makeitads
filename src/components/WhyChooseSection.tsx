"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, Check } from "lucide-react";

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

  const gridOrder = [values[0], values[1], values[3], values[2]];

  return (
    <section id="fonctionnalites" className="relative z-10 py-12 md:py-20 bg-[#F1F1F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-3xl font-semibold text-[#18181B] mb-2 md:mb-3 leading-tight">
            Pourquoi choisir <span className="text-[#6366F1]">MakeItAds</span> ?
          </h2>
          <p className="text-xs md:text-sm text-[#71717A] leading-relaxed">
            Depuis le premier jour, notre engagement n&apos;a jamais changé :
            donner à chaque entrepreneur africain une stratégie publicitaire
            claire, précise et immédiatement actionnable.
          </p>
        </div>

        {/* Grille des 4 valeurs */}
        <div className="relative grid grid-cols-2 gap-2.5 md:gap-6 max-w-[600px] md:max-w-4xl mx-auto">
          {gridOrder.map((val, i) => (
            <motion.div
              key={val.num}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-[#FFFFFF] rounded-2xl md:rounded-3xl p-3.5 md:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:shadow-[0_2px_12px_rgba(0,0,0,0.06)] z-10 flex flex-col"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-extrabold text-xs md:text-lg mb-2.5 md:mb-4">
                {val.num}
              </div>
              <h3 className="text-[12px] md:text-base font-bold text-[#080810] mb-1.5 md:mb-3 leading-tight">
                {val.title}
              </h3>
              <p className="text-[10px] md:text-xs text-[#9094A8] leading-relaxed">
                {val.desc}
              </p>
            </motion.div>
          ))}

          {/* Flèches décoratives */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[25%] z-20 hidden md:flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-indigo-100 bg-white text-indigo-600 shadow-sm"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[25%] top-1/2 z-20 hidden md:flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-indigo-100 bg-white text-indigo-600 shadow-sm"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[25%] left-1/2 z-20 hidden md:flex h-6 w-6 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border border-indigo-100 bg-white text-indigo-600 shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10 md:mt-16 px-4">
          <button
            onClick={scrollToPricing}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#6366F1] text-white font-bold text-xs md:text-sm px-6 md:px-10 py-3 md:py-3.5 shadow-lg shadow-[#6366F1]/25 hover:bg-[#5558e6] transition-all hover:scale-[1.02]"
          >
            Voir nos offres et choisir mon plan
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}