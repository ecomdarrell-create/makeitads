"use client";

import { motion } from "framer-motion";
import { Quote, Award } from "lucide-react";

export default function FounderMessage() {
  return (
    <section id="founder" className="relative z-10 overflow-hidden bg-[#FFFFFF] py-20 md:py-32">
      {/* Halos lumineux premium adaptés au thème blanc */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6366f1]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header avec badge premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
            <Award className="h-3.5 w-3.5 text-[#6366f1]" />
            <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">
              Founder's Vision
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-[#0F172A] leading-tight">
            Why I built{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
              MakeItAds
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#475569] max-w-3xl mx-auto leading-relaxed">
            A mission to democratize market intelligence for every business
          </p>
        </motion.div>

        {/* Contenu texte uniquement (Image et Stats supprimées) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-center mb-16 md:mb-20"
        >
          {/* Citation principale */}
          <div className="relative flex justify-center">
            <Quote className="absolute -top-2 -left-2 h-8 w-8 text-[#6366f1]/20" />
            <blockquote className="pl-8 text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A] leading-tight max-w-3xl">
              "I was tired of watching businesses burn millions on guesswork while their competitors scaled with data they didn't have."
            </blockquote>
          </div>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-3xl mx-auto">
            After years of consulting for Fortune 500 companies, I realized that <span className="font-semibold text-[#0F172A]">market intelligence shouldn't be a luxury reserved for enterprise budgets</span>. Every founder, every marketer, every small business deserves access to the same strategic insights that drive billion dollar decisions.
          </p>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-3xl mx-auto">
            That's why I built MakeItAds — to <span className="font-semibold text-[#8b5cf6]">democratize competitive intelligence</span> and give every business the power to make data driven decisions in minutes, not months.
          </p>

          {/* Signature */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col items-center">
            <p className="text-lg font-bold text-[#0F172A]">Dr. Darrell Kamga</p>
            <p className="text-sm text-[#64748B]">Founder & CEO, MakeItAds</p>
          </div>
        </motion.div>

        {/* Section vision avec timeline - Carte claire premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 md:p-12 overflow-hidden shadow-[0_10px_40px_rgba(15,23,42,0.08)]"
        >
          {/* Halos internes très subtils */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366f1]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8b5cf6]/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] mb-6 text-center">
              The vision behind MakeItAds
            </h3>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Identify the gap",
                  description: "Most marketing tools give you data. None give you context. We bridge that gap with AI powered market intelligence.",
                },
                {
                  step: "02",
                  title: "Analyze competitors",
                  description: "Real time competitive analysis that reveals what is working, what is not, and where the opportunities are hiding.",
                },
                {
                  step: "03",
                  title: "Execute with confidence",
                  description: "Turn insights into actionable strategies. No more guesswork. Just data driven decisions that drive growth.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative text-center md:text-left"
                >
                  <p className="text-xs font-bold text-[#6366f1] uppercase tracking-wider mb-2">Step {item.step}</p>
                  <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-3">{item.title}</h4>
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA final */}
            <div className="mt-12 text-center">
              <p className="text-lg sm:text-xl text-[#475569] mb-6">
                Ready to join thousands of businesses making smarter decisions?
              </p>
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:shadow-xl hover:shadow-[#6366f1]/40 transition-all hover:scale-105"
              >
                Start Your Free Trial
                <span className="text-lg">→</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}