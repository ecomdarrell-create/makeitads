"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisonRows = [
  {
    feature: "Mémoire persistante de votre business",
    makeitads: true,
    genericAi: false,
    searchTrends: false,
    platformSignals: false,
  },
  {
    feature: "Suivi en temps réel des concurrents",
    makeitads: true,
    genericAi: false,
    searchTrends: true,
    platformSignals: true,
  },
  {
    feature: "Stratégie de croissance prête à l'exécution",
    makeitads: true,
    genericAi: true,
    searchTrends: false,
    platformSignals: false,
  },
  {
    feature: "Détection d'opportunités multicanaux",
    makeitads: true,
    genericAi: false,
    searchTrends: false,
    platformSignals: false,
  },
  {
    feature: "Benchmark de positionnement concurrentiel",
    makeitads: true,
    genericAi: false,
    searchTrends: false,
    platformSignals: false,
  },
  {
    feature: "Feuille de route de campagne avec justification",
    makeitads: true,
    genericAi: true,
    searchTrends: false,
    platformSignals: false,
  },
  {
    feature: "Espace unique pour stratégie + exécution",
    makeitads: true,
    genericAi: false,
    searchTrends: false,
    platformSignals: false,
  },
];

function Badge({ value }: { value: boolean }) {
  return value ? (
    <div className="flex justify-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
        <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
      </div>
    </div>
    ) : (
    <div className="flex justify-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1F5F9] ring-1 ring-[#E2E8F0]">
        <X className="h-4 w-4 text-[#94A3B8]" strokeWidth={2.5} />
      </div>
    </div>
  );
}

export default function CompetitorsSection() {
  return (
    <section className="relative z-10 overflow-hidden bg-[#FFFFFF] px-4 py-20 sm:px-6 md:py-28">
      {/* Halo lumineux adapté au thème blanc */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-5xl text-left"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6366f1]">
            Intelligence concurrentielle
          </div>

          <h2 className="text-3xl font-bold leading-[1.02] tracking-[-0.04em] text-[#0F172A] sm:text-4xl md:text-5xl lg:text-6xl">
            Anticipez les mouvements de vos <span className="text-[#8b5cf6]">concurrents</span> avant qu'ils n'impactent votre stratégie.
          </h2>

          <p className="mt-4 max-w-2xl text-left text-sm leading-relaxed text-[#475569] sm:text-base md:text-lg">
            Le problème n'est pas le manque d'effort. Le problème, c'est que l'information arrive souvent après que la décision a déjà été prise, vous faisant perdre du temps et du budget.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Left Card: Premium Light */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)]"
          >
            <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748B]">
              Là où se crée la différence
            </div>

            <div className="space-y-4">
              {[
                "L'IA générique donne des idées. MakeItAds donne une direction claire et actionnable.",
                "Les outils classiques montrent des fragments. MakeItAds connecte les points pour une vision globale.",
                "Vous avancez plus vite quand la stratégie est validée avant d'engager le moindre franc.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-sm text-[#0F172A] shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Card: Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748B] sm:px-6">
                      Fonctionnalité
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6366f1] sm:px-6 bg-[#EEF2FF]/50">
                      MakeItAds
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748B] sm:px-6">
                      IA Générique
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748B] sm:px-6">
                      Outils de tendances
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748B] sm:px-6">
                      Signaux plateformes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-[#0F172A] sm:px-6">{row.feature}</td>
                      <td className="px-4 py-4 sm:px-6 bg-[#EEF2FF]/30"><Badge value={row.makeitads} /></td>
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