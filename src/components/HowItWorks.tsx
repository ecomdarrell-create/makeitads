"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Tell us about your product",
    description: "Describe your value, audience and offer in plain language. No marketing jargon required.",
    highlight: "We convert your description into targeting, copy and budget.",
    example: "A premium athletic shoe for urban runners who want comfort and style.",
    image: "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    step: "02",
    title: "AI analyzes your market",
    description: "The model identifies audiences, channels and campaign angles based on real data.",
    highlight: "It builds a strategy tailored to your country and objective.",
    example: "Processing audience signals and performance patterns.",
    image: "https://images.pexels.com/photos/3184463/pexels-photo-3184463.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    step: "03",
    title: "Get your complete strategy",
    description: "Receive targeting cards, ad copy, budget splits and schedule, ready to launch.",
    highlight: "Launch faster with ready-to-use recommendations.",
    example: "Plan includes Meta, TikTok and Google actions.",
    image: "https://images.pexels.com/photos/3184467/pexels-photo-3184467.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-t border-white/5 bg-[#080810] py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(99,102,241,0.08),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(139,92,246,0.06),_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#8b5cf6]">How it works</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              From idea to live campaign in 3 steps.
            </h2>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl">
              No complexity. No learning curve. Just describe your product and let our AI do the heavy lifting.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
            {steps.map((item, index) => (
              <motion.article
                key={item.step}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 shadow-[0_30px_80px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-500 hover:border-[#6366f1]/30 hover:shadow-[0_40px_100px_rgba(99,102,241,0.15)]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/0 via-transparent to-transparent transition-all duration-500 group-hover:from-[#6366f1]/10 group-hover:via-[#8b5cf6]/5" />

                <div className="relative mb-8 flex items-center justify-between gap-4">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-3xl font-bold text-white shadow-[0_20px_60px_rgba(99,102,241,0.3)] transition-transform duration-300 group-hover:scale-110">
                    {item.step}
                    <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#6366f1]/50 to-transparent" />
                </div>

                <div className="relative mb-6 overflow-hidden rounded-2xl h-40">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/40 to-transparent" />
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-bold text-white leading-tight">{item.title}</h3>
                  <p className="mt-4 text-slate-400 leading-relaxed">{item.description}</p>

                  <div className="mt-6 rounded-2xl border border-[#6366f1]/20 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 p-5 transition-all duration-300 group-hover:border-[#6366f1]/40 group-hover:shadow-[0_10px_40px_rgba(99,102,241,0.1)]">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="h-5 w-5 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="font-bold text-white text-sm">{item.highlight}</p>
                    </div>
                    <p className="mt-3 text-xs text-slate-500 pl-8 italic">{item.example}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="lg:hidden grid grid-cols-2 gap-4 mb-4">
            {steps.slice(0, 2).map((item, index) => (
              <motion.article
                key={item.step}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-500 hover:border-[#6366f1]/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-lg font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                </div>

                <div className="relative mb-4 overflow-hidden rounded-lg h-24">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/40 to-transparent" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white leading-tight">{item.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="lg:hidden">
            <motion.article
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 shadow-[0_30px_80px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-500 hover:border-[#6366f1]/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <div className="mb-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-2xl font-bold text-white shadow-lg">
                  {steps[2].step}
                </div>
              </div>

              <div className="relative mb-6 overflow-hidden rounded-xl h-40">
                <img
                  src={steps[2].image}
                  alt={steps[2].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/40 to-transparent" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white leading-tight">{steps[2].title}</h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{steps[2].description}</p>

                <div className="mt-4 rounded-xl border border-[#6366f1]/20 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 p-4">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-4 w-4 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="font-bold text-white text-xs">{steps[2].highlight}</p>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 pl-6 italic">{steps[2].example}</p>
                </div>
              </div>
            </motion.article>
          </div>
        </div>

        <motion.div
          className="mt-16 flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#live-demo"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6] px-8 py-4 text-sm font-bold text-white shadow-[0_20px_60px_rgba(56,189,248,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(139,92,246,0.35)]"
          >
            Try it now
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