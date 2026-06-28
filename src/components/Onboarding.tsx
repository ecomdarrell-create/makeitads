"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Building2, 
  Sparkles, 
  Users, 
  LayoutDashboard,
  CheckCircle2,
  Loader2,
  Eye
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { saveBusinessProfile, createStrategy, createCompetitor } from "@/lib/database";

const supabase = createClient();

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 1,
    title: "Create your Business Profile",
    description: "Tell us about your business. We'll remember it forever.",
    icon: Building2,
    color: "from-[#6366f1] to-[#8b5cf6]",
  },
  {
    id: 2,
    title: "Generate your first strategy",
    description: "Get a complete AI-powered strategy in seconds.",
    icon: Sparkles,
    color: "from-[#8b5cf6] to-[#a78bfa]",
  },
  {
    id: 3,
    title: "Add your first competitor",
    description: "Track and analyze your competition automatically.",
    icon: Users,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: 4,
    title: "You're all set!",
    description: "Everything is ready. Let's explore your dashboard.",
    icon: LayoutDashboard,
    color: "from-[#38bdf8] to-[#0ea5e9]",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Step 1: Business Profile
  const [businessData, setBusinessData] = useState({
    businessName: "",
    industry: "",
    targetAudience: "",
    mainGoal: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Step 2: Strategy Generation
  const [generatingStrategy, setGeneratingStrategy] = useState(false);
  const [strategyGenerated, setStrategyGenerated] = useState(false);
  const [strategyPreview, setStrategyPreview] = useState<any>(null);

  // Step 3: Competitor
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [analyzingCompetitor, setAnalyzingCompetitor] = useState(false);
  const [competitorAdded, setCompetitorAdded] = useState(false);
  const [competitorPreview, setCompetitorPreview] = useState<any>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = async () => {
    // STEP 1: Save Business Profile
    if (currentStep === 0) {
      if (!businessData.businessName || !businessData.industry) {
        alert("Please fill in Business Name and Industry");
        return;
      }
      setSavingProfile(true);
      try {
        await saveBusinessProfile({
          business_name: businessData.businessName,
          industry: businessData.industry,
          target_audience: businessData.targetAudience,
          main_goal: businessData.mainGoal,
        });
        setProfileSaved(true);
        setTimeout(() => {
          setSavingProfile(false);
          setCurrentStep(1);
        }, 800);
      } catch (error: any) {
        console.error("Error saving profile:", error);
        alert(`Error saving profile: ${error?.message || "Please try again."}`);
        setSavingProfile(false);
      }
    } 
    // STEP 2: Generate Strategy
    else if (currentStep === 1) {
      if (strategyGenerated) {
        setCurrentStep(2);
        return;
      }
      setGeneratingStrategy(true);
      try {
        const strategy = await createStrategy({
          name: `${businessData.businessName} - Initial Strategy`,
          goal: businessData.mainGoal || "Brand Awareness",
          positioning: `AI-generated positioning for ${businessData.businessName} in the ${businessData.industry} industry.`,
          targeting: {
            Meta: { age: "25-45", gender: "All", interests: [businessData.industry] },
          },
          budget_split: { Meta: 60, TikTok: 40 },
          ad_copy: [
            `Discover ${businessData.businessName} - Your trusted partner in ${businessData.industry}`,
            `Transform your ${businessData.industry.toLowerCase()} experience with us`,
          ],
          calendar: [
            { day: "Mon", platform: "Meta", time: "18:00", type: "Carousel Ad" },
            { day: "Wed", platform: "TikTok", time: "19:00", type: "Short Video" },
          ],
          clarity_score: 75,
          status: "active",
        });
        setStrategyPreview(strategy);
        setStrategyGenerated(true);
        setTimeout(() => {
          setGeneratingStrategy(false);
          setCurrentStep(2);
        }, 1500);
      } catch (error: any) {
        console.error("Error generating strategy:", error);
        alert(`Error generating strategy: ${error?.message || "Please try again."}`);
        setGeneratingStrategy(false);
      }
    } 
    // STEP 3: Add Competitor
    else if (currentStep === 2) {
      if (competitorAdded) {
        setCurrentStep(3);
        return;
      }
      if (!competitorUrl) {
        // Allow skipping empty competitor step
        setCurrentStep(3);
        return;
      }
      setAnalyzingCompetitor(true);
      try {
        const competitorName = competitorUrl.replace(/https?:\/\//, "").split("/")[0].replace(/\./g, " ");
        const competitor = await createCompetitor({
          name: competitorName.charAt(0).toUpperCase() + competitorName.slice(1),
          website: competitorUrl,
          platforms: ["Instagram", "TikTok"],
          positioning: `Competitor in ${businessData.industry} space`,
          messaging_themes: ["Quality", "Innovation"],
          strengths: ["Brand recognition", "Market presence"],
          weaknesses: ["Limited digital presence"],
          strength_score: 65,
          trend: "stable",
        });
        setCompetitorPreview(competitor);
        setCompetitorAdded(true);
        setTimeout(() => {
          setAnalyzingCompetitor(false);
          setCurrentStep(3);
        }, 1200);
      } catch (error: any) {
        console.error("Error adding competitor:", error);
        alert(`Error adding competitor: ${error?.message || "Please try again."}`);
        setAnalyzingCompetitor(false);
      }
    } 
    // STEP 4: Finish
    else {
      await completeOnboarding();
    }
  };

  const handleSkipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkipAll = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    setIsCompleting(true);
    try {
      await supabase.auth.updateUser({
        data: { onboarding_completed: true },
      });
      onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setIsCompleting(false);
      alert("Could not save onboarding status. Redirecting anyway.");
      onComplete();
    }
  };

  const step = steps[currentStep];
  const StepIcon = step.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isMobile ? "bg-[#080810]" : ""}`}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`absolute inset-0 ${isMobile ? "bg-[#080810]" : "bg-[#080810]/90"} backdrop-blur-md`}
        onClick={handleSkipAll}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative ${isMobile ? "w-full h-full rounded-none" : "w-full max-w-2xl rounded-3xl"} border border-white/[0.08] bg-[#0f0f1a] shadow-2xl shadow-[#6366f1]/10 overflow-hidden flex flex-col`}
      >
        {/* Close Button */}
        <button
          onClick={handleSkipAll}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-14 md:pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              {/* Step Indicator */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${step.color}`}>
                  <StepIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">{step.description}</p>

              {/* Step Content */}
              {currentStep === 0 && (
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={businessData.businessName}
                      onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                      placeholder="e.g., Natural Beauty Co."
                      className="w-full rounded-xl border border-white/10 bg-[#080810] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Industry *
                    </label>
                    <select
                      value={businessData.industry}
                      onChange={(e) => setBusinessData({ ...businessData, industry: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#080810] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                    >
                      <option value="">Select industry...</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Beauty & Skincare">Beauty & Skincare</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Tech & Electronics">Tech & Electronics</option>
                      <option value="Health & Wellness">Health & Wellness</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={businessData.targetAudience}
                      onChange={(e) => setBusinessData({ ...businessData, targetAudience: e.target.value })}
                      placeholder="e.g., Women 25-40, interested in organic beauty"
                      className="w-full rounded-xl border border-white/10 bg-[#080810] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Main Goal
                    </label>
                    <select
                      value={businessData.mainGoal}
                      onChange={(e) => setBusinessData({ ...businessData, mainGoal: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#080810] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                    >
                      <option value="">Select goal...</option>
                      <option value="Brand Awareness">Brand Awareness</option>
                      <option value="Lead Generation">Lead Generation</option>
                      <option value="Sales / Conversions">Sales / Conversions</option>
                      <option value="Website Traffic">Website Traffic</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4 flex-1">
                  {!strategyGenerated ? (
                    <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                      <Sparkles className="h-12 w-12 text-[#8b5cf6] mx-auto mb-4" />
                      <p className="text-sm text-slate-400 mb-6">
                        Ready to generate your first AI-powered strategy based on your business profile?
                      </p>
                      <button
                        onClick={handleNext}
                        disabled={generatingStrategy}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform disabled:opacity-50"
                      >
                        {generatingStrategy ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            Generate my first strategy now
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-200">Strategy Generated!</span>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-white/5 p-3">
                          <p className="text-xs text-slate-400 mb-1">Positioning</p>
                          <p className="text-sm text-white">{strategyPreview?.positioning}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 p-3">
                          <p className="text-xs text-slate-400 mb-1">Targeting</p>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-xs rounded bg-[#6366f1]/20 px-2 py-1 text-[#a78bfa]">Meta: 60%</span>
                            <span className="text-xs rounded bg-[#6366f1]/20 px-2 py-1 text-[#a78bfa]">TikTok: 40%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 flex-1">
                  {!competitorAdded ? (
                    <div className="flex flex-col justify-center h-full">
                      <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                        Competitor Website URL
                      </label>
                      <input
                        type="text"
                        value={competitorUrl}
                        onChange={(e) => setCompetitorUrl(e.target.value)}
                        placeholder="https://competitor.com"
                        className="w-full rounded-xl border border-white/10 bg-[#080810] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 placeholder:text-slate-600 mb-4"
                      />
                      <button
                        onClick={handleNext}
                        disabled={analyzingCompetitor}
                        className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {analyzingCompetitor ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Analyze Competitor
                          </>
                        )}
                      </button>
                      <p className="text-xs text-slate-500 text-center mt-3">
                        Or skip this step to add competitors later
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-200">Competitor Added!</span>
                      </div>
                      <div className="rounded-lg bg-white/5 p-3">
                        <p className="text-xs text-slate-400 mb-1">Competitor</p>
                        <p className="text-sm text-white font-semibold">{competitorPreview?.name}</p>
                        <p className="text-xs text-slate-400 mt-2">{competitorPreview?.positioning}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] mb-6">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">You're all set!</h3>
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Business Profile {profileSaved ? "✓" : "(skipped)"}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>First Strategy {strategyGenerated ? "✓" : "(skipped)"}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>First Competitor {competitorAdded ? "✓" : "(skipped)"}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={isCompleting}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading Dashboard...
                      </>
                    ) : (
                      <>
                        Go to my Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Actions Footer */}
              {currentStep < 3 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  <button
                    onClick={handleSkipStep}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Skip this step
                  </button>
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] transition-all"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                    )}
                    {currentStep < 2 && (
                      <button
                        onClick={handleNext}
                        disabled={savingProfile || generatingStrategy || analyzingCompetitor}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform disabled:opacity-50"
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : generatingStrategy ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : analyzingCompetitor ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Next
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}