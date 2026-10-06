"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle, TrendingUp, Target, Wallet } from "lucide-react";
import type { Strategy } from "@/lib/prompts";

type Props = {
  strategy: Strategy;
};

export default function StrategyResult({ strategy }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* RÉSUMÉ */}
      <div className="rounded-[20px] border border-[#6366F1]/20 bg-[#6366F1]/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1] text-white">
            <Target className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-bold text-[#18181B]">Résumé stratégique</h3>
        </div>
        <p className="text-[13px] leading-relaxed text-[#475569]">
          {strategy.resume}
        </p>
      </div>

      {/* CIBLAGE */}
      <Section title="🎯 Ciblage" icon={<Target className="h-3.5 w-3.5" />}>
        <Field label="Audience" value={strategy.ciblage.audience} />
        <Field label="Démographie" value={strategy.ciblage.demographie} />
        <Field label="Zone géographique" value={strategy.ciblage.zone_geographique} />
        <ListField label="Intérêts" items={strategy.ciblage.interets} />
        <ListField label="À exclure" items={strategy.ciblage.exclusions} />
      </Section>

      {/* ANGLES MARKETING */}
      <Section title="💡 Angles marketing" icon={<TrendingUp className="h-3.5 w-3.5" />}>
        <div className="space-y-3">
          {strategy.angles_marketing.map((angle, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-[#F8F8FC] p-3">
              <p className="text-xs font-bold text-[#18181B]">
                {i + 1}. {angle.titre}
              </p>
              <p className="mt-1 text-[11px] text-[#475569]">{angle.description}</p>
              <div className="mt-2 rounded-lg bg-white p-2 border border-gray-100">
                <p className="text-[9px] uppercase tracking-wider text-[#71717A] mb-1">
                  Exemple d&apos;accroche
                </p>
                <p className="text-[11px] italic text-[#18181B]">
                  &laquo; {angle.exemple_accroche} &raquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* SCRIPTS WHATSAPP */}
      <Section title="💬 Scripts WhatsApp" icon={<Check className="h-3.5 w-3.5" />}>
        <MessageField label="Accroche" value={strategy.scripts_whatsapp.accroche} />
        <MessageField label="Qualification" value={strategy.scripts_whatsapp.qualification} />
        <MessageField label="Présentation de l'offre" value={strategy.scripts_whatsapp.presentation_offre} />
        <ListField label="Gestion des objections" items={strategy.scripts_whatsapp.gestion_objections} />
        <MessageField label="Closing" value={strategy.scripts_whatsapp.closing} />
        <MessageField label="Relance J+1" value={strategy.scripts_whatsapp.relance_j1} />
        <MessageField label="Relance J+3" value={strategy.scripts_whatsapp.relance_j3} />
        <MessageField label="Relance J+7" value={strategy.scripts_whatsapp.relance_j7} />
      </Section>

      {/* BUDGET */}
      <Section title="💰 Budget" icon={<Wallet className="h-3.5 w-3.5" />}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Budget" value={`${strategy.budget.montant_total_fcfa.toLocaleString("fr-FR")} F`} />
          <StatCard label="CPC estimé" value={`${strategy.budget.cpc_estime_fcfa} F`} />
          <StatCard label="Ventes visées" value={`${strategy.budget.ventes_estimees}`} />
          <StatCard label="ROAS" value={`${strategy.budget.roas_estime}x`} />
        </div>
        <div className="mt-3 space-y-2">
          {strategy.budget.repartition.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2">
              <span className="text-[11px] text-[#475569]">{r.poste}</span>
              <span className="text-[11px] font-semibold text-[#18181B]">
                {r.pourcentage}% — {r.montant_fcfa.toLocaleString("fr-FR")} F
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* KPIS */}
      <Section title="📊 KPIs à suivre">
        <div className="space-y-2">
          {strategy.kpis.map((kpi, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-[#F8F8FC] p-3">
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

      {/* PLAN D'ACTION */}
      <Section title="🗓️ Plan d'action sur 7 jours">
        <div className="space-y-2">
          {strategy.plan_action.map((step, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6366F1] text-[10px] font-bold text-white">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-bold text-[#18181B]">{step.jour}</p>
                  <span className="text-[10px] text-[#71717A]">{step.duree}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-[#475569]">{step.action}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* AVERTISSEMENTS */}
      {strategy.avertissements.length > 0 && (
        <Section title="⚠️ Avertissements">
          <div className="space-y-2">
            {strategy.avertissements.map((w, i) => (
              <div key={i} className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
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

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
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
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">{label}</p>
      <p className="mt-0.5 text-[12px] text-[#18181B]">{value}</p>
    </div>
  );
}

function ListField({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A] mb-1.5">{label}</p>
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

function MessageField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-[#F8F8FC] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A] mb-1">{label}</p>
      <p className="whitespace-pre-wrap text-[11px] text-[#18181B] leading-relaxed">{value}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 text-center">
      <p className="text-[9px] uppercase tracking-wider text-[#71717A]">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-[#6366F1]">{value}</p>
    </div>
  );
}