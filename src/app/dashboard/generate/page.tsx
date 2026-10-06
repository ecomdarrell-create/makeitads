'use client';

import { startTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FormData, initialFormData } from '@/components/generate/types';
import { WizardProgress } from '@/components/generate/WizardProgress';
import { PlanId, hasFeature, normalizePlanId } from '@/config/pricing.config';
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

export default function GeneratePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showSummary, setShowSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState(0);
  const [currentPlan, setCurrentPlan] = useState<PlanId>('free');
  const [strategyType, setStrategyType] = useState<'flash' | 'complete'>('flash');
  const [supabaseError, setSupabaseError] = useState('');

  const totalSteps = 8;
  const completeGenerationAllowed = hasFeature(currentPlan, 'pro');

  // ─── Coût de génération centralisé (aligné sur pricing.config.ts) ───
  const generationCost = strategyType === 'complete' ? 5 : 1;

  // ─── Chargement du solde de crédits ───
  const loadCreditsBalance = async () => {
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(`Authentification Supabase (${authError.code || 'sans code'}): ${authError.message}`);
      }

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
        console.error('Erreur de lecture du profil Supabase:', profileError);
        setSupabaseError(`Lecture du profil impossible: ${profileError.message}`);
        return;
      }

      if (!profile) {
        const bootstrapResponse = await fetch('/api/profile/bootstrap', { method: 'POST' });
        if (!bootstrapResponse.ok) {
          throw new Error('Initialisation du profil impossible.');
        }

        const { data: createdProfile, error: createdProfileError } = await supabase
          .from('profiles')
          .select('credits_balance, plan')
          .eq('id', user.id)
          .maybeSingle();

        if (createdProfileError || !createdProfile) {
          throw new Error(createdProfileError?.message || 'Le profil n’a pas pu être initialisé.');
        }

        setCreditsBalance(createdProfile.credits_balance || 0);
        setCurrentPlan(normalizePlanId(createdProfile.plan));
        return;
      }

      setCreditsBalance(profile.credits_balance || 0);
      setCurrentPlan(normalizePlanId(profile.plan));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Erreur de connexion Supabase:', message);
      setSupabaseError(
        message.includes('project\'s URL and API key are required')
          ? 'Configuration Supabase absente au runtime.'
          : `Connexion Supabase impossible : ${message}`
      );
    }
  };

  // ─── Chargement initial + retour draft ───
  useEffect(() => {
    const savedDraft = localStorage.getItem('makeitads_draft');
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch (error) {
        console.error('Erreur chargement brouillon:', error);
      }
    }
    loadCreditsBalance();
  }, []);

  // ─── Écoute du retour depuis le Summary ───
  useEffect(() => {
    const handleBack = () => setShowSummary(false);
    window.addEventListener('summary-back', handleBack);
    return () => window.removeEventListener('summary-back', handleBack);
  }, []);

  // ─── Autosave du draft ───
  useEffect(() => {
    if (currentStep <= totalSteps) {
      localStorage.setItem('makeitads_draft', JSON.stringify(formData));
    }
  }, [formData, currentStep]);

  // ─── Validation des étapes ───
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
    if (step === 5) {
      if (!formData.mainObjective) {
        alert('Vous devez définir un objectif principal pour continuer.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ─── Génération de la stratégie ───
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

      console.log('[Frontend] Début de la requête de génération...', {
        userId: user.id,
        strategyType,
      });

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
        body: JSON.stringify({
          userId: user.id,
          strategyType,
          formData: cleanFormData,
        }),
      });

      const data = await response.json();
      console.log('[Frontend] Réponse de l\'API:', data);

      if (response.ok) {
        console.log('[Frontend] Génération réussie, redirection...');
        localStorage.removeItem('makeitads_draft');
        router.push(`/dashboard/strategies/${data.strategyId}`);
      } else {
        console.error('[Frontend] Erreur API:', data.error);

        let errorMsg = data.error || 'Erreur lors de la génération';
        if (errorMsg.toLowerCase().includes('clé api') || errorMsg.toLowerCase().includes('deepseek')) {
          errorMsg = 'Erreur de configuration de l\'IA. Veuillez contacter le support technique.';
        } else if (errorMsg.toLowerCase().includes('crédits')) {
          errorMsg = 'Crédits insuffisants. Veuillez recharger votre compte.';
        }

        alert(errorMsg);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('[Frontend] Erreur réseau ou inattendue:', error);
      alert('Erreur de connexion au serveur. Veuillez vérifier votre connexion et réessayer.');
      setIsGenerating(false);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    if (isGenerating) {
      return <LoadingGeneration strategyType={strategyType} />;
    }

    if (showSummary) {
      return (
        <Summary
          formData={formData}
          creditsBalance={creditsBalance}
          generationCost={generationCost}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return <Step1Company formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2Offer formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step3Audience formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step4Market formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step5Objective formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <Step6Campaign formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <Step7Creative formData={formData} updateFormData={updateFormData} />;
      case 8:
        return <Step8Context formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC]">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
        <BackButton href="/dashboard" label="Retour au dashboard" />

        {/* ═══════════════════════════════════════ */}
        {/* HEADER PREMIUM */}
        {/* ═══════════════════════════════════════ */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-[#111827] sm:text-xl">
              {isGenerating
                ? 'Génération en cours'
                : showSummary
                  ? 'Résumé de votre stratégie'
                  : 'Nouvelle stratégie'}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
              {isGenerating
                ? 'Veuillez patienter pendant que notre moteur analyse vos données.'
                : showSummary
                  ? 'Vérifiez les informations avant de lancer la génération.'
                  : 'Construisez une stratégie publicitaire adaptée à votre entreprise, votre marché et vos objectifs.'}
            </p>
          </div>

          {/* Solde discret */}
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <Wallet className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-[#18181B]">
              {creditsBalance}
            </span>
            <span className="text-[10px] text-slate-500">
              crédit{creditsBalance > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* ERREUR SUPABASE */}
        {/* ═══════════════════════════════════════ */}
        {supabaseError && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
          >
            {supabaseError}
          </div>
        )}

        {/* ═══════════════════════════════════════ */}
        {/* SÉLECTION DU TYPE DE STRATÉGIE */}
        {/* ═══════════════════════════════════════ */}
        {!showSummary && !isGenerating && (
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6366F1]">
                  Type de stratégie
                </p>
                <h2 className="text-sm font-semibold text-[#111827]">
                  Choisissez votre mode de génération
                </h2>
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
                <a href="/dashboard/pricing" className="font-semibold underline">
                  Passer au plan adapté
                </a>{' '}
                pour débloquer cette option.
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════ */}
        {/* PROGRESSION */}
        {/* ═══════════════════════════════════════ */}
        {!showSummary && !isGenerating && (
          <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />
        )}

        {/* ═══════════════════════════════════════ */}
        {/* CONTENU (étape, résumé, ou loading) */}
        {/* ═══════════════════════════════════════ */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {renderStep()}
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* NAVIGATION */}
        {/* ═══════════════════════════════════════ */}
        {!showSummary && !isGenerating && (
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