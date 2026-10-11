'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import {
  getSectionsForStrategy,
  isSectionLocked,
  PLAN_LABELS,
  type PlanTier,
  type SectionConfig,
} from '@/config/strategy-sections.config';
import { InsightsSection } from './InsightsSection';
import { PrioritiesSection } from './PrioritiesSection';
import { ActionPlanSection } from './ActionPlanSection';
import { UpgradeModal } from './UpgradeModal';

// ============================================
// TYPES
// ============================================

interface StrategyResultProps {
  strategy: any;
  strategyType: 'flash' | 'complete';
  userPlan: PlanTier;
}

// ============================================
// RENDERER DE TEXTE RICHE
// ============================================

function renderRichText(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);

    return (
      <span key={lineIdx}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-semibold text-[#18181B]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={i}>{part}</span>;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ============================================
// GAUGE CIRCULAIRE — calibrée mobile
// ============================================

interface CircularGaugeProps {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
  color: string;
  unit?: string;
}

function CircularGauge({
  value,
  max = 100,
  label,
  sublabel,
  color,
  unit,
}: CircularGaugeProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(value / max, 0), 1);
  const dash = circumference * pct;
  const gap = circumference - dash;

  return (
    <div className="flex flex-1 flex-col items-center">
      {/* ✅ Anneau plus petit sur mobile : 72px → 96px desktop */}
      <div className="relative h-[72px] w-[72px] sm:h-24 sm:w-24">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="9"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            style={{ transition: 'stroke-dasharray 0.9s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* ✅ Chiffre plus petit sur mobile : 14px → 20px desktop */}
          <span className="text-base font-bold leading-none text-[#18181B] sm:text-xl">
            {value}
          </span>
          <span className="mt-0.5 text-[8px] font-medium text-slate-500 sm:text-[10px]">
            {unit || `/ ${max}`}
          </span>
        </div>
      </div>
      <p className="mt-2.5 text-[11px] font-semibold text-[#18181B] sm:mt-3 sm:text-xs">
        {label}
      </p>
      {sublabel && (
        <p className="mt-0.5 text-center text-[9px] leading-tight text-slate-500 sm:text-[11px]">
          {sublabel}
        </p>
      )}
    </div>
  );
}

// ============================================
// COULEURS DYNAMIQUES
// ============================================

function getPreparationColor(score: number): string {
  if (score >= 75) return '#10B981';
  if (score >= 50) return '#F59E0B';
  if (score >= 25) return '#F97316';
  return '#EF4444';
}

function getOpportunityData(level: string): { value: number; color: string; label: string } {
  const normalized = (level || '').toLowerCase().trim();
  if (normalized.includes('élev') || normalized.includes('elev')) {
    return { value: 100, color: '#10B981', label: 'Élevée' };
  }
  if (normalized.includes('moyen')) {
    return { value: 60, color: '#F59E0B', label: 'Moyenne' };
  }
  if (normalized.includes('faible')) {
    return { value: 30, color: '#EF4444', label: 'Faible' };
  }
  return { value: 50, color: '#64748B', label: level || '—' };
}

// ============================================
// EXECUTIVE SUMMARY (avec anneaux) — calibré mobile
// ============================================

interface ExecutiveSummaryData {
  synthese?: string;
  preparation?: number;
  opportunite?: string;
  risque_principal?: string;
  priorite?: string;
}

function ExecutiveSummary({ summary }: { summary: ExecutiveSummaryData }) {
  const preparation = Math.round(summary?.preparation ?? 0);
  const preparationColor = getPreparationColor(preparation);
  const opportunity = getOpportunityData(summary?.opportunite || '');

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Synthèse */}
      {summary?.synthese && (
        <div className="rounded-xl border border-[#6366F1]/20 bg-gradient-to-br from-indigo-50/40 to-white p-3.5 sm:p-5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6366F1]">
            Résumé exécutif
          </p>
          <h3 className="mb-2.5 text-[13px] font-bold text-[#18181B] sm:mb-3 sm:text-base">
            Votre stratégie en un coup d&apos;œil
          </h3>
          <p className="text-[12px] leading-relaxed text-slate-700 sm:text-sm">
            {renderRichText(summary.synthese)}
          </p>
        </div>
      )}

      {/* Anneaux — Préparation + Opportunité */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-5">
        <div className="flex items-start justify-around gap-3 sm:gap-8">
          <CircularGauge
            value={preparation}
            max={100}
            label="Préparation"
            sublabel="Maturité"
            color={preparationColor}
            unit="/ 100"
          />
          <CircularGauge
            value={opportunity.value}
            max={100}
            label="Opportunité"
            sublabel={opportunity.label}
            color={opportunity.color}
            unit={opportunity.label}
          />
        </div>
      </div>

      {/* Risque principal */}
      {summary?.risque_principal && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 sm:p-4">
          <div className="mb-1.5 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
              Risque principal
            </p>
          </div>
          <p className="text-[12px] leading-relaxed text-amber-900 sm:text-sm">
            {renderRichText(summary.risque_principal)}
          </p>
        </div>
      )}

      {/* Priorité immédiate */}
      {summary?.priorite && (
        <div className="rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/5 p-3.5 sm:p-4">
          <div className="mb-1.5 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#6366F1]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6366F1]">
              Priorité immédiate
            </p>
          </div>
          <p className="text-[12px] leading-relaxed text-[#18181B] sm:text-sm">
            {renderRichText(summary.priorite)}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export function StrategyResult({
  strategy,
  strategyType,
  userPlan,
}: StrategyResultProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [copiedItems, setCopiedItems] = useState<string[]>([]);
  const [upgradeModal, setUpgradeModal] = useState<{
    isOpen: boolean;
    targetPlan: PlanTier;
    sectionTitle?: string;
  }>({ isOpen: false, targetPlan: 'pro' });

  const data = strategy.data || strategy;
  const sections = getSectionsForStrategy(strategyType);

  const availableSections = sections.filter(
    (s) => !isSectionLocked(userPlan, s) && data[s.id] !== undefined
  );
  const lockedSections = sections.filter((s) => isSectionLocked(userPlan, s));

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const copyToClipboard = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems((prev) => [...prev, itemId]);
    setTimeout(
      () => setCopiedItems((prev) => prev.filter((id) => id !== itemId)),
      2000
    );
  };

  const readinessScore = data.executive_summary?.preparation ?? 50;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* ─── SALUTATION ─── */}
      {data.salutation && (
        <div className="rounded-xl border border-[#6366F1]/20 bg-gradient-to-br from-indigo-50/60 to-white p-3.5 sm:p-5">
          <p className="text-[13px] font-medium leading-relaxed text-[#18181B] sm:text-base">
            {renderRichText(data.salutation)}
          </p>
        </div>
      )}

      {/* ─── EXECUTIVE SUMMARY ─── */}
      {data.executive_summary && (
        <ExecutiveSummary summary={data.executive_summary} />
      )}

      {/* Fallback */}
      {!data.executive_summary && (
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#6366F1]" />
              <h3 className="text-[13px] font-semibold text-[#18181B] sm:text-sm">
                Niveau de préparation
              </h3>
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <CircularGauge
              value={readinessScore}
              max={100}
              label="Préparation"
              color={getPreparationColor(readinessScore)}
              unit="/ 100"
            />
          </div>
        </div>
      )}

      {/* ─── INSIGHTS ─── */}
      {data.insights && <InsightsSection insights={data.insights} />}

      {/* ─── PRIORITÉS ─── */}
      {data.priorities && <PrioritiesSection priorities={data.priorities} />}

      {/* ─── PLAN D'ACTION ─── */}
      {data.action_plan && <ActionPlanSection plan={data.action_plan} />}

      {/* ─── SECTIONS DÉTAILLÉES ─── */}
      {availableSections
        .filter(
          (s) =>
            ![
              'executive_summary',
              'insights',
              'priorities',
              'action_plan',
              'salutation',
            ].includes(s.id)
        )
        .map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            userPlan={userPlan}
            data={data}
            isExpanded={expandedSections.includes(section.id)}
            onToggle={() => toggleSection(section.id)}
            copiedItems={copiedItems}
            onCopy={copyToClipboard}
          />
        ))}

      {/* ─── SECTIONS VERROUILLÉES ─── */}
      {lockedSections.length > 0 && (
        <>
          <div className="relative flex items-center gap-3 pt-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Sections avancées
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            Ces sections sont disponibles dans les plans supérieurs. Débloquez-les
            pour étendre votre stratégie.
          </p>

          {lockedSections.map((section) => (
            <LockedSection
              key={section.id}
              section={section}
              onUpgradeClick={(targetPlan, sectionTitle) =>
                setUpgradeModal({ isOpen: true, targetPlan, sectionTitle })
              }
            />
          ))}
        </>
      )}

      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ ...upgradeModal, isOpen: false })}
        targetPlan={upgradeModal.targetPlan}
        sectionTitle={upgradeModal.sectionTitle}
      />
    </div>
  );
}

