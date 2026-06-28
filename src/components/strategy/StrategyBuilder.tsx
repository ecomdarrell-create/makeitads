"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { X, Sparkles, Lock, Crown, Check } from "lucide-react";
import Link from "next/link";

import { useSession } from "@/hooks/useSession";
import { usePermissions } from "@/hooks/usePermissions";
import { useUsage } from "@/hooks/useUsage";
import { createClient } from "@/lib/supabase";
import { generateMockDashboard } from "@/lib/demo/mockData";
import { FormStep, BusinessData } from "@/lib/constants/strategy";
import {
  BUSINESS_MODELS,
  MATURITY_STAGES,
  GOALS,
  TARGET_AUDIENCES,
  TONES,
  MARKETING_CHANNELS,
} from "@/lib/constants/strategy";

// Composants réutilisables
import StepLayout from "./StepLayout";
import IndustrySelector from "./IndustrySelector";
import CountrySelector from "./CountrySelector";
import SelectionGrid from "./SelectionGrid";
import TextInput from "./TextInput";
import TagInput from "./TagInput";
import BudgetSelector from "./BudgetSelector";
import GenerationLoader from "./GenerationLoader";

const supabase = createClient();

interface StrategyBuilderProps {
  demoMode?: boolean;
  onComplete?: (strategyId?: string, mockData?: any) => void;
  onClose?: () => void;
}

const STEPS: FormStep[] = [
  "industry",
  "business-name",
  "location",
  "business-model",
  "products-services",
  "goals",
  "target-audience",
  "customer-pain-points",
  "budget",
  "competitors",
  "brand-positioning",
  "channels",
  "challenges",
  "generating",
];

