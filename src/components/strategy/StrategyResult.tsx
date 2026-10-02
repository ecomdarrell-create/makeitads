'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface StrategyResultProps {
  strategy: any;
  strategyType: 'flash' | 'complete';
}

export function StrategyResult({ strategy, strategyType }: StrategyResultProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);
  const [copiedItems, setCopiedItems] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const copyToClipboard = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => [...prev, itemId]);
    setTimeout(() => setCopiedItems(prev => prev.filter(id => id !== itemId)), 2000);
  };

  const calculateReadinessScore = () => {
    let score = 60;
    const data = strategy.data || strategy;
    if (data.diagnostic || data.analyse_marche) score += 10;
    if (data.avatar_client || data.ciblage_exact) score += 10;
    if (data.scripts_whatsapp && data.scripts_whatsapp.length >= 3) score += 10;
    if (data.allocation_budget) score += 5;
    if (data.conseil_expert) score += 5;
    return Math.min(score, 100);
  };

  const readinessScore = calculateReadinessScore();
  const data = strategy.data || strategy;

  const CopyBtn = ({ text, itemId }: { text: string; itemId: string }) => {
    const isCopied = copiedItems.includes(itemId);
    return (
      <button
        onClick={() => copyToClipboard(text, itemId)}
        className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:border-[#6366F1] transition-all"
      >
        {isCopied ? <><Check className="w-3 h-3 text-green-600" /> Copié</> : <><Copy className="w-3 h-3" /> Copier</>}
      </button>
    );
  };

  const Accordion = ({ id, title, icon, children, copyText, highlight = false }: any) => {
    const isExpanded = expandedSections.includes(id);
    return (
      <div className={`rounded-lg border overflow-hidden transition-all ${highlight ? 'bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-200' : 'bg-white border-gray-200'}`}>
        <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm">{icon}</span>
            <h3 className="text-xs sm:text-sm font-semibold text-[#111827]">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {copyText && <div onClick={(e) => e.stopPropagation()}><CopyBtn text={copyText} itemId={id} /></div>}
            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>
        {isExpanded && <div className="px-3 sm:px-4 pb-4 pt-0"><div className="text-xs sm:text-sm text-gray-700 leading-relaxed">{children}</div></div>}
      </div>
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Score */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6366F1]" />
            <h3 className="text-xs sm:text-sm font-semibold text-[#111827]">Strategy Readiness</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm sm:text-base font-bold ${readinessScore >= 80 ? 'text-green-600' : readinessScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
              {readinessScore}
            </span>
            <span className="text-[10px] text-gray-500">/100</span>
          </div>
        </div>
        <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${readinessScore >= 80 ? 'bg-green-500' : readinessScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${readinessScore}%` }}></div>
        </div>
        <p className="text-[10px] text-gray-600 mt-2">
          {readinessScore >= 80 ? 'Votre stratégie est complète et prête à être implémentée.' : readinessScore >= 60 ? 'Votre stratégie est bonne mais peut être améliorée.' : 'Votre stratégie nécessite des compléments pour être efficace.'}
        </p>
      </div>

      {/* Sections Flash */}
      {strategyType === 'flash' ? (
        <>
          <Accordion id="overview" title="Diagnostic" icon="🎯" copyText={data.diagnostic}>{data.diagnostic}</Accordion>
          <Accordion id="avatar" title="Avatar client idéal" icon="👤" copyText={data.avatar_client}>{data.avatar_client}</Accordion>
          <Accordion id="angle" title="Angle publicitaire" icon="💡" copyText={data.angle_publicitaire}>{data.angle_publicitaire}</Accordion>
          {data.makeitads_teaser && (
            <Accordion id="teaser" title="Contenu Premium" icon="🔒" highlight>
              <p className="mb-3">{data.makeitads_teaser}</p>
              <button className="px-3 py-1.5 text-xs font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#5558e6] transition-colors">Débloquer avec le Plan Pro</button>
            </Accordion>
          )}
        </>
      ) : (
        <>
          <Accordion id="overview" title="Analyse du marché" icon="📊" copyText={data.analyse_marche}>{data.analyse_marche}</Accordion>
          {data.ciblage_exact && (
            <Accordion id="targeting" title="Ciblage exact" icon="🎯">
              <div className="space-y-2">
                <div><span className="text-[10px] font-medium text-gray-600">Villes :</span><p className="text-xs text-gray-700">{data.ciblage_exact.villes?.join(', ')}</p></div>
                <div><span className="text-[10px] font-medium text-gray-600">Âges :</span><p className="text-xs text-gray-700">{data.ciblage_exact.ages}</p></div>
                <div><span className="text-[10px] font-medium text-gray-600">Intérêts :</span><p className="text-xs text-gray-700">{data.ciblage_exact.interets?.join(', ')}</p></div>
                <div><span className="text-[10px] font-medium text-gray-600">Comportements :</span><p className="text-xs text-gray-700">{data.ciblage_exact.comportements?.join(', ')}</p></div>
              </div>
            </Accordion>
          )}
          {data.scripts_whatsapp && (
            <Accordion id="scripts" title="Scripts WhatsApp" icon="💬">
              <div className="space-y-2.5">
                {data.scripts_whatsapp.map((script: string, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-medium text-gray-700">Script {index + 1}</span>
                      <CopyBtn text={script} itemId={`script-${index}`} />
                    </div>
                    <p className="text-xs text-gray-600 whitespace-pre-wrap">{script}</p>
                  </div>
                ))}
              </div>
            </Accordion>
          )}
          {data.allocation_budget && <Accordion id="budget" title="Allocation budgétaire" icon="💰" copyText={data.allocation_budget}>{data.allocation_budget}</Accordion>}
          {data.conseil_expert && <Accordion id="expert" title="Conseil expert" icon="⭐" copyText={data.conseil_expert} highlight>{data.conseil_expert}</Accordion>}
        </>
      )}

      {/* Actions supplémentaires */}
      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm font-semibold text-[#111827] mb-1.5">🚀 Actions supplémentaires</h3>
        <p className="text-[10px] text-gray-700 mb-3">Améliorez votre stratégie avec ces fonctionnalités avancées.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 hover:border-[#6366F1] transition-colors">
            <span className="text-[10px] font-medium text-gray-700">Générer 3 variantes de hooks</span>
            <span className="text-[9px] text-[#6366F1] font-semibold">1 crédit</span>
          </button>
          <button className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 hover:border-[#6366F1] transition-colors">
            <span className="text-[10px] font-medium text-gray-700">Analyse concurrentielle</span>
            <span className="text-[9px] text-[#6366F1] font-semibold">3 crédits</span>
          </button>
        </div>
      </div>
    </div>
  );
}