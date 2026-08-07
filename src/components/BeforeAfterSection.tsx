"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  Users,
  DollarSign,
  Compass,
  Calendar,
  BarChart3,
} from "lucide-react";

// ✅ CORRECTION : Ajout de "as const" pour satisfaire le typage strict de Framer Motion
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;

const badges = [
  { label: "Strategy Generated", icon: Sparkles, color: "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20" },
  { label: "Audience Identified", icon: Users, color: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20" },
  { label: "Budget Optimized", icon: DollarSign, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { label: "Competitors Analyzed", icon: Target, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { label: "Growth Ready", icon: TrendingUp, color: "bg-[#38BDF8]/10 text-[#0284C7] border-[#38BDF8]/20" },
];

const strategyItems = [
  { icon: Users, label: "Target Audience", value: "Women 25-40, Urban, Premium", color: "text-[#6366F1]" },
  { icon: Compass, label: "Marketing Angle", value: "Aspirational lifestyle + social proof", color: "text-[#8B5CF6]" },
  { icon: DollarSign, label: "Recommended Budget", value: "$2,500/mo (Meta 60%, Google 40%)", color: "text-emerald-600" },
  { icon: BarChart3, label: "Expected Performance", value: "+340% ROAS in 90 days", color: "text-[#0284C7]" },
  { icon: Calendar, label: "Content Calendar", value: "12 posts + 4 ad variations / month", color: "text-[#8B5CF6]" },
];

export default function BeforeAfterSection() {
  return (
    <section className="relative z-10 py-20 md:py-32 px-4 sm:px-6 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.1] text-[#0F172A] mb-4 sm:mb-6">
            See What Changes With{" "}
            <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
              MakeItAds
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed">
            One product photo becomes a complete marketing strategy in seconds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="h-2 w-2 rounded-full bg-[#94A3B8]" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#64748B]">
                  Without MakeItAds
                </span>
              </div>

              <div className="rounded-[28px] bg-[#F8FAFC] border border-[#E5E7EB] p-6 sm:p-8 shadow-sm">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#E5E7EB] mb-5 sm:mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop"
                    alt="Product"
                    fill
                    className="object-cover opacity-80"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC]/60 to-transparent" />
                </div>

                <div className="space-y-3">
                  <div className="h-5 w-3/4 rounded-md bg-[#E5E7EB]" />
                  <div className="h-3 w-full rounded-md bg-[#E5E7EB]" />
                  <div className="h-3 w-5/6 rounded-md bg-[#E5E7EB]" />
                </div>

                <div className="flex flex-wrap gap-2 mt-5 sm:mt-6">
                  <span className="px-3 py-1.5 rounded-full bg-[#E5E7EB] text-[11px] font-medium text-[#94A3B8]">
                    No targeting
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#E5E7EB] text-[11px] font-medium text-[#94A3B8]">
                    No channels
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#E5E7EB] text-[11px] font-medium text-[#94A3B8]">
                    No strategy
                  </span>
                </div>

                <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-2 text-[#94A3B8]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#94A3B8]" />
                    <p className="text-xs sm:text-sm font-medium">Waiting for a strategy...</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="relative group"
          >
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="h-2 w-2 rounded-full bg-[#6366F1]" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#6366F1]">
                With MakeItAds
              </span>
            </div>

            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="rounded-[28px] bg-white border border-[#6366F1]/10 p-6 sm:p-8 shadow-[0_8px_40px_-12px_rgba(99,102,241,0.15)] hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.25)] transition-shadow duration-500"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F8FAFC] mb-5 sm:mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop"
                  alt="Product with strategy"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                  <Zap className="h-3.5 w-3.5 text-[#6366F1]" />
                  <span className="text-xs font-bold text-[#0F172A]">Strategy Score: 94</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-[#6366F1]" />
                      <span className="text-xs font-bold text-[#0F172A]">Complete Strategy Ready</span>
                    </div>
                    <p className="text-[11px] text-[#475569]">5 platforms • 12 campaigns • 90-day roadmap</p>
                  </div>
                </div>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="space-y-3 mb-5 sm:mb-6"
              >
                {strategyItems.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#EEF2FF] transition-colors duration-200"
                  >
                    <div className={`flex-shrink-0 ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">
                        {item.label}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-[#0F172A] truncate">
                        {item.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2 mb-5 sm:mb-6"
              >
                {badges.map((badge, i) => (
                  <motion.span
                    key={i}
                    variants={itemVariants}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] sm:text-[11px] font-semibold ${badge.color}`}
                  >
                    <badge.icon className="h-3 w-3" />
                    {badge.label}
                  </motion.span>
                ))}
              </motion.div>

              <div className="pt-5 sm:pt-6 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <p className="text-xs sm:text-sm font-semibold text-[#0F172A]">Ready to launch</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6366F1]">
                    <span className="text-xs font-bold">View strategy</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}