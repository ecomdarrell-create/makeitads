'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wallet, AlertTriangle, AlertCircle, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FormData, initialFormData } from '@/components/generate/types';
import { WizardProgress } from '@/components/generate/WizardProgress';
import { PlanId, hasFeature, normalizePlanId, PRICING_CONFIG } from '@/config/pricing.config';
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
import { BackButton } from '@/components/ui/BackButton';

const DRAFT_KEY = 'makeitads_draft';

export default function GeneratePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showSummary, setShowSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // ⚠️ null = pas encore chargé (évite le flash "0 crédits")
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanId>('free');
  const [strategyType, setStrategyType] = useState<'flash' | 'complete'>('flash');
  const [supabaseError, setSupabaseError] = useState('');
  const [hasDraft, setHasDraft] = useState(false);
  const [refreshingCredits, setRefreshingCredits] = useState(false);

  const totalSteps = 8;
  const completeGenerationAllowed = hasFeature(currentPlan, 'pro');

  const generationCost = strategyType === 'complete' ? 5 : 1;
  const planCreditsCap = PRICING_CONFIG[currentPlan]?.monthlyCredits || 10;

  // ─── Le solde réel est-il chargé ? ───
  const creditsLoaded = creditsBalance !== null;
  const safeBalance = creditsBalance ?? 0;

  const creditsPercent =
    planCreditsCap > 0
      ? Math.min(100, Math.round((safeBalance / planCreditsCap) * 100))
      : 0;

  const alertLevel: 'normal' | 'attention' | 'critical' | 'exhausted' =
    safeBalance === 0
      ? 'exhausted'
      : creditsPercent < 20
        ? 'critical'
        : creditsPercent < 50
          ? 'attention'
          : 'normal';

  const badgeStyle = {
    normal: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    attention: 'border-amber-200 bg-amber-50 text-amber-700',
    critical: 'border-red-200 bg-red-50 text-red-700',
    exhausted: 'border-red-300 bg-red-100 text-red-800',
  }[alertLevel];

  // ─── Charger les crédits ───
  const loadCreditsBalance = async () => {
    setRefreshingCredits(true);
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) throw new Error(`Authentification Supabase: ${authError.message}`);

      if (!user) {
        setSupabaseError('Aucune session utilisateur active. Reconnectez-vous puis réessayez.');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits_balance, plan')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Erreur lecture profil:', profileError);
        setSupabaseError(`Lecture du profil impossible: ${profileError.message}`);
        return;
      }

      if (!profile) {
        const bootstrapResponse = await fetch('/api/profile/bootstrap', { method: 'POST' });
        if (!bootstrapResponse.ok) throw new Error('Initialisation du profil impossible.');
        // Relancer récursivement
        setRefreshingCredits(false);
        await loadCreditsBalance();
        return;
      }

      // ✅ On met le solde à jour en une seule fois
      setCreditsBalance(profile.credits_balance ?? 0);
      setCurrentPlan(normalizePlanId(profile.plan));
      setSupabaseError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Erreur connexion Supabase:', message);
      setSupabaseError(
        message.includes("project's URL and API key are required")
          ? 'Configuration Supabase absente au runtime.'
          : `Connexion Supabase impossible : ${message}`
      );
    } finally {
      setRefreshingCredits(false);
    }
  };

  // ─── Chargement initial ───
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        const hasContent = Object.values(parsed).some((v) => v && v !== '' && v !== 0);
        if (hasContent) {
          setFormData(parsed);
          setHasDraft(true);
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      } catch (error) {
        console.error('Erreur chargement brouillon:', error);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
    loadCreditsBalance();
  }, []);

  useEffect(() => {
    const handleBack = () => setShowSummary(false);
    window.addEventListener('summary-back', handleBack);
    return () => window.removeEventListener('summary-back', handleBack);
  }, []);

  // ─── Autosave du draft ───
  useEffect(() => {
    if (currentStep <= totalSteps) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData, currentStep]);

  // ─── Réinitialiser le brouillon ───
  const resetDraft = () => {
    if (!confirm('Effacer toutes les informations déjà saisies ?')) return;
    localStorage.removeItem(DRAFT_KEY);
    setFormData(initialFormData);
    setCurrentStep(1);
    setShowSummary(false);
    setHasDraft(false);
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.companyName.trim() || !formData.companyDescription.trim() || !formData.sector) {
        alert("Le nom, la description et le secteur de l'entreprise sont obligatoires.");
        return false;
      }
    }
    if (step === 2 && !formData.mainProduct.trim()) {
      alert('Indiquez le produit ou service principal.');
      return false;
    }
    if (step === 3 && (!formData.idealClient.trim() || !formData.country.trim())) {
      alert('Décrivez votre client idéal et son pays.');
      return false;
    }
    if (step === 4 && !formData.mainCountry.trim()) {
      alert('Indiquez le pays principal de ciblage.');
      return false;
    }
    if (step === 5 && !formData.mainObjective) {
      alert('Vous devez définir un objectif principal pour continuer.');
      return false;
    }
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

  const handleGenerate = async () => {
    if (strategyType === 'complete' && !completeGenerationAllowed) {
      router.push('/dashboard/pricing');
      return;
    }

    setIsGenerating(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('Vous devez être connecté');
        setIsGenerating(false);
        return;
      }

      const cleanFormData = {
        ...formData,
        companyName: formData.companyName?.trim() || 'Non spécifié',
        companyDescription: formData.companyDescription?.trim() || 'Non spécifié',
        sector: formData.sector?.trim() || 'Non spécifié',
        mainProduct: formData.mainProduct?.trim() || 'Non spécifié',
        idealClient: formData.idealClient?.trim() || 'Non spécifié',
        country: formData.country?.trim() || 'Non spécifié',
        mainCountry: formData.mainCountry?.trim() || 'Non spécifié',
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
        let errorMsg = data.error || 'Erreur lors de la génération';

        if (errorMsg.toLowerCase().includes('clé api') || errorMsg.toLowerCase().includes('deepseek')) {
          errorMsg = 'Erreur de configuration de l\'IA. Veuillez contacter le support technique.';
        }

        if (data.creditsBalance !== undefined && data.creditCost !== undefined) {
          errorMsg += `\n\nSolde actuel : ${data.creditsBalance} crédits\nCoût : ${data.creditCost} crédits`;
        }

        alert(errorMsg);
        setIsGenerating(false);

        await loadCreditsBalance();
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur.');
      setIsGenerating(false);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    if (isGenerating) return <LoadingGeneration strategyType={strategyType} />;
    if (showSummary) {
      return (
        <Summary
          formData={formData}
          creditsBalance={safeBalance}
          generationCost={generationCost}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      );
    }
    switch (currentStep) {
      case 1: return <Step1Company formData={formData} updateFormData={updateFormData} />;
      case 2: return <Step2Offer formData={formData} updateFormData={updateFormData} />;
      case 3: return <Step3Audience formData={formData} updateFormData={updateFormData} />;
      case 4: return <Step4Market formData={formData} updateFormData={updateFormData} />;
      case 5: return <Step5Objective formData={formData} updateFormData={updateFormData} />;
      case 6: return <Step6Campaign formData={formData} updateFormData={updateFormData} />;
      case 7: return <Step7Creative formData={formData} updateFormData={updateFormData} />;
      case 8: return <Step8Context formData={formData} updateFormData={updateFormData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC]">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
        <BackButton href="/dashboard" label="Retour au dashboard" />

        {/* HEADER + BADGE CRÉDITS */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-[#111827] sm:text-xl">
              {isGenerating ? 'Génération en cours' : showSummary ? 'Résumé' : 'Nouvelle stratégie'}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
              {isGenerating
                ? 'Veuillez patienter pendant que notre moteur analyse vos données.'
                : showSummary
                  ? 'Vérifiez les informations avant de lancer la génération.'
                  : 'Construisez une stratégie adaptée à votre entreprise, votre marché et vos objectifs.'}
            </p>
          </div>

          <button
            type="button"
            onClick={loadCreditsBalance}
            disabled={refreshingCredits}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${
              creditsLoaded
                ? badgeStyle
                : 'border-slate-200 bg-slate-50 text-slate-500'
            } ${refreshingCredits ? 'opacity-60' : 'hover:opacity-90'}`}
            title="Cliquer pour rafraîchir le solde"
          >
            {refreshingCredits ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Wallet className="h-3.5 w-3.5" />
            )}
            <span className="text-[11px] font-bold">
              {creditsLoaded ? safeBalance : '—'}
            </span>
            <span className="text-[10px] opacity-80">
              {creditsLoaded && safeBalance > 1 ? 'crédits' : 'crédit'}
            </span>
          </button>
        </div>

        {/* BANDEAU D'ALERTE CRÉDITS — uniquement si chargé ET solde bas */}
        {creditsLoaded && !isGenerating && !showSummary && alertLevel !== 'normal' && (
          <div
            className={`mb-5 flex items-start gap-3 rounded-xl border p-3.5 ${
              alertLevel === 'exhausted'
                ? 'border-red-300 bg-red-50'
                : alertLevel === 'critical'
                  ? 'border-red-200 bg-red-50/70'
                  : 'border-amber-200 bg-amber-50/70'
            }`}
          >
            {alertLevel === 'attention' ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            )}

            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-semibold ${
                  alertLevel === 'attention' ? 'text-amber-900' : 'text-red-900'
                }`}
              >
                {alertLevel === 'exhausted' && 'Vous avez épuisé vos crédits ce mois-ci'}
                {alertLevel === 'critical' &&
                  `Il vous reste seulement ${safeBalance} crédit${safeBalance > 1 ? 's' : ''}`}
                {alertLevel === 'attention' && 'Vous approchez de la fin de vos crédits'}
              </p>
              <p
                className={`mt-0.5 text-[11px] leading-relaxed ${
                  alertLevel === 'attention' ? 'text-amber-800' : 'text-red-800'
                }`}
              >
                {alertLevel === 'exhausted'
                  ? 'Passez à un plan supérieur ou attendez le renouvellement mensuel.'
                  : `Il vous reste ${creditsPercent}% de vos crédits mensuels.`}
              </p>

              {(alertLevel === 'exhausted' || alertLevel === 'critical') && (
                <Link
                  href="/dashboard/pricing"
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#6366F1] px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-[#6366F1]/20 transition-colors hover:bg-[#5558e6]"
                >
                  Voir les plans supérieurs
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* BANDEAU BROUILLON */}
        {hasDraft && !showSummary && !isGenerating && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3.5 py-2.5">
            <p className="text-[11px] text-indigo-900">
              Vous avez un brouillon en cours. Voulez-vous repartir de zéro ?
            </p>
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-indigo-200 bg-white px-3 py-1 text-[10px] font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
            >
              <RotateCcw className="h-3 w-3" />
              Réinitialiser
            </button>
          </div>
        )}

        {supabaseError && (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {supabaseError}
          </div>
        )}

        {/* SÉLECTION DU TYPE DE STRATÉGIE */}
        {!showSummary && !isGenerating && (!creditsLoaded || alertLevel !== 'exhausted') && (
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6366F1]">
                  Type de stratégie
                </p>
                <h2 className="text-sm font-semibold text-[#111827]">Mode de génération</h2>
              </div>
              <span className="rounded-full bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-semibold capitalize text-[#6366F1]">
                {currentPlan}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStrategyType('flash')}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  strategyType === 'flash'
                    ? 'border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Diagnostic Flash
                <span className="ml-1 text-[10px] opacity-70">1 crédit</span>
              </button>
              <button
                type="button"
                onClick={() => completeGenerationAllowed && setStrategyType('complete')}
                disabled={!completeGenerationAllowed}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  strategyType === 'complete'
                    ? 'border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Stratégie complète
                <span className="ml-1 text-[10px] opacity-70">5 crédits</span>
              </button>
            </div>

            {!completeGenerationAllowed && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[10px] text-amber-800">
                La stratégie complète est réservée au plan Pro.{' '}
                <Link href="/dashboard/pricing" className="font-semibold underline">
                  Passer au plan adapté
                </Link>
              </div>
            )}
          </div>
        )}

        {!showSummary && !isGenerating && (!creditsLoaded || alertLevel !== 'exhausted') && (
          <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />
        )}

        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {renderStep()}
        </div>

        {!showSummary && !isGenerating && (!creditsLoaded || alertLevel !== 'exhausted') && (
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#18181B] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              ← Retour
            </button>

            <div className="flex items-center gap-3">
              <span className="hidden text-[10px] text-slate-500 sm:inline sm:text-xs">
                Étape {currentStep} sur {totalSteps}
              </span>
              <button
                onClick={handleNext}
                className="rounded-full bg-[#6366F1] px-4 py-2 text-xs font-bold text-white shadow-sm shadow-[#6366F1]/20 transition-colors hover:bg-[#5558e6] sm:text-sm"
              >
                {currentStep === totalSteps ? 'Voir le résumé →' : 'Continuer →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}