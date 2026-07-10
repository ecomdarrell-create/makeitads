"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Target,
  Search,
  Megaphone,
  Users,
  Share2,
  TrendingUp,
  Rocket,
  FileText,
  Activity,
} from "lucide-react";

const modules = [
  {
    id: "market",
    label: "Market",
    icon: Globe,
    status: "Demand increasing",
    color: "from-[#6366f1] to-[#8b5cf6]",
    delay: 0,
  },
  {
    id: "competitors",
    label: "Competitors",
    icon: Target,
    status: "2 new campaigns detected",
    color: "from-[#8b5cf6] to-[#a78bfa]",
    delay: 0.1,
  },
  {
    id: "seo",
    label: "SEO",
    icon: Search,
    status: "12 opportunities found",
    color: "from-[#10b981] to-[#34d399]",
    delay: 0.2,
  },
  {
    id: "advertising",
    label: "Advertising",
    icon: Megaphone,
    status: "Meta CPM decreasing",
    color: "from-[#6366f1] to-[#38bdf8]",
    delay: 0.3,
  },
  {
    id: "audience",
    label: "Audience",
    icon: Users,
    status: "High purchase intent",
    color: "from-[#8b5cf6] to-[#ec4899]",
    delay: 0.4,
  },
  {
    id: "social",
    label: "Social Media",
    icon: Share2,
    status: "Viral signal detected",
    color: "from-[#38bdf8] to-[#6366f1]",
    delay: 0.5,
  },
  {
    id: "trends",
    label: "Search Trends",
    icon: TrendingUp,
    status: "Keyword volume rising",
    color: "from-[#f59e0b] to-[#fbbf24]",
    delay: 0.6,
  },
  {
    id: "growth",
    label: "Growth",
    icon: Rocket,
    status: "New strategy generated",
    color: "from-[#10b981] to-[#6366f1]",
    delay: 0.7,
  },
  {
    id: "content",
    label: "Content",
    icon: FileText,
    status: "Publishing opportunity",
    color: "from-[#8b5cf6] to-[#6366f1]",
    delay: 0.8,
  },
];

export default function AILiveIntelligence() {
  return (
    <section className="relative z-10 py-20 md:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a]" />
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[#6366f1]/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#8b5cf6]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#38bdf8]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
            <Activity className="h-3.5 w-3.5 text-[#6366f1]" />
            <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">
              Live Intelligence
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            AI Live{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed">
            A command center that never sleeps. MakeItAds monitors your market, competitors and opportunities in real time.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block relative aspect-square max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 lg:w-64 lg:h-64">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6366f1]/30 via-[#8b5cf6]/20 to-[#38bdf8]/30 blur-2xl"
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-[#6366f1]/30"
              />
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border border-[#8b5cf6]/30"
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-12 rounded-full border border-[#38bdf8]/30"
              />
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-16 rounded-full bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] shadow-[0_0_80px_rgba(99,102,241,0.5)]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Business</p>
                  <p className="text-xs font-bold text-white">Intelligence</p>
                  <p className="text-[10px] text-white/60">Engine</p>
                </div>
              </div>
            </div>

            {modules.map((module, index) => {
              const Icon = module.icon;
              const angle = (index / modules.length) * 360;
              const radius = 42;
              const x = Number((50 + radius * Math.cos((angle * Math.PI) / 180)).toFixed(2));
              const y = Number((50 + radius * Math.sin((angle * Math.PI) / 180)).toFixed(2));
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: module.delay }}
                  animate={{ y: [0, -5, 0] }}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="group"
                >
                  <div
                    className="absolute top-1/2 left-1/2 h-px origin-left"
                    style={{
                      width: `${radius * 3}px`,
                      transform: `rotate(${angle + 180}deg)`,
                      background: `linear-gradient(90deg, rgba(99, 102, 241, 0.3) 0%, transparent 100%)`,
                    }}
                  />
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.3, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 w-1 h-1 -mt-0.5 rounded-full bg-[#6366f1]"
                    style={{ transform: `rotate(${angle + 180}deg) translateX(${radius * 1.5}px)` }}
                  />
                  <div className="relative w-44 lg:w-52">
                    <div className="relative rounded-2xl border border-white/10 bg-[#0a0a1a]/80 backdrop-blur-xl p-3 lg:p-4 shadow-2xl hover:border-[#6366f1]/30 transition-all duration-500">
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
                      <div className="relative flex items-start gap-3">
                        <div className={`flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br ${module.color} bg-opacity-20 flex items-center justify-center border border-white/10`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white mb-0.5">{module.label}</p>
                          <p className="text-[10px] text-slate-400 leading-tight">{module.status}</p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="md:hidden relative">
            <div className="relative mx-auto w-40 h-40 mb-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6366f1]/30 via-[#8b5cf6]/20 to-[#38bdf8]/30 blur-2xl"
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-[#6366f1]/30"
              />
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-8 rounded-full bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] shadow-[0_0_60px_rgba(99,102,241,0.5)]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-white/60 mb-0.5">Business</p>
                  <p className="text-[11px] font-bold text-white">Intelligence</p>
                  <p className="text-[9px] text-white/60">Engine</p>
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-40 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-[#6366f1]/30 via-[#8b5cf6]/20 to-transparent" />

            <div className="relative space-y-4">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#6366f1] z-10"
                    />
                    <div className="relative rounded-2xl border border-white/10 bg-[#0a0a1a]/80 backdrop-blur-xl p-4 shadow-2xl">
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${module.color} opacity-5`} />
                      <div className="relative flex items-center gap-3">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center border border-white/10`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-sm font-bold text-white">{module.label}</p>
                            <motion.div
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                            />
                          </div>
                          <p className="text-xs text-slate-400 leading-tight">{module.status}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Every signal, every shift, every opportunity monitored 24/7 by your AI intelligence engine.
          </p>
        </motion.div>
      </div>
    </section>
  );
}