export default function StrategyBuilder({
  demoMode = false,
  onComplete,
  onClose,
}: StrategyBuilderProps) {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const { userPlan } = usePermissions();
  const { usage, loading: usageLoading, recordUsage } = useUsage();

  const [step, setStep] = useState<FormStep>("industry");
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [saveAsDefault, setSaveAsDefault] = useState(true);

  // Form data
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [city, setCity] = useState("");
  const [selectedBusinessModel, setSelectedBusinessModel] = useState("");
  const [selectedMaturity, setSelectedMaturity] = useState("");
  const [products, setProducts] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState("");
  const [idealCustomer, setIdealCustomer] = useState("");
  const [customerPainPoints, setCustomerPainPoints] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState(2500);
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [competitiveAdvantages, setCompetitiveAdvantages] = useState<string[]>([]);
  const [brandPositioning, setBrandPositioning] = useState("");
  const [positioningStatement, setPositioningStatement] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [existingChannels, setExistingChannels] = useState<string[]>([]);
  const [preferredChannels, setPreferredChannels] = useState<string[]>([]);
  const [keyChallenges, setKeyChallenges] = useState<string[]>([]);
  const [uniqueValueProposition, setUniqueValueProposition] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Vérification des limites
  const canGenerate = usage.canGenerateStrategy;
  const strategiesUsed = usage.strategiesUsed;
  const strategiesLimit = usage.strategiesLimit;
  const isUnlimited = strategiesLimit === -1;

  // Charger le profil sauvegardé (uniquement en mode réel)
  useEffect(() => {
    if (demoMode) {
      setProfileLoaded(true);
      return;
    }

    const loadSavedProfile = async () => {
      if (!user) {
        setProfileLoaded(true);
        return;
      }
      try {
        const { data: profile } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profile) {
          setHasSavedProfile(true);
          if (profile.business_name) setBusinessName(profile.business_name);
          if (profile.industry) setSelectedIndustry(profile.industry);
          if (profile.country) setSelectedCountry(profile.country);
          if (profile.city) setCity(profile.city);
          if (profile.business_model) setSelectedBusinessModel(profile.business_model);
          if (profile.maturity) setSelectedMaturity(profile.maturity);
          if (profile.products) setProducts(profile.products.split(",").filter(Boolean));
          if (profile.services) setServices(profile.services.split(",").filter(Boolean));
          if (profile.target_audience) setSelectedAudience(profile.target_audience);
          if (profile.ideal_customer) setIdealCustomer(profile.ideal_customer);
          if (profile.customer_pain_points) setCustomerPainPoints(profile.customer_pain_points.split(",").filter(Boolean));
          if (profile.budget) setSelectedBudget(profile.budget);
          if (profile.competitors) setCompetitors(profile.competitors.split(",").filter(Boolean));
          if (profile.competitive_advantages) setCompetitiveAdvantages(profile.competitive_advantages.split(",").filter(Boolean));
          if (profile.brand_positioning) setBrandPositioning(profile.brand_positioning);
          if (profile.positioning_statement) setPositioningStatement(profile.positioning_statement);
          if (profile.tone) setSelectedTone(profile.tone);
          if (profile.existing_channels) setExistingChannels(profile.existing_channels.split(",").filter(Boolean));
          if (profile.marketing_channels) setPreferredChannels(profile.marketing_channels.split(",").filter(Boolean));
          if (profile.key_challenges) setKeyChallenges(profile.key_challenges.split(",").filter(Boolean));
          if (profile.unique_value_proposition) setUniqueValueProposition(profile.unique_value_proposition);
          if (profile.additional_notes) setAdditionalNotes(profile.additional_notes);
          if (profile.goals) setSelectedGoals(profile.goals.split(",").filter(Boolean));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setProfileLoaded(true);
      }
    };

    loadSavedProfile();
  }, [user, demoMode]);

  // Navigation
  const currentIndex = STEPS.indexOf(step);

  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setStep(STEPS[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
    }
  };

  const canProceed = (): boolean => {
    switch (step) {
      case "industry": return !!selectedIndustry;
      case "business-name": return businessName.trim().length > 0;
      case "location": return !!selectedCountry;
      case "business-model": return !!selectedBusinessModel && !!selectedMaturity;
      case "products-services": return products.length > 0 || services.length > 0;
      case "goals": return selectedGoals.length > 0;
      case "target-audience": return !!selectedAudience && idealCustomer.trim().length > 0;
      case "customer-pain-points": return customerPainPoints.length > 0;
      case "budget": return !!selectedBudget;
      case "competitors": return competitiveAdvantages.length > 0;
      case "brand-positioning": return !!selectedTone && brandPositioning.trim().length > 0;
      case "channels": return true;
      case "challenges": return true;
      default: return false;
    }
  };

  // Génération
  const startGeneration = async () => {
    if (!demoMode && !canGenerate) {
      setShowUpgradeModal(true);
      return;
    }

    setStep("generating");
    setError(null);

    const businessData: BusinessData = {
      name: businessName,
      industry: selectedIndustry || "",
      country: selectedCountry,
      city,
      businessModel: selectedBusinessModel,
      maturity: selectedMaturity,
      products,
      services,
      goals: selectedGoals,
      targetAudience: selectedAudience,
      idealCustomer,
      customerPainPoints,
      budget: selectedBudget,
      competitors,
      competitiveAdvantages,
      brandPositioning,
      positioningStatement,
      tone: selectedTone,
      existingChannels,
      marketingChannels: preferredChannels,
      keyChallenges,
      uniqueValueProposition,
      additionalNotes,
    };

    // MODE DÉMO : générer des données fictives
    if (demoMode) {
      setTimeout(() => {
        const mockData = generateMockDashboard(businessData);
        onComplete?.(undefined, mockData);
      }, 6000);
      return;
    }

    // MODE RÉEL : sauvegarder + appeler l'API
    try {
      // Sauvegarder le profil si demandé
      if (saveAsDefault && user) {
        await supabase.from("business_profiles").upsert({
          user_id: user.id,
          business_name: businessName,
          industry: selectedIndustry,
          country: selectedCountry,
          city,
          business_model: selectedBusinessModel,
          maturity: selectedMaturity,
          products: products.join(","),
          services: services.join(","),
          goals: selectedGoals.join(","),
          target_audience: selectedAudience,
          ideal_customer: idealCustomer,
          customer_pain_points: customerPainPoints.join(","),
          budget: selectedBudget,
          competitors: competitors.join(","),
          competitive_advantages: competitiveAdvantages.join(","),
          brand_positioning: brandPositioning,
          positioning_statement: positioningStatement,
          tone: selectedTone,
          existing_channels: existingChannels.join(","),
          marketing_channels: preferredChannels.join(","),
          key_challenges: keyChallenges.join(","),
          unique_value_proposition: uniqueValueProposition,
          additional_notes: additionalNotes,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      }

      const response = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessData }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const { strategy, provider } = await response.json();

      const { data: savedStrategy, error: saveError } = await supabase
        .from("strategies")
        .insert({
          user_id: user?.id,
          title: `${businessName} - ${selectedIndustry} Strategy`,
          industry: selectedIndustry,
          objective: selectedGoals.join(", "),
          data: strategy,
        })
        .select()
        .single();

      if (saveError) throw new Error("Failed to save strategy");

      await recordUsage("strategy_generation", {
        strategy_id: savedStrategy.id,
        industry: selectedIndustry,
        provider,
      });

      setTimeout(() => {
        onComplete?.(savedStrategy.id);
        router.push(`/dashboard/strategies/${savedStrategy.id}`);
      }, 2000);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  // Helpers pour les multi-select
  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleChannel = (channel: string, type: "existing" | "preferred") => {
    if (type === "existing") {
      setExistingChannels((prev) =>
        prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
      );
    } else {
      setPreferredChannels((prev) =>
        prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
      );
    }
  };

  if (sessionLoading || !profileLoaded || (!demoMode && usageLoading)) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1] mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#080810]/95 backdrop-blur-sm z-40">
        <div className="flex items-center gap-4">
          {onClose ? (
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X className="h-4 w-4 text-slate-400" />
            </button>
          ) : (
            <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
          <span className="text-sm font-bold text-white">
            Make<span className="text-[#8b5cf6]">ItAds</span> — Strategy Builder
            {demoMode && <span className="ml-2 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Demo</span>}
          </span>
        </div>

        {!demoMode && !isUnlimited && (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-[#8b5cf6]" />
              <span className="text-xs font-bold text-white">{strategiesUsed} / {strategiesLimit}</span>
            </div>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {STEPS.slice(0, -1).map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? "w-8 bg-[#6366f1]" : i < currentIndex ? "w-6 bg-[#6366f1]/50" : "w-6 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Profile loaded banner */}
      {hasSavedProfile && !demoMode && step !== "generating" && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-b border-emerald-500/20 px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
              <Check className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-emerald-200">Your profile has been pre-filled</p>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {step === "industry" && (
            <StepLayout key="industry" title="Choose Your Industry" subtitle="Select the category that best describes your business." onNext={handleNext} onBack={handleBack} canProceed={canProceed()} showBack={false}>
              <IndustrySelector selectedIndustry={selectedIndustry} onSelect={(id) => { setSelectedIndustry(id); setTimeout(handleNext, 300); }} />
            </StepLayout>
          )}

          {step === "business-name" && (
            <StepLayout key="business-name" title="What's Your Business Name?" subtitle="This will help us personalize your strategy." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <TextInput label="Business Name" value={businessName} onChange={setBusinessName} placeholder="e.g., Bright Dental Clinic" required />
            </StepLayout>
          )}

          {step === "location" && (
            <StepLayout key="location" title="Where is Your Business Located?" subtitle="Country and city for precise market targeting." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <TextInput label="City (Optional)" value={city} onChange={setCity} placeholder="e.g., Paris, New York, Tokyo" />
              <label className="text-sm font-bold text-white mb-3 block">Country *</label>
              <CountrySelector selectedCountry={selectedCountry} onSelect={setSelectedCountry} />
            </StepLayout>
          )}

          {step === "business-model" && (
            <StepLayout key="business-model" title="Business Model & Maturity" subtitle="Help us understand your business structure." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <label className="text-sm font-bold text-white mb-3 block">Business Model *</label>
              <SelectionGrid options={BUSINESS_MODELS} selected={selectedBusinessModel} onSelect={setSelectedBusinessModel} type="card" />
              <label className="text-sm font-bold text-white mb-3 block mt-8">Maturity Stage *</label>
              <SelectionGrid options={MATURITY_STAGES} selected={selectedMaturity} onSelect={setSelectedMaturity} type="card" />
            </StepLayout>
          )}

          {step === "products-services" && (
            <StepLayout key="products-services" title="Products & Services" subtitle="What do you sell? Add at least one product or service." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <TagInput label="Products" tags={products} onAdd={(t) => setProducts([...products, t])} onRemove={(i) => setProducts(products.filter((_, idx) => idx !== i))} placeholder="e.g., Premium Whitening Kit" />
              <TagInput label="Services" tags={services} onAdd={(t) => setServices([...services, t])} onRemove={(i) => setServices(services.filter((_, idx) => idx !== i))} placeholder="e.g., Free Consultation" />
            </StepLayout>
          )}

          {step === "goals" && (
            <StepLayout key="goals" title="What Are Your Goals?" subtitle="Select all that apply." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <SelectionGrid options={GOALS} selected={selectedGoals} onSelect={toggleGoal} multiSelect />
            </StepLayout>
          )}

          {step === "target-audience" && (
            <StepLayout key="target-audience" title="Target Audience & Ideal Customer" subtitle="Who are you trying to reach?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <label className="text-sm font-bold text-white mb-3 block">Primary Audience Segment *</label>
              <SelectionGrid options={TARGET_AUDIENCES} selected={selectedAudience} onSelect={setSelectedAudience} />
              <TextInput label="Ideal Customer Profile *" value={idealCustomer} onChange={setIdealCustomer} type="textarea" placeholder="e.g., Working professionals aged 28-45, earning $60k+..." rows={4} required />
            </StepLayout>
          )}

          {step === "customer-pain-points" && (
            <StepLayout key="customer-pain-points" title="Customer Pain Points" subtitle="What problems do your customers face?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <TagInput label="Pain Points" tags={customerPainPoints} onAdd={(t) => setCustomerPainPoints([...customerPainPoints, t])} onRemove={(i) => setCustomerPainPoints(customerPainPoints.filter((_, idx) => idx !== i))} placeholder="e.g., High cost of premium services" required />
            </StepLayout>
          )}

          {step === "budget" && (
            <StepLayout key="budget" title="Marketing Budget" subtitle="What's your monthly ad spend?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <BudgetSelector budget={selectedBudget} onChange={setSelectedBudget} />
            </StepLayout>
          )}

          {step === "competitors" && (
            <StepLayout key="competitors" title="Competitive Landscape" subtitle="Who are your competitors and what makes you different?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <TagInput label="Known Competitors (Optional)" tags={competitors} onAdd={(t) => setCompetitors([...competitors, t])} onRemove={(i) => setCompetitors(competitors.filter((_, idx) => idx !== i))} placeholder="e.g., Competitor X" />
              <TagInput label="Competitive Advantages *" tags={competitiveAdvantages} onAdd={(t) => setCompetitiveAdvantages([...competitiveAdvantages, t])} onRemove={(i) => setCompetitiveAdvantages(competitiveAdvantages.filter((_, idx) => idx !== i))} placeholder="e.g., 24/7 customer support" required />
            </StepLayout>
          )}

          {step === "brand-positioning" && (
            <StepLayout key="brand-positioning" title="Brand Positioning & Tone" subtitle="How do you want to be perceived?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <label className="text-sm font-bold text-white mb-3 block">Brand Tone *</label>
              <SelectionGrid options={TONES} selected={selectedTone} onSelect={setSelectedTone} />
              <div className="mt-8">
                <TextInput label="Brand Positioning *" value={brandPositioning} onChange={setBrandPositioning} placeholder="e.g., Premium quality at affordable prices" required />
                <TextInput label="Positioning Statement (Optional)" value={positioningStatement} onChange={setPositioningStatement} type="textarea" placeholder="For [target] who [need], [brand] is the [category] that [benefit]..." rows={3} />
                <TextInput label="Unique Value Proposition (Optional)" value={uniqueValueProposition} onChange={setUniqueValueProposition} type="textarea" placeholder="We deliver results 3x faster..." rows={2} />
              </div>
            </StepLayout>
          )}

          {step === "channels" && (
            <StepLayout key="channels" title="Marketing Channels" subtitle="Which channels are you using or planning to use?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
              <label className="text-sm font-bold text-white mb-3 block">Currently Using (Optional)</label>
              <SelectionGrid options={MARKETING_CHANNELS} selected={existingChannels} onSelect={(ch) => toggleChannel(ch, "existing")} multiSelect />
              <label className="text-sm font-bold text-white mb-3 block mt-8">Want to Explore (Optional)</label>
              <SelectionGrid options={MARKETING_CHANNELS} selected={preferredChannels} onSelect={(ch) => toggleChannel(ch, "preferred")} multiSelect />
            </StepLayout>
          )}

          {step === "challenges" && (
            <StepLayout
              key="challenges"
              title="Challenges & Additional Context"
              subtitle="What obstacles are you facing?"
              onNext={handleNext}
              onBack={handleBack}
              canProceed={!demoMode ? canGenerate : true}
              nextLabel={demoMode ? "Generate Strategy" : canGenerate ? "Generate Strategy" : "Limit Reached"}
              nextAction={startGeneration}
            >
              {!demoMode && !canGenerate && (
                <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-200 mb-1">Monthly strategy limit reached</p>
                      <p className="text-xs text-amber-400/80 mb-3">You've used {strategiesUsed} of {strategiesLimit} strategies on your {userPlan} plan.</p>
                      <button onClick={() => setShowUpgradeModal(true)} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-1.5 text-xs font-bold text-white">
                        <Crown className="h-3 w-3" /> Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <TagInput label="Key Challenges (Optional)" tags={keyChallenges} onAdd={(t) => setKeyChallenges([...keyChallenges, t])} onRemove={(i) => setKeyChallenges(keyChallenges.filter((_, idx) => idx !== i))} placeholder="e.g., Limited brand awareness" />
              <TextInput label="Additional Notes (Optional)" value={additionalNotes} onChange={setAdditionalNotes} type="textarea" placeholder="Any other information..." rows={4} />

              {!demoMode && (
                <div className="mt-6 p-4 rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={saveAsDefault} onChange={(e) => setSaveAsDefault(e.target.checked)} className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-[#6366f1]" />
                    <div>
                      <p className="text-sm font-semibold text-white">Save as my default business profile</p>
                      <p className="text-xs text-slate-400 mt-1">Your information will be pre-filled next time.</p>
                    </div>
                  </label>
                </div>
              )}
            </StepLayout>
          )}

          {step === "generating" && (
            <GenerationLoader key="generating" error={error} />
          )}
        </AnimatePresence>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a14] p-8 shadow-2xl">
                <button onClick={() => setShowUpgradeModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
                <h2 className="text-xl font-bold text-white mb-4">Limit Reached</h2>
                <p className="text-slate-400 text-sm mb-6">You've used {strategiesUsed}/{strategiesLimit} strategies. Upgrade to continue.</p>
                <Link href="/dashboard/billing" className="block w-full text-center rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] py-3 text-sm font-bold text-white">
                  Upgrade Now
                </Link>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}