// ============================================
// RENDERER DE SECTION
// ============================================

interface SectionRendererProps {
  section: SectionConfig;
  userPlan: PlanTier;
  data: any;
  isExpanded: boolean;
  onToggle: () => void;
  copiedItems: string[];
  onCopy: (text: string, itemId: string) => void;
}

function SectionRenderer({
  section,
  userPlan,
  data,
  isExpanded,
  onToggle,
  copiedItems,
  onCopy,
}: SectionRendererProps) {
  const Icon = section.icon;
  const hasContent = data[section.id] !== undefined && data[section.id] !== null;
  const content = data[section.id];

  if (!hasContent) {
    return <EmptySection section={section} />;
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border transition-all ${
        section.minPlan === 'enterprise' && userPlan === 'enterprise'
          ? 'border-[#6366F1]/20 bg-gradient-to-br from-indigo-50/40 to-white'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="flex w-full cursor-pointer items-center justify-between p-3.5 transition-colors hover:bg-slate-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-inset sm:p-4"
      >
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1] sm:h-8 sm:w-8">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <h3 className="truncate text-[12px] font-semibold text-[#18181B] sm:text-sm">
            {section.title}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {typeof content === 'string' && (
            <CopyButton
              text={content}
              itemId={section.id}
              copiedItems={copiedItems}
              onCopy={onCopy}
            />
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-100 px-3.5 pb-3.5 pt-3.5 sm:px-4 sm:pb-4 sm:pt-4">
          <SectionContent
            section={section}
            content={content}
            copiedItems={copiedItems}
            onCopy={onCopy}
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// CONTENU DE SECTION
// ============================================

function SectionContent({
  section,
  content,
  copiedItems,
  onCopy,
}: {
  section: SectionConfig;
  content: any;
  copiedItems: string[];
  onCopy: (text: string, itemId: string) => void;
}) {
  if (section.id === 'ciblage_exact' && typeof content === 'object') {
    return (
      <div className="space-y-3">
        <StructuredField label="Villes" values={content.villes} />
        <StructuredField label="Âges" values={[content.ages]} />
        <StructuredField label="Intérêts" values={content.interets} />
        <StructuredField label="Comportements" values={content.comportements} />
      </div>
    );
  }

  if (section.id === 'kpis' && Array.isArray(content)) {
    return (
      <div className="space-y-2">
        {content.map((kpi: any, i: number) => (
          <div
            key={i}
            className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 sm:p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#18181B] sm:text-xs">
                {kpi.nom}
              </span>
              <span className="rounded-full bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-semibold text-[#6366F1]">
                {kpi.objectif}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
              {renderRichText(kpi.pourquoi)}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (
    (section.id === 'scripts_whatsapp' || section.id === 'hooks') &&
    Array.isArray(content)
  ) {
    return (
      <div className="space-y-2.5 sm:space-y-3">
        {content.map((item: string, i: number) => (
          <div
            key={i}
            className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 sm:p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {section.id === 'hooks' ? `Variante ${i + 1}` : `Script ${i + 1}`}
              </span>
              <CopyButton
                text={item}
                itemId={`${section.id}-${i}`}
                copiedItems={copiedItems}
                onCopy={onCopy}
                compact
              />
            </div>
            <div className="text-[11px] leading-relaxed text-[#18181B] sm:text-xs">
              {renderRichText(item)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (typeof content === 'string') {
    return (
      <div className="text-[12px] leading-relaxed text-slate-700 sm:text-sm">
        {renderRichText(content)}
      </div>
    );
  }

  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}

// ============================================
// SOUS-COMPOSANTS
// ============================================

function CopyButton({
  text,
  itemId,
  copiedItems,
  onCopy,
  compact = false,
}: {
  text: string;
  itemId: string;
  copiedItems: string[];
  onCopy: (text: string, itemId: string) => void;
  compact?: boolean;
}) {
  const isCopied = copiedItems.includes(itemId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onCopy(text, itemId);
      }}
      className={`inline-flex items-center gap-1 rounded border border-slate-200 bg-white font-medium text-slate-600 transition-colors hover:border-[#6366F1] hover:text-[#6366F1] ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[10px] sm:text-[11px]'
      }`}
    >
      {isCopied ? (
        <>
          <Check className="h-3 w-3 text-emerald-600" />
          <span className="text-emerald-600">Copié</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copier
        </>
      )}
    </button>
  );
}

function StructuredField({
  label,
  values,
}: {
  label: string;
  values?: string[];
}) {
  if (!values || values.length === 0) return null;
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="text-[12px] leading-relaxed text-[#18181B] sm:text-xs">
        {values.join(', ')}
      </p>
    </div>
  );
}

function LockedSection({
  section,
  onUpgradeClick,
}: {
  section: SectionConfig;
  onUpgradeClick: (targetPlan: PlanTier, sectionTitle: string) => void;
}) {
  const Icon = section.icon;
  const requiredLabel = PLAN_LABELS[section.minPlan];

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 p-3.5 sm:p-4">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 sm:h-8 sm:w-8">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <h3 className="truncate text-[12px] font-semibold text-slate-500 sm:text-sm">
            {section.title}
          </h3>
        </div>
        <Lock className="h-4 w-4 shrink-0 text-slate-400" />
      </div>

      <div className="relative p-3.5 sm:p-4">
        <div
          className="select-none text-[11px] leading-relaxed text-slate-500 blur-[3px] sm:text-sm"
          aria-hidden
        >
          {section.previewText}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
          <div className="px-3 text-center sm:px-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Section verrouillée
            </p>
            <p className="mb-2.5 text-[12px] font-semibold text-[#18181B] sm:mb-3 sm:text-sm">
              Disponible avec le plan {requiredLabel}
            </p>
            <button
              type="button"
              onClick={() => onUpgradeClick(section.minPlan, section.title)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#6366F1] px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-[#6366F1]/20 transition-colors hover:bg-[#5558e6] sm:px-4 sm:py-2 sm:text-xs"
            >
              Plan {requiredLabel}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptySection({ section }: { section: SectionConfig }) {
  const Icon = section.icon;
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-3.5 sm:p-4">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 sm:h-8 sm:w-8">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[12px] font-semibold text-slate-500 sm:text-sm">
            {section.title}
          </h3>
          <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[11px]">
            Section non générée pour cette stratégie.
          </p>
        </div>
      </div>
    </div>
  );
}