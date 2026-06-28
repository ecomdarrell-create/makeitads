"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Sliders, 
  Lock, 
  Crown, 
  Plus, 
  X, 
  Check, 
  TrendingUp,
  Zap
} from "lucide-react";
import { usePlan } from "@/hooks/usePlan";

// --- Mock Data ---
const initialInterests = ["Organic Beauty", "Wellness", "Sustainable Living", "Skincare Routine"];
const initialExclusions = ["Dropshipping", "Cheap Alternatives"];

const lookalikeOptions = [
  { id: "1", name: "1% Lookalike", desc: "Highly similar to your best customers", reach: "120K", cpm: "$4.20" },
  { id: "2", name: "3% Lookalike", desc: "Balanced reach and similarity", reach: "450K", cpm: "$2.80" },
  { id: "3", name: "5% Lookalike", desc: "Maximum reach for brand awareness", reach: "1.2M", cpm: "$1.50" },
];

const platformComparison = [
  { platform: "Meta", reach: "2.4M", cpm: "$3.50", cpc: "$0.45", bestFor: "Conversion & Retargeting" },
  { platform: "TikTok", reach: "1.8M", cpm: "$2.10", cpc: "$0.32", bestFor: "Viral Reach & Gen Z" },
  { platform: "Google", reach: "950K", cpm: "$5.20", cpc: "$0.85", bestFor: "High Intent Search" },
];

export default function AudienceLabPage() {
  const plan = usePlan();
  const isPro = plan?.type === "pro" || plan?.type === "premium";
  const isPremium = plan?.type === "premium";

  const [ageRange, setAgeRange] = useState([25, 40]);
  const [gender, setGender] = useState("All");
  const [interests, setInterests] = useState(initialInterests);
  const [exclusions, setExclusions] = useState(initialExclusions);

  const removeInterest = (item: string) => setInterests(interests.filter(i => i !== item));
  const removeExclusion = (item: string) => setExclusions(exclusions.filter(i => i !== item));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Audience Lab</h1>
          <p className="text-slate-400 mt-1">Refine your targeting with surgical precision</p>
        </div>
        {!isPro && (
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform">
            <Crown className="h-4 w-4" />
            Upgrade to Pro
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0f0f1a] p-8 overflow-hidden">
        
        {/* Gating Overlay for Free Users */}
        {!isPro && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-[#0f0f1a]/70 backdrop-blur-md">
            <div className="text-center px-4 max-w-md">
              <Users className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-white mb-2">Audience Lab is a Pro feature</p>
              <p className="text-sm text-slate-400 mb-4">
                Build custom audiences, use AI lookalikes, and compare platforms to maximize your ROI.
              </p>
              <button className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform">
                Unlock Audience Lab
              </button>
            </div>
          </div>
        )}

        <div className={`${!isPro ? "blur-sm select-none pointer-events-none" : ""} space-y-8`}>
          
          {/* Section 1: Audience Builder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Demographics */}
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#8b5cf6]" />
                Demographics
              </h3>
              
              {/* Age Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Age Range</label>
                  <span className="text-sm font-bold text-white">{ageRange[0]} - {ageRange[1]} years</span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full"
                    style={{ left: `${(ageRange[0] / 65) * 100}%`, right: `${100 - (ageRange[1] / 65) * 100}%` }}
                  />
                  <input 
                    type="range" min="18" max="65" value={ageRange[0]} 
                    onChange={(e) => setAgeRange([Math.min(Number(e.target.value), ageRange[1] - 1), ageRange[1]])}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                  />
                  <input 
                    type="range" min="18" max="65" value={ageRange[1]} 
                    onChange={(e) => setAgeRange([ageRange[0], Math.max(Number(e.target.value), ageRange[0] + 1)])}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Gender</label>
                <div className="flex gap-2">
                  {["All", "Men", "Women"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        gender === g
                          ? "border-[#6366f1] bg-[#6366f1]/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interests & Exclusions */}
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-emerald-400" />
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {interests.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                      {item}
                      <button onClick={() => removeInterest(item)} className="hover:text-white transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-white/20 hover:text-slate-200 transition-all">
                    <Plus className="h-3 w-3" />
                    Add Interest
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                  <X className="h-4 w-4 text-red-400" />
                  Exclusions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exclusions.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300">
                      {item}
                      <button onClick={() => removeExclusion(item)} className="hover:text-white transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Lookalike Suggestions (Premium) */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            {!isPremium && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-md">
                <div className="text-center px-4">
                  <Crown className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-lg font-bold text-white mb-2">Lookalike Audiences</p>
                  <p className="text-sm text-slate-400 mb-4">Let AI find new customers similar to your best ones.</p>
                  <button className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform">
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            )}

            <div className={`${!isPremium ? "blur-sm select-none pointer-events-none" : ""}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-white">AI Lookalike Suggestions</h3>
                <span className="rounded-full bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a78bfa]">
                  Premium
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lookalikeOptions.map((opt) => (
                  <div key={opt.id} className="rounded-xl border border-white/10 bg-[#0f0f1a] p-4 hover:border-[#6366f1]/30 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{opt.name}</span>
                      <button className="rounded-md bg-white/5 p-1 text-slate-400 hover:bg-[#6366f1] hover:text-white transition-all">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{opt.desc}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">Reach</p>
                        <p className="text-xs font-bold text-white">{opt.reach}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">Est. CPM</p>
                        <p className="text-xs font-bold text-emerald-400">{opt.cpm}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Multi-Platform Comparison (Premium) */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            {!isPremium && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-md">
                <div className="text-center px-4">
                  <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-lg font-bold text-white mb-2">Multi-Platform Comparison</p>
                  <p className="text-sm text-slate-400 mb-4">See how your audience performs across all major networks.</p>
                  <button className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform">
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            )}

            <div className={`${!isPremium ? "blur-sm select-none pointer-events-none" : ""}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-white">Platform Performance Forecast</h3>
                <span className="rounded-full bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a78bfa]">
                  Premium
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Platform</th>
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Est. Reach</th>
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">CPM</th>
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">CPC</th>
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {platformComparison.map((row) => (
                      <tr key={row.platform} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 text-sm font-bold text-white">{row.platform}</td>
                        <td className="py-4 text-sm text-slate-300">{row.reach}</td>
                        <td className="py-4 text-sm font-bold text-[#8b5cf6]">{row.cpm}</td>
                        <td className="py-4 text-sm text-slate-300">{row.cpc}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-slate-300">
                            <Zap className="h-3 w-3 text-amber-400" />
                            {row.bestFor}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}