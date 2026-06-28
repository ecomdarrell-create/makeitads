"use client";

import { motion } from "framer-motion";
import { 
  Palette, 
  Image as ImageIcon, 
  Type, 
  Lock, 
  Crown, 
  Zap, 
  Cpu, 
  ShoppingBag, 
  Utensils, 
  Heart, 
  Briefcase,
  ArrowRight,
  Wand2
} from "lucide-react";
import { usePlan } from "@/hooks/usePlan";

const enrichedBrief = {
  colors: [
    { hex: "#6366f1", name: "Indigo Primary" },
    { hex: "#f8fafc", name: "Clean White" },
    { hex: "#0f172a", name: "Deep Slate" },
    { hex: "#10b981", name: "Accent Green" },
  ],
  mood: ["Minimalist & Clean", "High-Contrast Typography", "Natural Lighting", "Product-Focused Close-ups"],
  layoutExamples: [
    { title: "Hero Banner", desc: "Product centered, bold headline on left, CTA on right. Dark background." },
    { title: "Carousel Ad", desc: "5 slides. Slide 1: Hook. Slide 2-4: Benefits. Slide 5: Social Proof + CTA." },
    { title: "Story Format", desc: "Full-screen video. Fast cuts (2s). Text overlays in center. Trending audio." }
  ]
};

const sectorTemplates = [
  { name: "Beauty & Skincare", icon: Heart, desc: "Soft lighting, clean aesthetics, focus on texture." },
  { name: "SaaS & Tech", icon: Cpu, desc: "Dark mode UI shots, bold gradients, clear value prop." },
  { name: "E-commerce & Fashion", icon: ShoppingBag, desc: "Lifestyle shots, dynamic angles, seasonal vibes." },
  { name: "Food & Beverage", icon: Utensils, desc: "Macro shots, vibrant colors, appetite-inducing." },
  { name: "B2B Services", icon: Briefcase, desc: "Professional, trust-building, data-driven visuals." },
];

export default function CreativeStudioPage() {
  const { isPro, isPremium, isEnterprise, isPaid, isFree } = usePlan();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ad Copy & Visuals</h1>
          <p className="text-slate-400 mt-1">Agency-grade visual briefs and creative direction</p>
        </div>
        {!isPremium && !isEnterprise && (
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform">
            <Crown className="h-4 w-4" />
            Upgrade to Premium
          </button>
        )}
      </div>

      {/* Section A: Enriched Visual Brief (Débloqué pour tous) */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Wand2 className="h-5 w-5 text-[#8b5cf6]" />
          <h2 className="text-xl font-bold text-white">Generated Visual Brief</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Color Palette
            </h3>
            <div className="space-y-3">
              {enrichedBrief.colors.map((color) => (
                <div key={color.hex} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg border border-white/10 shadow-inner" style={{ backgroundColor: color.hex }} />
                  <div>
                    <p className="text-sm font-bold text-white">{color.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Mood & References
            </h3>
            <div className="space-y-2">
              {enrichedBrief.mood.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6]" />
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
              <Type className="h-4 w-4" /> Layout Guides
            </h3>
            <div className="space-y-4">
              {enrichedBrief.layoutExamples.map((layout) => (
                <div key={layout.title} className="pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <p className="text-sm font-bold text-white mb-1">{layout.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{layout.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section B: Sector Templates Library (Premium - Verrouillé) */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        {!isPremium && !isEnterprise && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-md">
            <div className="text-center px-4">
              <Crown className="h-8 w-8 text-slate-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-white mb-2">Agency-Grade Templates</p>
              <p className="text-sm text-slate-400 mb-4">Access pre-built creative briefs for your specific industry.</p>
              <button className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform">
                Upgrade to Premium
              </button>
            </div>
          </div>
        )}

        <div className={`${!isPremium && !isEnterprise ? "blur-sm select-none pointer-events-none" : ""}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white">Creative Brief Library by Sector</h3>
            <span className="rounded-full bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a78bfa]">
              Premium
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorTemplates.map((template) => (
              <div key={template.name} className="group rounded-xl border border-white/10 bg-[#0f0f1a] p-5 hover:border-[#6366f1]/30 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 text-[#a78bfa]">
                    <template.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{template.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{template.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section C: Soon - AI Visual Generation (Premium - Verrouillé) */}
      <div className="relative rounded-2xl border border-dashed border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 p-8">
        {!isPremium && !isEnterprise && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-md">
            <div className="text-center px-4">
              <Zap className="h-8 w-8 text-slate-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-white mb-2">AI Visual Generation</p>
              <p className="text-sm text-slate-400 mb-4">Generate actual ad creatives directly from your briefs.</p>
              <button className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform">
                Upgrade to Premium
              </button>
            </div>
          </div>
        )}

        <div className={`${!isPremium && !isEnterprise ? "blur-sm select-none pointer-events-none" : ""} flex items-center gap-6`}>
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-xl shadow-[#6366f1]/30">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">Soon: AI Visual Generation</h3>
              <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400">
                V2
              </span>
            </div>
            <p className="text-sm text-slate-300">
              We're integrating Replicate to let you generate high-converting ad images directly from your text briefs. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}