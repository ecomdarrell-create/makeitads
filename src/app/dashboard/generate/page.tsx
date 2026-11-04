'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wallet, AlertTriangle, AlertCircle, ArrowRight, RotateCcw, Loader2, Lock, Crown, CheckCircle2, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FormData, initialFormData } from '@/components/generate/types';
import { WizardProgress } from '@/components/generate/WizardProgress';
import { PlanId, normalizePlanId, PRICING_CONFIG, CREDIT_COSTS } from '@/config/pricing.config';
import { Step1Company } from '@/components/generate/steps/Step1Company';
import { Step2Offer } from '@/components/generate/steps/Step2Offer';
import { Step3Audience } from '@/components/generate/steps/Step3Audience';
import { Step4Market } from '@/components/generate/steps/Step4Market';
import { Step5Objective } from '@/components/generate/steps/Step5Objective';
import { Step6Campaign } from '@/components/generate/steps/Step6Campaign';
import { Step7Creative } from '@/components/generate/steps/Step7Creative';
import { Step8Context } from '@/components/generate/steps/Step8Context';
import { Summary } from '@/components/generate/Summary';
import { LoadingGeneration } from '@/components/generate/LoadingGeneration';
import { PreGenerationModal } from '@/components/generate/PreGenerationModal';
import { BackButton } from '@/components/ui/BackButton';

const DRAFT_KEY = 'makeitads_draft';
const FIRST_GEN_KEY = 'makeitads_first_generation_seen';

