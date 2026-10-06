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
} from 'lucide-react';
import {
  getSectionsForStrategy,
  isSectionLocked,
  PLAN_LABELS,
  type PlanTier,
  type SectionConfig,
} from '@/config/strategy-sections.config';
import { ExecutiveSummary } from './ExecutiveSummary';
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
    <div className="space-y-4">
      {/* ─── EXECUTIVE SUMMARY ─── */}
      {data.executive_summary && (
        <ExecutiveSummary summary={data.executive_summary} />
      )}

      {/* Fallback : score simple si pas de summary */}
      {!data.executive_summary && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#6366F1]" />
              <h3 className="text-sm font-semibold text-[#18181B]">
                Niveau de préparation stratégique
              </h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-slate-600">
                {readinessScore}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-400 transition-all duration-700"
              style={{ width: `${readinessScore}%` }}
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

      {/* ─── SÉPARATEUR + SECTIONS VERROUILLÉES ─── */}
      {lockedSections.length > 0 && (
        <>
          <div className="relative flex items-center gap-3 pt-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Sections avancées
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            Ces sections sont disponibles dans les plans supérieurs. Débloquez-les
            pour étendre votre stratégie et accélérer votre croissance.
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

      {/* ─── MODAL UPGRADE ─── */}
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
// RENDERER DE SECTION DÉBLOQUÉE
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
        className="flex w-full cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-inset"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold text-[#18181B]">
            {section.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
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
        <div className="border-t border-slate-100 px-4 pb-4 pt-4">
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
            className="rounded-lg border border-slate-100 bg-slate-50/60 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#18181B]">
                {kpi.nom}
              </span>
              <span className="rounded-full bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-semibold text-[#6366F1]">
                {kpi.objectif}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
              {kpi.pourquoi}
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
      <div className="space-y-3">
        {content.map((item: string, i: number) => (
          <div
            key={i}
            className="rounded-lg border border-slate-100 bg-slate-50/60 p-3"
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
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-[#18181B]">
              {item}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (typeof content === 'string') {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {content}
      </p>
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
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]'
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
      <p className="text-xs leading-relaxed text-[#18181B]">
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
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-500">
            {section.title}
          </h3>
        </div>
        <Lock className="h-4 w-4 text-slate-400" />
      </div>

      <div className="relative p-4">
        <div
          className="select-none text-sm leading-relaxed text-slate-500 blur-[3px]"
          aria-hidden
        >
          {section.previewText}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
          <div className="px-4 text-center">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Section verrouillée
            </p>
            <p className="mb-3 text-sm font-semibold text-[#18181B]">
              Disponible avec le plan {requiredLabel}
            </p>
            <button
              type="button"
              onClick={() => onUpgradeClick(section.minPlan, section.title)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-[#6366F1]/20 transition-colors hover:bg-[#5558e6]"
            >
              Passer au plan {requiredLabel}
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
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-500">
            {section.title}
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Cette section n&apos;a pas été générée pour cette stratégie.
          </p>
        </div>
      </div>
    </div>
  );
}