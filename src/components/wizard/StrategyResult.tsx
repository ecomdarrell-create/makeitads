"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle, TrendingUp, Target, Wallet } from "lucide-react";
import type { ProComplete, PremiumComplete, EliteComplete } from "@/lib/ai/provider";
import { getCurrencySymbol, normalizeCurrency } from "@/lib/currency";

// ✅ Le composant accepte n'importe quelle version (Pro / Premium / Elite)
// Les champs additionnels (analyse_concurrentielle, hooks, etc.) sont optionnels
type AnyStrategy = ProComplete | PremiumComplete | EliteComplete;

type Props = {
  strategy: AnyStrategy;
  currency?: string;
};

export default function StrategyResult({ strategy, currency = "XOF" }: Props) {
  // ✅ Symbole de la devise du user
  const currencySymbol = getCurrencySymbol(normalizeCurrency(currency));

  // ✅ Budget — nouveau schéma
  // Le champ `montant_total` est un nombre, on l'affiche avec son symbole
  const budgetTotal = strategy.budget?.montant_total ?? 0;
  const cpcEstime = strategy.budget?.cpc_estime ?? 0;
  const devise = strategy.budget?.devise || currencySymbol;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* RÉSUMÉ EXÉCUTIF */}
      <div className="rounded-[20px] border border-[#6366F1]/20 bg-[#6366F1]/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1] text-white">
            <Target className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-bold text-[#18181B]">Résumé stratégique</h3>
        </div>
        <p className="text-[13px] leading-relaxed text-[#475569]">
          {strategy.salutation}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#475569]">
          {strategy.executive_summary.synthese}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard label="Préparation" value={`${strategy.executive_summary.preparation}/100`} />
          <StatCard label="Opportunité" value={strategy.executive_summary.opportunite} />
          <StatCard label="Priorité n°1" value="1" />
          <StatCard
            label="Risque"
            value={strategy.executive_summary.risque_principal.slice(0, 20) + "…"}
          />
        </div>
      </div>

      {/* INSIGHTS */}
      <Section title="🔍 Insights clés" icon={<TrendingUp className="h-3.5 w-3.5" />}>
        <div className="space-y-2">
          {strategy.insights.map((insight, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-[#F8F8FC] p-3">
              <p className="text-xs font-bold text-[#18181B]">{insight.titre}</p>
              <p className="mt-1 text-[11px] text-[#475569]">{insight.explication}</p>
              <p className="mt-1.5 text-[10px] font-medium text-[#6366F1]">
                Impact : {insight.impact}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* PRIORITÉS */}
      <Section title="🎯 Priorités d'action">
        <div className="space-y-2">
          {strategy.priorities.map((p, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-[#18181B]">{p.titre}</p>
                <span className="rounded-full bg-[#6366F1]/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[#6366F1]">
                  {p.niveau}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#475569]">{p.pourquoi}</p>
              <p className="mt-1.5 text-[11px] text-[#18181B]">
                <strong>Action :</strong> {p.action}
              </p>
              <p className="mt-1 text-[10px] italic text-[#71717A]">
                Impact attendu : {p.impact_attendu}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ANALYSE DE MARCHÉ */}
      {strategy.analyse_marche && (
        <Section title="🌍 Analyse de marché">
          <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#475569]">
            {strategy.analyse_marche}
          </p>
        </Section>
      )}

      {/* CIBLAGE EXACT */}
      {strategy.ciblage_exact && (
        <Section title="🎯 Ciblage exact" icon={<Target className="h-3.5 w-3.5" />}>
          <Field label="Villes" value={strategy.ciblage_exact.villes.join(", ")} />
          <Field label="Âges" value={strategy.ciblage_exact.ages} />
          <ListField label="Intérêts" items={strategy.ciblage_exact.interets} />
          <ListField label="Comportements" items={strategy.ciblage_exact.comportements} />
        </Section>
      )}

      {/* ANALYSE CONCURRENTIELLE (Premium+) */}
      {"analyse_concurrentielle" in strategy && strategy.analyse_concurrentielle && (
        <Section title="⚔️ Analyse concurrentielle">
          <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#475569]">
            {strategy.analyse_concurrentielle}
          </p>
        </Section>
      )}

      {/* HOOKS (Premium+) */}
      {"hooks" in strategy && strategy.hooks && strategy.hooks.length > 0 && (
        <Section title="🪝 Hooks publicitaires">
          <div className="space-y-2">
            {strategy.hooks.map((hook, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-[#F8F8FC] p-3"
              >
                <p className="text-[11px] italic text-[#18181B]">
                  &laquo; {hook} &raquo;
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ANALYSE AUDIENCE (Premium+) */}
      {"analyse_audience" in strategy && strategy.analyse_audience && (
        <Section title="👥 Analyse d'audience">
          <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#475569]">
            {strategy.analyse_audience}
          </p>
        </Section>
      )}

      {/* SCRIPTS WHATSAPP */}
      {strategy.scripts_whatsapp && strategy.scripts_whatsapp.length > 0 && (
        <Section title="💬 Scripts WhatsApp" icon={<Check className="h-3.5 w-3.5" />}>
          <div className="space-y-2">
            {strategy.scripts_whatsapp.map((script, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-[#F8F8FC] p-3"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A] mb-1">
                  Script {i + 1}
                </p>
                <p className="whitespace-pre-wrap text-[11px] text-[#18181B] leading-relaxed">
                  {script}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* BUDGET */}
      {strategy.budget && (
        <Section title="💰 Budget" icon={<Wallet className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Budget total"
              value={`${budgetTotal.toLocaleString("fr-FR")} ${devise}`}
            />
            <StatCard
              label="CPC estimé"
              value={`${cpcEstime.toLocaleString("fr-FR")} ${devise}`}
            />
            <StatCard label="Ventes visées" value={`${strategy.budget.ventes_estimees}`} />
            <StatCard label="ROAS" value={`${strategy.budget.roas_estime}x`} />
          </div>

          {strategy.budget.repartition && strategy.budget.repartition.length > 0 && (
            <div className="mt-3 space-y-2">
              {strategy.budget.repartition.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2"
                >
                  <span className="text-[11px] text-[#475569]">{r.poste}</span>
                  <span className="text-[11px] font-semibold text-[#18181B]">
                    {r.pourcentage}% — {r.montant.toLocaleString("fr-FR")} {devise}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* ALLOCATION BUDGÉTAIRE (texte libre) */}
      {strategy.allocation_budget && (
        <Section title="📊 Allocation budgétaire">
          <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#475569]">
            {strategy.allocation_budget}
          </p>
        </Section>
      )}

      {/* KPIS */}
      {strategy.kpis && strategy.kpis.length > 0 && (
        <Section title="📊 KPIs à suivre">
          <div className="space-y-2">
            {strategy.kpis.map((kpi, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-[#F8F8FC] p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#18181B]">{kpi.nom}</p>
                  <span className="rounded-full bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-bold text-[#6366F1]">
                    {kpi.objectif}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#475569]">{kpi.pourquoi}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* PLAN D'ACTION */}
      {strategy.action_plan && (
        <Section title="🗓️ Plan d'action">
          <div className="space-y-3">
            {[strategy.action_plan.phase_1, strategy.action_plan.phase_2, strategy.action_plan.phase_3].map(
              (phase, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-white p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-xs font-bold text-[#18181B]">{phase.titre}</p>
                    <span className="text-[10px] text-[#71717A]">{phase.duree}</span>
                  </div>
                  <ul className="space-y-1">
                    {phase.actions.map((action, j) => (
                      <li key={j} className="flex items-start gap-2 text-[11px] text-[#475569]">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </Section>
      )}

      {/* CONSEIL EXPERT */}
      {strategy.conseil_expert && (
        <Section title="💡 Conseil d'expert">
          <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#475569]">
            {strategy.conseil_expert}
          </p>
        </Section>
      )}

      {/* GUIDE CRÉATIF */}
      {strategy.guide_creatif && (
        <Section title="🎨 Guide créatif">
          <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#475569]">
            {strategy.guide_creatif}
          </p>
        </Section>
      )}

      {/* RECOMMANDATIONS PLATEFORME */}
      {strategy.recommandations_plateforme && (
        <Section title="📱 Recommandations plateforme">
          <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#475569]">
            {strategy.recommandations_plateforme}
          </p>
        </Section>
      )}

      {/* CHAMPS ÉLITE */}
      {"consulting_strategique" in strategy && strategy.consulting_strategique && (
        <Section title="👑 Consulting stratégique">
          <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#475569]">
            {strategy.consulting_strategique}
          </p>
        </Section>
      )}

      {"formation_personnalisee" in strategy && strategy.formation_personnalisee && (
        <Section title="🎓 Formation personnalisée">
          <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#475569]">
            {strategy.formation_personnalisee}
          </p>
        </Section>
      )}

      {/* AVERTISSEMENTS */}
      {strategy.avertissements && strategy.avertissements.length > 0 && (
        <Section title="⚠️ Avertissements">
          <div className="space-y-2">
            {strategy.avertissements.map((w, i) => (
              <div
                key={i}
                className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="text-[11px] text-amber-900">{w}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </motion.div>
  );
}

// ─────────────── SUB-COMPONENTS ───────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        {icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
            {icon}
          </div>
        )}
        <h3 className="text-sm font-bold text-[#18181B]">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
        {label}
      </p>
      <p className="mt-0.5 text-[12px] text-[#18181B]">{value}</p>
    </div>
  );
}

function ListField({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A] mb-1.5">
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px] text-[#18181B]">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 text-center">
      <p className="text-[9px] uppercase tracking-wider text-[#71717A]">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-[#6366F1] break-words">{value}</p>
    </div>
  );
}