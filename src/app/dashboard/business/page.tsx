"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building2, Target, Users, Flag, Sparkles, Save, Loader2, Check
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { saveBusinessProfile, getBusinessProfile } from "@/lib/database";

const supabase = createClient();

const industries = [
  "E-commerce", "SaaS", "Beauty & Skincare", "Food & Beverage",
  "Fashion & Apparel", "Tech & Electronics", "Health & Wellness",
  "Education", "Real Estate", "Finance", "Travel & Hospitality",
  "Entertainment", "B2B Services", "Other",
];

const countries = [
  "United States", "United Kingdom", "France", "Germany", "Canada",
  "Australia", "Spain", "Italy", "Netherlands", "Belgium",
  "Switzerland", "Senegal", "Cameroon", "Ivory Coast", "Other",
];

const platforms = ["Meta (Facebook/Instagram)", "TikTok", "Google Ads", "LinkedIn", "Pinterest", "YouTube", "Twitter/X"];

export default function BusinessProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: "", website: "", industry: "", country: "",
    offerDescription: "", priceRange: "", targetAudience: "",
    mainGoal: "", revenueRange: "", platforms: [] as string[],
    usp: "", mainChallenge: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      
      const profile = await getBusinessProfile();
      if (profile) {
        setFormData({
          businessName: profile.business_name || "",
          website: profile.website || "",
          industry: profile.industry || "",
          country: profile.country || "",
          offerDescription: profile.offer_description || "",
          priceRange: profile.price_range || "",
          targetAudience: profile.target_audience || "",
          mainGoal: profile.main_goal || "",
          revenueRange: profile.revenue_range || "",
          platforms: profile.platforms || [],
          usp: profile.usp || "",
          mainChallenge: profile.main_challenge || "",
        });
      }
      setLoading(false);
    };
    loadProfile();
  }, [router]);

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setSaved(false);

    try {
      await saveBusinessProfile({
        business_name: formData.businessName,
        website: formData.website,
        industry: formData.industry,
        country: formData.country,
        offer_description: formData.offerDescription,
        price_range: formData.priceRange,
        target_audience: formData.targetAudience,
        main_goal: formData.mainGoal,
        revenue_range: formData.revenueRange,
        platforms: formData.platforms,
        usp: formData.usp,
        main_challenge: formData.mainChallenge,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1]" />
      </div>
    );
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-[#080810] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 placeholder:text-slate-600";
  const labelClass = "block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Business Profile</h1>
            <p className="text-slate-400 text-sm">Your AI strategist remembers everything about your business</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-[#6366f1]/20 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 p-5 flex items-start gap-4">
        <Sparkles className="h-5 w-5 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white mb-1">Why this matters</p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike ChatGPT, MakeItAds permanently remembers your business context. Every strategy you generate automatically pulls from this profile — you never re-type your business details.
          </p>
        </div>
      </motion.div>

      <motion.form onSubmit={(e) => { e.preventDefault(); handleSave(); }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#8b5cf6]" /> Core Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Business Name *</label>
              <input type="text" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} placeholder="e.g., Natural Beauty Co." className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input type="text" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Industry *</label>
              <select value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className={inputClass} required>
                <option value="">Select industry...</option>
                {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Country *</label>
              <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className={inputClass} required>
                <option value="">Select country...</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5" />

        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-400" /> Offer & Market
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Offer Description *</label>
              <textarea value={formData.offerDescription} onChange={(e) => setFormData({ ...formData, offerDescription: e.target.value })} rows={3} placeholder="Describe what you sell and its main benefits..." className={`${inputClass} resize-none`} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price Range</label>
                <input type="text" value={formData.priceRange} onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })} placeholder="e.g., $50 - $200" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Revenue Range</label>
                <select value={formData.revenueRange} onChange={(e) => setFormData({ ...formData, revenueRange: e.target.value })} className={inputClass}>
                  <option value="">Select range...</option>
                  <option value="< $10K/mo">Less than $10K/mo</option>
                  <option value="$10K - $50K/mo">$10K - $50K/mo</option>
                  <option value="$50K - $200K/mo">$50K - $200K/mo</option>
                  <option value="$200K - $1M/mo">$200K - $1M/mo</option>
                  <option value="> $1M/mo">More than $1M/mo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5" />

        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#38bdf8]" /> Audience & Goals
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Target Audience *</label>
              <textarea value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} rows={2} placeholder="e.g., Women 25-40, interested in organic beauty..." className={`${inputClass} resize-none`} required />
            </div>
            <div>
              <label className={labelClass}>Main Goal *</label>
              <select value={formData.mainGoal} onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })} className={inputClass} required>
                <option value="">Select your main goal...</option>
                <option value="Brand Awareness">Brand Awareness</option>
                <option value="Lead Generation">Lead Generation</option>
                <option value="Sales / Conversions">Sales / Conversions</option>
                <option value="Website Traffic">Website Traffic</option>
                <option value="App Installs">App Installs</option>
                <option value="Customer Retention">Customer Retention</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Main Platforms Used</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {platforms.map((platform) => (
                  <button key={platform} type="button" onClick={() => togglePlatform(platform)} className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${formData.platforms.includes(platform) ? "border-[#6366f1] bg-[#6366f1]/10 text-white" : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20"}`}>
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5" />

        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Flag className="h-4 w-4 text-amber-400" /> Differentiation & Challenges
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Unique Selling Proposition (USP)</label>
              <textarea value={formData.usp} onChange={(e) => setFormData({ ...formData, usp: e.target.value })} rows={2} placeholder="What makes you different from competitors?" className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Main Challenge</label>
              <textarea value={formData.mainChallenge} onChange={(e) => setFormData({ ...formData, mainChallenge: e.target.value })} rows={2} placeholder="What's your biggest marketing challenge right now?" className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>
      </motion.form>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sticky bottom-6 flex justify-end">
        <button onClick={handleSave} disabled={saving} className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#8b5cf6]/40 disabled:opacity-70">
          {saving ? (<><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>) : saved ? (<><Check className="h-4 w-4" /> Saved Successfully</>) : (<><Save className="h-4 w-4" /> Save Business Profile</>)}
        </button>
      </motion.div>
    </div>
  );
}