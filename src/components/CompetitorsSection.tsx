"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisonRows = [
  {
    feature: "Persistent business memory",
    makeitads: true,
    genericAi: false,
    searchTrends: false,
    platformSignals: false,
  },
  {
    feature: "Live competitor signal tracking",
    makeitads: true,
    genericAi: false,
    searchTrends: true,
    platformSignals: true,
  },
  {
    feature: "Execution-ready growth strategy",
    makeitads: true,
    genericAi: true,
    searchTrends: false,
    platformSignals: false,
  },
  {
    feature: "Opportunity detection across channels",
    makeitads: true,
    genericAi: false,
    searchTrends: false,
    platformSignals: false,
  },
  {
    feature: "Positioning benchmark against competitors",
    makeitads: true,
    genericAi: false,
    searchTrends: false,
    platformSignals: false,
  },
  {
    feature: "Campaign roadmap with rationale",
    makeitads: true,
    genericAi: true,
    searchTrends: false,
    platformSignals: false,
  },
  {
    feature: "Single workspace for strategy + execution",
    makeitads: true,
    genericAi: false,
    searchTrends: false,
    platformSignals: false,
  },
];

function Badge({ value }: { value: boolean }) {
  return value ? (
    <div className="flex justify-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30">
        <Check className="h-4 w-4 text-emerald-400" strokeWidth={2.5} />
      </div>
    </div>
  ) : (
    <div className="flex justify-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 ring-1 ring-white/10">
        <X className="h-4 w-4 text-slate-500" strokeWidth={2.5} />
      </div>
    </div>
  );
}

export default function CompetitorsSection() {
  return (
    <section className="relative z-10 overflow-hidden bg-[#080810] px-4 py-20 sm:px-6 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-5xl text-left"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c7d2fe]">
            Competitive intelligence
          </div>

          <h2 className="text-3xl font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Know what <span className="text-[#8b5cf6]">competitors</span> are doing before it changes your next move.
          </h2>

          <p className="mt-4 max-w-2xl text-left text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
            Most teams are not late because they lack effort. They’re late because the signal arrives after the decision has already been made.
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="rounded-[24px] border border-white/10 bg-[#0a0a14]/80 p-5 sm:p-6"
          >
            <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c7d2fe]">
              Where the gap shows up
            </div>

            <div className="space-y-4">
              {[
                "Generic AI gives ideas. MakeItAds gives direction.",
                "Search and platform tools surface fragments. MakeItAds connects them.",
                "Teams move faster when the pattern is visible before the spend is committed.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a14]/80"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:px-6">
                      Capability
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a5b4fc] sm:px-6">
                      MakeItAds
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:px-6">
                      Generic AI
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:px-6">
                      Search trends
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:px-6">
                      Platform signals
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-4 text-sm font-medium text-slate-200 sm:px-6">{row.feature}</td>
                      <td className="px-4 py-4 sm:px-6"><Badge value={row.makeitads} /></td>
                      <td className="px-4 py-4 sm:px-6"><Badge value={row.genericAi} /></td>
                      <td className="px-4 py-4 sm:px-6"><Badge value={row.searchTrends} /></td>
                      <td className="px-4 py-4 sm:px-6"><Badge value={row.platformSignals} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}