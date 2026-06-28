"use client";

import { motion } from "framer-motion";

export default function FounderSection() {
  return (
    <section id="founder" className="relative border-t border-white/5 bg-[#0f0f1a]/90 py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(99,102,241,0.06),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,_rgba(139,92,246,0.04),_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          className="rounded-2xl border border-white/10 bg-[#080810]/95 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.3)] backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
        >
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left column - Quote */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#8b5cf6]">
                  A message from our founder
                </p>
                <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                  Built for founders who deserve a strategy that competes at the highest level.
                </h2>
              </motion.div>

              {/* Quote with decorative element */}
              <motion.div
                className="mt-10 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Large quote mark */}
                <div className="absolute -top-4 -left-2 text-7xl font-serif text-[#6366f1]/20 leading-none">
                  "
                </div>
                <p className="relative text-lg leading-8 text-slate-300 pl-8 border-l-2 border-[#6366f1]/30">
                  MakeItAds was born from a simple frustration: great products were failing not because they weren't good enough, but because their creators couldn't afford the marketing expertise to reach the right people. I built MakeItAds for every entrepreneur who has a vision but doesn't have a marketing team behind them. Whether you're launching from Paris, Douala, London or Lagos, you deserve a strategy that competes at the highest level. This is that tool.
                </p>
              </motion.div>
            </div>

            {/* Right column - Founder card (No photo, clean layout) */}
            <motion.div
              className="flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Founder profile card */}
              <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-[#11101d] to-[#0a0a15] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
                
                {/* Name and Role */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#8b5cf6]">
                    Founder & CEO
                  </p>
                  <h3 className="text-3xl font-bold text-white">Darrell Kamga</h3>
                  {/* Removed the small "MakeItAds" text here as requested */}
                </div>

                {/* Decorative line */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#6366f1]/50 to-transparent" />

                {/* Logo Signature (No "Signature" text) */}
                <div className="mt-8">
                  <div className="text-3xl font-bold tracking-tight">
                    <span className="text-white">Make</span>
                    <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                      ItAds
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA button */}
        <motion.div
          className="mt-12 flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#contact"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-4 text-sm font-bold text-white shadow-[0_20px_60px_rgba(99,102,241,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(139,92,246,0.35)]"
          >
            Experience founder-grade strategy
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}