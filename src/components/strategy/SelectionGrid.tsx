"use client";

import { Check } from "lucide-react";

interface SelectionGridProps {
  options: string[] | { id: string; name: string; description?: string }[];
  selected: string | string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  type?: "simple" | "card"; // "simple" = juste du texte, "card" = titre + description
}

export default function SelectionGrid({ options, selected, onSelect, multiSelect = false, type = "simple" }: SelectionGridProps) {
  const isSelected = (val: string) => {
    if (multiSelect) return (selected as string[]).includes(val);
    return selected === val;
  };

  return (
    <div className={`grid gap-3 ${
      type === "card" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
    }`}>
      {options.map((opt) => {
        const value = typeof opt === "string" ? opt : opt.id;
        const label = typeof opt === "string" ? opt : opt.name;
        const desc = typeof opt === "string" ? undefined : opt.description;
        const active = isSelected(value);

        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${
              active 
                ? "border-[#6366f1] bg-[#6366f1]/10 text-white" 
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
            }`}
          >
            {type === "card" ? (
              <>
                <p className="text-sm font-bold text-white mb-1">{label}</p>
                {desc && <p className="text-xs text-slate-400">{desc}</p>}
              </>
            ) : (
              <div className="flex items-center gap-2">
                {active && <Check className="h-4 w-4 text-[#6366f1]" />}
                <span className="text-sm font-medium">{label}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}