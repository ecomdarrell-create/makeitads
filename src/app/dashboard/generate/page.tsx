'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const [strategyType, setStrategyType] = useState<'flash' | 'complete'>('complete');
  const [supabaseError, setSupabaseError] = useState('');

  const totalSteps = 8;
  const completeGenerationAllowed = hasFeature(currentPlan, 'pro');

  useEffect(() => {
    const savedDraft = localStorage.getItem('makeitads_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
      } catch (e) {
        console.error('Erreur chargement brouillon:', e);
      }
    }
    loadCreditsBalance();
  }, []);

  useEffect(() => {
    if (!completeGenerationAllowed && strategyType === 'complete') {
      setStrategyType('flash');
    }
  }, [completeGenerationAllowed, strategyType]);

  useEffect(() => {
    if (currentStep <= totalSteps) {
      localStorage.setItem('makeitads_draft', JSON.stringify(formData));
    }
  }, [formData, currentStep]);

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
        console.error('Erreur de lecture du profil Supabase:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
        });
        setSupabaseError(`Lecture du profil impossible (${profileError.code || 'erreur Supabase'}): ${profileError.message}`);
        return;
      }

      if (!profile) {
        setSupabaseError('Votre session est active, mais aucun profil correspondant n’existe dans la table profiles. Le profil doit être créé côté base de données avant de générer une stratégie.');
        return;
      }

      setCreditsBalance(profile.credits_balance || 0);
      setCurrentPlan(normalizePlanId(profile.plan));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Erreur de connexion Supabase:', message);
      setSupabaseError(
        message.includes('project\'s URL and API key are required')
          ? 'Configuration Supabase absente au runtime : définissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY pour cet environnement Vercel.'
          : `Connexion Supabase impossible : ${message}`
      );
    }
  };

  // ✅ VALIDATION DES ÉTAPES OBLIGATOIRES
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.companyName || !formData.sector) {
        alert("⚠️ Le nom de l'entreprise et le secteur d'activité sont obligatoires.");
        return false;
      }
    }
    if (step === 5) {
      if (!formData.mainObjective) {
        alert("⚠️ Vous devez définir un objectif principal pour continuer.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return; // 🛑 BLOQUE SI INVALIDE

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

  const handleGenerate = async () => {
    if (strategyType === 'complete' && !completeGenerationAllowed) {
      router.push('/pricing');
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

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          strategyType,
          formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('makeitads_draft');
        router.push(`/dashboard/strategies/${data.strategyId}`);
      } else {
        alert(data.error || 'Erreur lors de la génération');
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur serveur. Veuillez réessayer.');
      setIsGenerating(false);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
          strategyType={strategyType}
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
    <div className="px-4 py-5 sm:px-6 sm:py-6 max-w-3xl mx-auto">
      <BackButton href="/dashboard" label="Retour au dashboard" />

      <div className="mb-5">
        <h1 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          {isGenerating ? 'Génération en cours...' : showSummary ? 'Résumé de votre stratégie' : 'Construisons votre stratégie'}
        </h1>
        <p className="text-[10px] sm:text-xs text-gray-600">
          {isGenerating 
            ? 'Veuillez patienter pendant que notre IA analyse vos données.'
            : showSummary 
              ? 'Vérifiez les informations avant de générer.'
              : 'Quelques informations sur votre entreprise nous permettront de construire une stratégie adaptée.'}
        </p>
      </div>

      {supabaseError && (
        <div role="alert" className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {supabaseError}
        </div>
      )}

      {!showSummary && !isGenerating && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#6366F1]">Type de stratégie</p>
              <h2 className="text-sm font-semibold text-[#111827]">Choisissez votre mode de génération</h2>
            </div>
            <span className="rounded-full bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-medium text-[#6366F1] capitalize">{currentPlan}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStrategyType('flash')}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${strategyType === 'flash' ? 'border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              Diagnostic Flash
            </button>
            <button
              type="button"
              onClick={() => completeGenerationAllowed && setStrategyType('complete')}
              disabled={!completeGenerationAllowed}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${strategyType === 'complete' ? 'border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              Stratégie complète
            </button>
          </div>

          {!completeGenerationAllowed && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[10px] text-amber-800">
              La stratégie complète est réservée au plan Pro. <a href="/pricing" className="font-semibold underline">Passez au plan adapté</a> pour débloquer cette option.
            </div>
          )}
        </div>
      )}

      {!showSummary && !isGenerating && (
        <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm mb-5">
        {renderStep()}
      </div>

      {!showSummary && !isGenerating && (
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Retour
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-xs text-gray-500">
              Étape {currentStep} sur {totalSteps}
            </span>
            <button
              onClick={handleNext}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#5558e6] transition-colors"
            >
              {currentStep === totalSteps ? 'Voir le résumé →' : 'Continuer →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}