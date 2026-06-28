"use client";

import { useState, useMemo } from "react";
import { Search, Check, Globe } from "lucide-react";
import { ALL_COUNTRIES } from "@/lib/constants/strategy";

interface CountrySelectorProps {
  selectedCountry: string;
  onSelect: (country: string) => void;
}

export default function CountrySelector({ selectedCountry, onSelect }: CountrySelectorProps) {
  const [search, setSearch] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [customCountry, setCustomCountry] = useState("");

  const filteredCountries = useMemo(() => {
    return ALL_COUNTRIES.filter((c) =>
      c.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleCustomConfirm = () => {
    if (customCountry.trim()) {
      onSelect(customCountry.trim());
      setShowCustom(false);
      setCustomCountry("");
      setSearch("");
    }
  };

  if (showCustom) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/5">
          <p className="text-sm text-[#8b5cf6] mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Enter your country name
          </p>
          <input 
            type="text" 
            value={customCountry} 
            onChange={(e) => setCustomCountry(e.target.value)} 
            placeholder="e.g., Luxembourg, Monaco, etc." 
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors" 
            onKeyDown={(e) => { if (e.key === "Enter") handleCustomConfirm(); }} 
          />
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setShowCustom(false); setCustomCountry(""); }} className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={handleCustomConfirm} disabled={!customCountry.trim()} className="flex-1 rounded-lg bg-[#6366f1] px-4 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all">
            Confirm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search countries..." 
          className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors" 
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 max-h-[300px] overflow-y-auto pr-2">
        {filteredCountries.map((c) => (
          <button 
            key={c} 
            onClick={() => onSelect(c)} 
            className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all text-left truncate ${
              selectedCountry === c 
                ? "border-[#6366f1] bg-[#6366f1]/10 text-white" 
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
            }`}
          >
            {selectedCountry === c && <Check className="inline h-3 w-3 mr-1" />}
            {c}
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => setShowCustom(true)} 
        className="w-full rounded-xl border border-dashed border-[#6366f1]/50 bg-[#6366f1]/5 px-4 py-3 text-sm font-medium text-[#8b5cf6] hover:bg-[#6366f1]/10 transition-all flex items-center justify-center gap-2"
      >
        <Globe className="h-4 w-4" />
        My country is not listed — Type it manually
      </button>

      {selectedCountry && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-sm text-emerald-400 flex items-center gap-2">
            <Check className="h-4 w-4" />
            Selected: <span className="font-bold">{selectedCountry}</span>
          </p>
        </div>
      )}
    </div>
  );
}