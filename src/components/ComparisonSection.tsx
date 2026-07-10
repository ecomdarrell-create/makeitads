"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Target,
  Rocket,
  Megaphone,
  ImageIcon,
  BarChart3,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { getCTAHref } from "@/config/cta.config";

// ======================================================
// DATA
// ======================================================

const features = [
  {
    icon: Building2,
    title: "Knows Your Business",
    badge: "Business Context",
    badgeColor: "from-[#6366f1] to-[#8b5cf6]",
    description:
      "Understands your industry, audience and goals before generating any recommendation.",
  },
  {
    icon: Target,
    title: "Competitor Intelligence",
    badge: "Exclusive",
    badgeColor: "from-[#8b5cf6] to-[#a78bfa]",
    description:
      "Analyzes competitors in real-time instead of giving generic marketing advice.",
  },
  {
    icon: Rocket,
    title: "Marketing Strategies",
    badge: "Ready to Execute",
    badgeColor: "from-[#6366f1] to-[#38bdf8]",
    description:
      "Produces complete growth plans instead of isolated answers you have to assemble.",
  },
  {
    icon: Megaphone,
    title: "Campaign Ready",
    badge: "Ads Optimized",
    badgeColor: "from-[#10b981] to-[#34d399]",
    description:
      "Creates campaigns that can be launched immediately on every major platform.",
  },
  {
    icon: ImageIcon,
    title: "Visual Brief Generator",
    badge: "Creative AI",
    badgeColor: "from-[#f59e0b] to-[#fbbf24]",
    description:
      "Generates professional creative direction and briefs for every campaign.",
  },
  {
    icon: BarChart3,
    title: "Continuous Optimization",
    badge: "Data Driven",
    badgeColor: "from-[#ec4899] to-[#f472b6]",
    description:
      "Improves recommendations as your business evolves and market shifts.",
  },
];

const checklist = [
  "Business intelligence",
  "Competitor monitoring",
  "Growth strategy",
  "Market research",
  "Creative direction",
  "Campaign planning",
];

// ======================================================
// COMPOSANT CARTE FEATURE
// ======================================================

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
    >
      <div className="relative h-full rounded-2xl border border-white/10 bg-[#0f0f1a]/80 backdrop-blur-sm p-6 sm:p-8 transition-all duration-500 hover:border-[#6366f1]/40 hover:bg-[#0f0f1a] hover:shadow-2xl hover:shadow-[#6366f1]/10 hover:-translate-y-1">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10 px-3 py-1 mb-5">
          <div
            className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${feature.badgeColor}`}
          />
          <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
            {feature.badge}
          </span>
        </div>

        {/* Icône */}
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 border border-[#6366f1]/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="h-6 w-6 text-[#8b5cf6]" />
        </div>

        {/* Titre */}
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

// ======================================================
// COMPOSANT PRINCIPAL
// ======================================================

export default function ComparisonSection() {
  const { user } = useSession();

  const handleCta = () => {
    window.location.href = getCTAHref("comparison", !!user);
  };

  return (
    <section className="relative z-10 py-20 md:py-32 px-6 bg-[#080810]">
      {/* Background subtil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6366f1]/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#6366f1]" />
            <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">
              Why MakeItAds
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
            Why Businesses Choose{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
              MakeItAds
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Don't waste hours writing prompts. MakeItAds understands your
            business, your competitors and your market to deliver ready-to-use
            marketing strategies in minutes.
          </p>
        </motion.div>

        {/* 6 CARTES FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-16 md:mb-20">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* GRANDE CARTE FINALE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative rounded-3xl md:rounded-[2rem] border border-[#6366f1]/20 bg-gradient-to-br from-[#6366f1]/10 via-[#8b5cf6]/5 to-transparent p-8 sm:p-12 md:p-16 overflow-hidden">
            {/* Effet glassmorphism */}
            <div className="absolute inset-0 bg-[#0f0f1a]/40 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#8b5cf6]/5" />

            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#6366f1]/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#8b5cf6]/20 rounded-full blur-[100px]" />

            <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              {/* Colonne gauche : Texte */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 mb-6">
                  <Zap className="h-3.5 w-3.5 text-[#6366f1]" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    The Complete Solution
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
                  MakeItAds doesn't replace ChatGPT.
                </h3>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                  It gives businesses everything ChatGPT was{" "}
                  <span className="text-[#8b5cf6] font-semibold">
                    never designed to do.
                  </span>
                </p>

                <button
                  onClick={handleCta}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105"
                >
                  Start Building Your Strategy
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Colonne droite : Checklist */}
              <div>
                <div className="rounded-2xl border border-white/10 bg-[#080810]/60 backdrop-blur-sm p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Shield className="h-5 w-5 text-[#6366f1]" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Everything included
                    </h4>
                  </div>

                  <ul className="space-y-4">
                    {checklist.map((item, index) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <span className="text-sm sm:text-base text-slate-200 font-medium">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}