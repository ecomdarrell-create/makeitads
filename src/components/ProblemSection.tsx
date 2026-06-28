"use client";

import { motion } from "framer-motion";
import { problemItems } from "./landing-page-data";

// Images UNIQUES pour ProblemSection (différentes des autres sections)
const problemImages = [
  "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800", // Targeting - Confusion/Strategy
  "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800", // Copy - Writing struggle
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800", // Performance - Analytics confusion
];

export default function ProblemSection() {
  return (
    <section className="relative border-t border-white/5 bg-[#0f0f1a]/80 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(99,102,241,0.08),_transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(139,92,246,0.06),_transparent_40%)]" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#a78bfa]">The problem</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Running ads shouldn't feel like guesswork.
            </h2>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl">
              Most entrepreneurs waste thousands on ads that don't convert. We fix that with AI-powered strategy.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="grid gap-6">
            {problemItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/5 p-6 transition duration-300 hover:border-[#6366f1]/30 hover:bg-white/10 hover:shadow-[0_30px_90px_rgba(99,102,241,0.12)]"
              >
                <div className="relative h-32 mb-6 overflow-hidden rounded-xl">
                  <img
                    src={problemImages[index]}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080810] to-transparent" />
                </div>

                <div className="relative">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080810]/95 p-8 shadow-[0_35px_90px_rgba(0,0,0,0.18)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/3184421/pexels-photo-3184421.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Analytics dashboard"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#080810]/90 via-[#080810]/85 to-[#080810]/95" />
            </div>

            <div className="relative space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#0b0b17]/95 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#8b5cf6]">Ad performance snapshot</p>
                    <p className="mt-3 text-3xl font-bold text-white">CTR +53%</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 px-4 py-2 text-xs font-bold text-[#c7d2fe] border border-[#6366f1]/30">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    High impact
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Audience engagement</span>
                      <span className="font-bold text-white">82%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "82%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#38bdf8]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Spend efficiency</span>
                      <span className="font-bold text-white">72%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "72%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#11101d]/95 p-5 backdrop-blur-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-500">Ad copy clarity</p>
                  <div className="mt-5 space-y-3">
                    <span className="block rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 border border-white/5">
                      ✓ Headline variants
                    </span>
                    <span className="block rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 border border-white/5">
                      ✓ CTA recommendations
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#11101d]/95 p-5 backdrop-blur-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-500">Creative direction</p>
                  <div className="mt-5 grid gap-3">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 border border-white/5">
                      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#6366f1]" /> Visual brief ready
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 border border-white/5">
                      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6]" /> Platform-tailored angles
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#live-demo"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-4 text-sm font-bold text-white shadow-[0_20px_60px_rgba(99,102,241,0.2)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(139,92,246,0.3)]"
          >
            Read the strategy playbook
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}