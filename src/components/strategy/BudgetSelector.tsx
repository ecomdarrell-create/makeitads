"use client";

import { motion } from "framer-motion";
import { DollarSign, Info } from "lucide-react";
import { BUDGET_EXPLANATION } from "@/lib/constants/strategy";

interface BudgetSelectorProps {
  budget: number;
  onChange: (budget: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function BudgetSelector({
  budget,
  onChange,
  min = 500,
  max = 25000,
  step = 500,
}: BudgetSelectorProps) {
  const percentage = ((budget - min) / (max - min)) * 100;

  return (
    <div className="space-y-6">
      {/* Explication */}
      <div className="rounded-xl border border-[#6366f1]/20 bg-[#6366f1]/5 p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#6366f1]/20 flex items-center justify-center flex-shrink-0">
            <Info className="h-4 w-4 text-[#8b5cf6]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">{BUDGET_EXPLANATION.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{BUDGET_EXPLANATION.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <DollarSign className="h-6 w-6 text-[#8b5cf6]" />
          <span className="text-5xl font-bold text-white">{budget.toLocaleString()}</span>
          <span className="text-lg text-slate-400">/month</span>
        </div>

        <div className="relative w-full h-2 bg-white/10 rounded-full mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
            className="absolute h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full"
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={budget}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-transparent appearance-none cursor-pointer accent-[#6366f1]"
        />

        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>${min.toLocaleString()}</span>
          <span>${max.toLocaleString()}+</span>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { value: 500, label: "Starter", desc: "$500/mo" },
          { value: 1500, label: "Growth", desc: "$1,500/mo" },
          { value: 2500, label: "Professional", desc: "$2,500/mo" },
          { value: 5000, label: "Scale", desc: "$5,000/mo" },
        ].map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${
              budget === preset.value
                ? "border-[#6366f1] bg-[#6366f1]/10 text-white"
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
            }`}
          >
            <p className="text-sm font-bold text-white">{preset.label}</p>
            <p className="text-xs text-slate-400">{preset.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}