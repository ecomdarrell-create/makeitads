"use client";

import { motion } from "framer-motion";
import { features } from "./landing-page-data";

// Images professionnelles UNIQUES pour chaque feature (pas de répétition avec autres sections)
const featureImages = [
  "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800", // AI Targeting - Dashboard analytics
  "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800", // Smart Scheduling - Calendar planning
  "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800", // Ad Copy Engine - Writing/content
  "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800", // Performance Analytics - Graphs
  "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800", // Budget Optimization - Finance
  "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=800", // Multi-Platform - Devices
];

export default function FeaturesSection() {
  return (
    <motion.section
      id="features"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65 }}
      className="relative border-t border-white/5 bg-[#0f0f1a]/80 py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(99,102,241,0.08),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,_rgba(139,92,246,0.06),_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#8b5cf6]">Features</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Everything you need. Nothing you don't.
            </h2>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl">
              Powerful tools designed for entrepreneurs who demand results.
            </p>
          </motion.div>
        </div>

        {/* Hero dashboard preview - Image unique */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-white/10 bg-[#080810]/95 shadow-[0_40px_120px_rgba(0,0,0,0.3)]">
          <div className="relative h-[500px]">
            <img
              src="https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Premium analytics dashboard"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <p className="text-sm font-bold uppercase tracking-[0.32em] text-slate-300 mb-4">Data-driven interface</p>
                <h3 className="text-4xl font-bold text-white max-w-3xl">
                  A dashboard that feels built for performance.
                </h3>
                <div className="mt-8 grid grid-cols-3 gap-6 max-w-2xl">
                  <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4">
                    <div className="text-3xl font-bold text-white">+53%</div>
                    <div className="text-xs text-slate-300 mt-1">CTR improvement</div>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4">
                    <div className="text-3xl font-bold text-white">10x</div>
                    <div className="text-xs text-slate-300 mt-1">Faster creation</div>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4">
                    <div className="text-3xl font-bold text-white">-40%</div>
                    <div className="text-xs text-slate-300 mt-1">Cost per lead</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-[#6366f1]/30 hover:shadow-[0_30px_90px_rgba(99,102,241,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/0 via-transparent to-transparent transition-all duration-500 group-hover:from-[#6366f1]/5 group-hover:via-[#8b5cf6]/5" />
              
              <div className="relative">
                {/* Image professionnelle */}
                <div className="relative mb-6 overflow-hidden rounded-xl h-40">
                  <img
                    src={featureImages[index]}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/40 to-transparent" />
                </div>

                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-4 text-slate-400 leading-relaxed">{feature.description}</p>
                <div className="mt-6 h-px w-12 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-300 group-hover:w-20" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#pricing"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#6366f1] px-8 py-4 text-sm font-bold text-white shadow-[0_20px_60px_rgba(56,189,248,0.2)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(99,102,241,0.3)]"
          >
            Join 12,400+ entrepreneurs
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}