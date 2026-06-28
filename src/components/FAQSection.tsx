"use client";

import { AnimatePresence, motion } from "framer-motion";
import { faqItems } from "./landing-page-data";

export default function FAQSection({
  accordionIndex,
  setAccordionIndex,
}: {
  accordionIndex: number | null;
  setAccordionIndex: (index: number | null) => void;
}) {
  return (
    <section id="faq" className="relative border-t border-white/5 bg-[#080810] py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(99,102,241,0.06),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(139,92,246,0.04),_transparent_50%)]" />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#8b5cf6]">FAQ</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Questions? We have answers.
          </h2>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about MakeItAds. Can't find what you're looking for? Reach out to our team.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const open = accordionIndex === index;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                  open
                    ? "border-[#6366f1]/30 bg-gradient-to-br from-[#11101d] to-[#0a0a15] shadow-[0_20px_60px_rgba(99,102,241,0.15)]"
                    : "border-white/10 bg-[#0f0f1a]/80 hover:border-[#6366f1]/20 hover:bg-[#0f0f1a]"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left transition-colors"
                  onClick={() => setAccordionIndex(open ? null : index)}
                >
                  <div className="flex items-center gap-4">
                    {/* Question number badge */}
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        open
                          ? "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f1]/30"
                          : "bg-white/5 text-slate-400 group-hover:bg-[#6366f1]/10 group-hover:text-[#8b5cf6]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base font-bold text-white">{item.question}</span>
                  </div>
                  {/* Animated chevron */}
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                      open
                        ? "bg-[#6366f1]/20 text-[#8b5cf6]"
                        : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-white/5 px-6 pb-6 pt-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]" />
                          </div>
                          <p className="text-sm leading-7 text-slate-300">{item.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA section */}
        <motion.div
          className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#080810] p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/30">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">Still have questions?</h3>
          <p className="mt-2 text-sm text-slate-400">Our team is here to help. Reach out anytime.</p>
          <a
            href="#contact"
            className="group mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#6366f1] px-8 py-4 text-sm font-bold text-white shadow-[0_20px_60px_rgba(56,189,248,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(99,102,241,0.35)]"
          >
            Contact us
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}