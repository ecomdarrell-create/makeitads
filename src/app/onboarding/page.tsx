"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import GlobalBackButton from "@/components/shared/GlobalBackButton";
import { useSession } from "@/hooks/useSession";
import { createClient } from "@/lib/supabase";

const INDUSTRIES = [
  { id: "dental", name: "Dental Clinic", image: "/images/industry-dental.jpg" },
  { id: "ecommerce", name: "E-commerce", image: "/images/industry-ecommerce.jpg" },
  { id: "restaurant", name: "Restaurant", image: "/images/industry-restaurant.jpg" },
  { id: "gym", name: "Gym & Fitness", image: "/images/industry-gym.jpg" },
  { id: "beauty", name: "Beauty Brand", image: "/images/industry-beauty.jpg" },
  { id: "realestate", name: "Real Estate", image: "/images/industry-realestate.jpg" },
  { id: "saas", name: "SaaS", image: "/images/industry-saas.jpg" },
  { id: "education", name: "Education", image: "/images/industry-education.jpg" },
  { id: "healthcare", name: "Healthcare", image: "/images/industry-healthcare.jpg" },
  { id: "travel", name: "Travel", image: "/images/industry-travel.jpg" },
  { id: "others", name: "Others", image: "/images/industry-others.jpg" },
];

type OnboardingStep = "welcome" | "industry" | "details" | "generating" | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useSession();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [formData, setFormData] = useState({
    businessName: "",
    website: "",
    country: "",
    targetAudience: "",
    description: "",
    services: [] as string[],
    pricingPositioning: "",
    goals: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);

  const handleStartBuilding = () => setStep("industry");
  const handleIndustrySelect = (id: string) => {
    setSelectedIndustry(id);
    setStep("details");
  };

  const handleGenerateStrategy = async () => {
    if (!user) {
      router.push("/signup");
      return;
    }

    setError(null);
    setStep("generating");

    try {
      console.log("🚀 Starting strategy generation...");
      console.log("📊 Industry:", selectedIndustry);
      console.log("🏢 Business:", formData.businessName);

      const supabase = createClient();

      // ÉTAPE 1 : Mettre à jour le profil
      console.log("📝 Updating profile...");
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          current_onboarding_step: 10,
          generation_completed: true,
          first_strategy_created: true,
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("❌ Profile update error:", profileError);
        throw new Error(`Profile update failed: ${profileError.message}`);
      }
      console.log("✅ Profile updated successfully");

      // ÉTAPE 2 : Générer la stratégie
      console.log("🤖 Generating strategy...");
      
      const response = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          businessData: {
            name: formData.businessName,
            website: formData.website,
            country: formData.country,
            targetAudience: formData.targetAudience,
            description: formData.description,
            services: formData.services,
            pricingPositioning: formData.pricingPositioning,
            goals: formData.goals,
            industry: selectedIndustry,
          } 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.error || `API failed with status ${response.status}`);
      }

      const { strategy, source } = await response.json();
      console.log(`✅ Strategy generated (source: ${source}):`, strategy.businessName);

      // ÉTAPE 3 : Sauvegarder la stratégie
      console.log("💾 Saving strategy to database...");
      
      const { data: savedStrategy, error: strategyError } = await supabase
        .from("strategies")
        .insert({
          user_id: user.id,
          title: `${formData.businessName} - Marketing Strategy`,
          industry: selectedIndustry,
          objective: formData.goals.join(", "),
          data: strategy,
        })
        .select()
        .single();

      if (strategyError) {
        console.error("❌ Strategy save error:", strategyError);
        throw new Error(`Strategy save failed: ${strategyError.message}`);
      }
      
      console.log("✅ Strategy saved with ID:", savedStrategy.id);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("❌ Onboarding error:", err);
      setError(err?.message || "Unknown error");
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }
  };

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-[#080810] text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/onboarding-welcome-hero.jpg" alt="MakeItAds" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080810]/90 via-[#080810]/80 to-[#080810]/95" />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="text-4xl md:text-5xl font-bold">Make<span className="text-[#8b5cf6]">ItAds</span></span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold text-center mb-6">
            Welcome to MakeItAds
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-300 text-center mb-4 max-w-2xl">
            Let's build your first marketing strategy in less than one minute.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center gap-4">
            <button onClick={handleStartBuilding} className="group inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#5558e6]">
              Start Building <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
            </button>
            <button onClick={() => router.push("/dashboard")} className="text-sm text-slate-400 hover:text-white">
              Explore Dashboard First
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === "industry") {
    return (
      <div className="min-h-screen bg-[#080810] text-white">
        <div className="fixed top-6 left-6 z-50"><GlobalBackButton onClick={() => setStep("welcome")} /></div>
        <div className="max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Industry</h2>
            <p className="text-slate-400">Select the category that best describes your business.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {INDUSTRIES.map((industry, index) => (
              <motion.button key={industry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleIndustrySelect(industry.id)} className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#6366f1]/50 group aspect-[4/3]">
                <Image src={industry.image} alt={industry.name} fill className="object-cover group-hover:scale-110 transition-transform" style={{ objectPosition: "center 30%" }} sizes="(max-width: 768px) 50vw, 20vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-sm font-bold text-white">{industry.name}</p></div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "details") {
    return (
      <div className="min-h-screen bg-[#080810] text-white">
        <div className="fixed top-6 left-6 z-50"><GlobalBackButton onClick={() => setStep("industry")} /></div>
        <div className="max-w-3xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tell Us About Your Business</h2>
            <p className="text-slate-400">This information helps us create a personalized strategy.</p>
          </motion.div>
          {error && (
            <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
              <p className="text-sm text-red-300"><strong>Error:</strong> {error}</p>
              <p className="text-xs text-slate-400 mt-2">Redirecting in 3 seconds...</p>
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Business Name *</label>
              <input type="text" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#6366f1]" placeholder="e.g., Bright Dental Clinic" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
              <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#6366f1]" placeholder="https://yourwebsite.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Country *</label>
              <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#6366f1]" placeholder="e.g., United Kingdom" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Audience</label>
              <textarea value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} rows={3} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#6366f1] resize-none" placeholder="Describe your ideal customer..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Business Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#6366f1] resize-none" placeholder="Tell us about your products, services..." />
            </div>
            <div className="pt-6">
              <button onClick={handleGenerateStrategy} disabled={!formData.businessName || !formData.country} className="w-full rounded-lg bg-[#6366f1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5558e6] disabled:opacity-50 disabled:cursor-not-allowed">
                Generate My Strategy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "generating") {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#6366f1]/30 mb-8">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold mb-2">
            Generating Your Strategy
          </motion.h2>
          <p className="text-slate-400">Analyzing your market and competitors with AI...</p>
          <p className="text-xs text-slate-500 mt-4">Powered by AI (local generation)</p>
        </div>
      </div>
    );
  }

  return null;
}