export default function GeneratePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showSummary, setShowSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showServiceError, setShowServiceError] = useState(false);

  const [creditsBalance, setCreditsBalance] = useState<number | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanId>('free');
  const [strategyType, setStrategyType] = useState<'flash' | 'complete'>('flash');
  const [supabaseError, setSupabaseError] = useState('');
  const [hasDraft, setHasDraft] = useState(false);
  const [refreshingCredits, setRefreshingCredits] = useState(false);
  const [currency, setCurrency] = useState<string>('XOF');
  const [showPreGeneration, setShowPreGeneration] = useState(false);

  const isFirstRender = useRef(true);
  const totalSteps = 8;
  const isFree = currentPlan === 'free';

  const generationCost = strategyType === 'complete' ? CREDIT_COSTS.STRATEGIE_COMPLETE : CREDIT_COSTS.DIAGNOSTIC_FLASH;
  const planCreditsCap = PRICING_CONFIG[currentPlan]?.monthlyCredits || 10;
  const creditsLoaded = creditsBalance !== null;
  const safeBalance = creditsBalance ?? 0;
  const creditsPercent = planCreditsCap > 0 ? Math.min(100, Math.round((safeBalance / planCreditsCap) * 100)) : 0;

  const alertLevel: 'normal' | 'attention' | 'critical' | 'exhausted' =
    safeBalance === 0 ? 'exhausted' : creditsPercent < 20 ? 'critical' : creditsPercent < 50 ? 'attention' : 'normal';

  const badgeStyle = {
    normal: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    attention: 'border-amber-200 bg-amber-50 text-amber-700',
    critical: 'border-red-200 bg-red-50 text-red-700',
    exhausted: 'border-red-300 bg-red-100 text-red-800',
  }[alertLevel];

  const loadCreditsBalance = async () => {
    setRefreshingCredits(true);
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error(`Authentification Supabase: ${authError.message}`);
      if (!user) { setSupabaseError('Aucune session utilisateur active. Reconnectez-vous.'); return; }

      const { data: profile, error: profileError } = await supabase.from('profiles').select('credits_balance, plan, currency').eq('id', user.id).maybeSingle();
      if (profileError) { setSupabaseError(`Lecture du profil impossible: ${profileError.message}`); return; }
      if (!profile) { await fetch('/api/profile/bootstrap', { method: 'POST' }); await loadCreditsBalance(); return; }

      const normalizedPlan = normalizePlanId(profile.plan);
      setCreditsBalance(profile.credits_balance ?? 0);
      setCurrentPlan(normalizedPlan);
      setSupabaseError('');
      if (profile.currency) setCurrency(profile.currency);

      if (normalizedPlan !== 'free') {
        setStrategyType('complete');
      } else {
        const requestedType = new URLSearchParams(window.location.search).get('type');
        if (requestedType === 'complete' || requestedType === 'flash') setStrategyType(requestedType);
      }
    } catch (error: any) {
      setSupabaseError(`Connexion Supabase impossible : ${error.message}`);
    } finally {
      setRefreshingCredits(false);
    }
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (Object.values(parsed).some((v) => v && v !== '' && v !== 0)) { setFormData(parsed); setHasDraft(true); }
        else { localStorage.removeItem(DRAFT_KEY); }
      } catch { localStorage.removeItem(DRAFT_KEY); }
    }
    loadCreditsBalance();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const timer = setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
    return () => clearTimeout(timer);
  }, [currentStep, showSummary, isGenerating]);

  useEffect(() => {
    if (!isFree && strategyType !== 'complete') setStrategyType('complete');
  }, [isFree, strategyType]);

  useEffect(() => {
    const handleBack = () => setShowSummary(false);
    window.addEventListener('summary-back', handleBack);
    return () => window.removeEventListener('summary-back', handleBack);
  }, []);

  useEffect(() => {
    if (currentStep <= totalSteps) localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData, currentStep]);

  const resetDraft = () => {
    if (!confirm('Effacer toutes les informations déjà saisies ?')) return;
    localStorage.removeItem(DRAFT_KEY);
    setFormData(initialFormData);
    setCurrentStep(1);
    setShowSummary(false);
    setHasDraft(false);
  };

  const validateStep = (step: number): boolean => {
    if (step === 1 && (!formData.companyName.trim() || !formData.companyDescription.trim() || !formData.sector)) {
      alert("Le nom, la description et le secteur sont obligatoires."); return false;
    }
    if (step === 2 && !formData.mainProduct.trim()) { alert('Indiquez le produit principal.'); return false; }
    if (step === 3 && (!formData.idealClient.trim() || !formData.country.trim())) { alert('Décrivez votre client idéal et son pays.'); return false; }
    if (step === 5 && !formData.mainObjective) { alert('Définissez un objectif principal.'); return false; }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    else setShowSummary(true);
  };

  const handlePrevious = () => {
    if (showSummary) setShowSummary(false);
    else if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleOpenPreGeneration = () => {
    if (!localStorage.getItem(FIRST_GEN_KEY)) setShowPreGeneration(true);
    else handleGenerate();
  };

  const handleConfirmPreGeneration = () => {
    localStorage.setItem(FIRST_GEN_KEY, '1');
    setShowPreGeneration(false);
    handleGenerate();
  };

  const handleGenerate = async () => {
    if (!isFree && strategyType === 'flash') { setStrategyType('complete'); return; }
    setIsGenerating(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { alert('Vous devez être connecté'); setIsGenerating(false); return; }

      const cleanFormData = {
        ...formData,
        companyName: formData.companyName?.trim() || 'Non spécifié',
        companyDescription: formData.companyDescription?.trim() || 'Non spécifié',
        sector: formData.sector?.trim() || 'Non spécifié',
        mainProduct: formData.mainProduct?.trim() || 'Non spécifié',
        idealClient: formData.idealClient?.trim() || 'Non spécifié',
        country: formData.country?.trim() || 'Non spécifié',
        mainObjective: formData.mainObjective?.trim() || 'Non spécifié',
        platform: formData.platform && formData.platform.trim() !== '' ? formData.platform.trim() : null,
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, strategyType, formData: cleanFormData }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
        router.push(`/dashboard/strategies/${data.strategyId}`);
      } else {
        if (response.status === 500) {
          setShowServiceError(true);
          setIsGenerating(false);
          await loadCreditsBalance();
          return;
        }

        let errorMsg = data.error || 'Erreur lors de la génération';
        if (data.creditsBalance !== undefined) errorMsg += `\n\nSolde : ${data.creditsBalance} crédits`;
        alert(errorMsg);
        setIsGenerating(false);
        await loadCreditsBalance();
      }
    } catch {
      alert('Erreur de connexion au serveur.');
      setIsGenerating(false);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => setFormData((prev) => ({ ...prev, ...updates }));

  const renderStep = () => {
    if (isGenerating) return <LoadingGeneration strategyType={strategyType} />;
    if (showSummary) return <Summary formData={formData} creditsBalance={safeBalance} generationCost={generationCost} onGenerate={handleOpenPreGeneration} isGenerating={isGenerating} currency={currency} />;

    switch (currentStep) {
      case 1: return <Step1Company formData={formData} updateFormData={updateFormData} />;
      case 2: return <Step2Offer formData={formData} updateFormData={updateFormData} currency={currency} />;
      case 3: return <Step3Audience formData={formData} updateFormData={updateFormData} />;
      case 4: return <Step4Market formData={formData} updateFormData={updateFormData} />;
      case 5: return <Step5Objective formData={formData} updateFormData={updateFormData} />;
      case 6: return <Step6Campaign formData={formData} updateFormData={updateFormData} currency={currency} />;
      case 7: return <Step7Creative formData={formData} updateFormData={updateFormData} />;
      case 8: return <Step8Context formData={formData} updateFormData={updateFormData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC]">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
        <BackButton href="/dashboard" label="Retour au dashboard" />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-[#111827] sm:text-xl">
              {isGenerating ? 'Génération en cours' : showSummary ? 'Résumé' : 'Nouvelle stratégie'}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
              {isGenerating ? 'Veuillez patienter...' : showSummary ? 'Vérifiez les informations.' : 'Construisez une stratégie adaptée à votre entreprise.'}
            </p>
          </div>
          <button onClick={loadCreditsBalance} disabled={refreshingCredits} className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${creditsLoaded ? badgeStyle : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
            {refreshingCredits ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wallet className="h-3.5 w-3.5" />}
            <span className="text-[11px] font-bold">{creditsLoaded ? safeBalance : '—'}</span>
            <span className="text-[10px] opacity-80">{creditsLoaded && safeBalance > 1 ? 'crédits' : 'crédit'}</span>
          </button>
        </div>

        {creditsLoaded && !isGenerating && !showSummary && alertLevel !== 'normal' && (
          <div className={`mb-5 flex items-start gap-3 rounded-xl border p-3.5 ${alertLevel === 'exhausted' ? 'border-red-300 bg-red-50' : alertLevel === 'critical' ? 'border-red-200 bg-red-50/70' : 'border-amber-200 bg-amber-50/70'}`}>
            {alertLevel === 'attention' ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />}
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-semibold ${alertLevel === 'attention' ? 'text-amber-900' : 'text-red-900'}`}>
                {alertLevel === 'exhausted' ? 'Crédits épuisés' : alertLevel === 'critical' ? 'Crédits critiques' : 'Fin de vos crédits proche'}
              </p>
              <p className={`mt-0.5 text-[11px] leading-relaxed ${alertLevel === 'attention' ? 'text-amber-800' : 'text-red-800'}`}>
                {alertLevel === 'exhausted' ? 'Passez à un plan supérieur.' : `Il vous reste ${creditsPercent}% de vos crédits.`}
              </p>
              {(alertLevel === 'exhausted' || alertLevel === 'critical') && (
                <Link href="/dashboard/pricing" className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#6366F1] px-3.5 py-1.5 text-[11px] font-semibold text-white">Voir les plans <ArrowRight className="h-3 w-3" /></Link>
              )}
            </div>
          </div>
        )}

        {hasDraft && !showSummary && !isGenerating && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3.5 py-2.5">
            <p className="text-[11px] text-indigo-900">Un brouillon est en cours.</p>
            <button onClick={resetDraft} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-indigo-200 bg-white px-3 py-1 text-[10px] font-semibold text-indigo-700"><RotateCcw className="h-3 w-3" /> Réinitialiser</button>
          </div>
        )}

        {supabaseError && <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">{supabaseError}</div>}

        {/* ✅ SECTION "MODE DE GÉNÉRATION" REFONDUE SELON LE MINI-CDC */}
        {!showSummary && !isGenerating && (!creditsLoaded || alertLevel !== 'exhausted') && (
          <div className="mb-5 rounded-2xl border border-slate-200/60 bg-[#FAFAFC] p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
            {/* En-tête compacte */}
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Type de stratégie
                </p>
                <h2 className="mt-1 text-base font-semibold text-[#111827]">
                  Mode de génération
                </h2>
              </div>
              {/* Badge Demo (ex-Free) */}
              <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-sm mt-1">
                {currentPlan === 'free' ? 'Demo' : currentPlan}
              </span>
            </div>

            {/* Disposition des cartes (Mobile-first) */}
            {isFree ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                
                {/* ✅ CARTE 1 : FLASH */}
                <button
                  type="button"
                  onClick={() => setStrategyType('flash')}
                  className={`relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                    strategyType === 'flash'
                      ? 'border-[#6366F1] bg-[#6366F1]/[0.03] shadow-[0_4px_20px_rgba(99,102,241,0.08)]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#111827]">Flash</span>
                    {strategyType === 'flash' && (
                      <CheckCircle2 className="h-5 w-5 text-[#6366F1]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-5">4 sections détaillées</p>
                  <div className="mt-auto">
                    <span className="text-sm font-semibold text-[#6366F1]">
                      {CREDIT_COSTS.DIAGNOSTIC_FLASH} crédits
                    </span>
                  </div>
                </button>

                {/* ✅ CARTE 2 : COMPLÈTE (PRO) */}
                <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
                  
                  {/* Badge PRO compact */}
                  <div className="absolute top-0 right-0 rounded-bl-xl rounded-tr-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-3 py-1 flex items-center gap-1 shadow-sm">
                    <Crown className="h-3 w-3 text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white">Pro</span>
                  </div>

                  <div className="mb-3 mt-1">
                    <span className="text-sm font-bold text-[#111827]">Complète</span>
                  </div>
                  
                  {/* Informations verticales */}
                  <ul className="text-xs text-slate-500 mb-5 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-slate-300" /> 12 sections
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-slate-300" /> Scripts WhatsApp
                    </li>
                  </ul>

                  {/* Bouton plein largeur */}
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/pricing')}
                    className="mt-auto w-full rounded-xl bg-[#111827] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Voir les offres
                  </button>
                </div>
              </div>
            ) : (
              /* Si l'utilisateur est déjà PRO */
              <div className="rounded-xl border-2 border-[#6366F1]/20 bg-[#6366F1]/5 px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#6366F1]">Stratégie complète</p>
                    <p className="text-[11px] text-[#6366F1]/80 mt-0.5">Inclus dans votre plan {currentPlan === 'free' ? 'Demo' : currentPlan}</p>
                  </div>
                  <span className="text-sm font-bold text-[#6366F1]">{CREDIT_COSTS.STRATEGIE_COMPLETE} crédits</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Note d'expert (remplacé par l'équipe) */}
        {!showSummary && !isGenerating && (
          <div className="mb-5 rounded-xl border border-indigo-200 bg-indigo-50/40 px-4 py-3">
            <p className="text-[12px] leading-relaxed text-slate-600 sm:text-[13px]">
              <strong className="text-[#0F172A]">Conseil de l'équipe :</strong> Pour obtenir les stratégies les plus précises et adaptées à votre activité, nous vous recommandons de compléter l'ensemble des champs du formulaire, y compris ceux marqués comme optionnels. Les informations détaillées nous permettent de calibrer au mieux votre ciblage, votre budget et vos recommandations.
            </p>
          </div>
        )}

        {!showSummary && !isGenerating && (!creditsLoaded || alertLevel !== 'exhausted') && <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />}

        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">{renderStep()}</div>

        {!showSummary && !isGenerating && (!creditsLoaded || alertLevel !== 'exhausted') && (
          <div className="flex items-center justify-between gap-3">
            <button onClick={handlePrevious} disabled={currentStep === 1} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold disabled:opacity-40 sm:text-sm">← Retour</button>
            <div className="flex items-center gap-3">
              <span className="hidden text-[10px] text-slate-500 sm:inline sm:text-xs">Étape {currentStep}/{totalSteps}</span>
              <button onClick={handleNext} className="rounded-full bg-[#6366F1] px-4 py-2 text-xs font-bold text-white shadow-sm sm:text-sm">{currentStep === totalSteps ? 'Voir le résumé →' : 'Continuer →'}</button>
            </div>
          </div>
        )}
      </div>

      <PreGenerationModal isOpen={showPreGeneration} onClose={() => setShowPreGeneration(false)} onContinue={handleConfirmPreGeneration} plan={currentPlan} strategyType={strategyType} creditsBalance={safeBalance} />

      {showServiceError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-amber-50 px-6 py-8 text-center border-b border-amber-100">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-[#0F172A]">Service momentanément indisponible</h2>
            </div>
            <div className="p-6 text-center space-y-4">
              <p className="text-sm leading-relaxed text-slate-600">
                En raison d'une maintenance imprévue de la part de nos partenaires technologiques, la génération automatique de stratégies est momentanément indisponible.
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-xs font-semibold text-[#0F172A] mb-2">Nous tenons à vous rassurer :</p>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />Votre compte et vos crédits sont en sécurité.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />Si une génération était en cours, <strong>aucun crédit n'a été débité</strong>.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <a href="mailto:support@makeitads.pro" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6366F1] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5558e6]"><MessageSquare className="h-4 w-4" />Contacter le support</a>
                <button onClick={() => setShowServiceError(false)} className="w-full rounded-full px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}