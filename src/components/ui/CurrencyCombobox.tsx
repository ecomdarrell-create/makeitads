'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown, X } from 'lucide-react';
import { CURRENCY_INFO, REGION_LABELS, type CurrencyInfo } from '@/lib/currency';

interface CurrencyComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CurrencyCombobox({
  value,
  onChange,
  placeholder = 'Sélectionnez votre devise…',
}: CurrencyComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value ? CURRENCY_INFO[value] : null;

  const grouped = useMemo(() => {
    const filtered = Object.values(CURRENCY_INFO).filter((c) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.label.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
      );
    });

    return filtered.reduce<Record<string, CurrencyInfo[]>>((acc, c) => {
      if (!acc[c.region]) acc[c.region] = [];
      acc[c.region].push(c);
      return acc;
    }, {});
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        {selected ? (
          <span className="flex items-center gap-2.5 truncate">
            {/* ✅ DRAPEAU CIRCULAIRE (Emoji bien centré) */}
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-50 text-[13px] leading-none">
              {selected.flag}
            </span>
            <span className="font-medium text-slate-900">
              {selected.code} · {selected.symbol}
            </span>
            <span className="truncate text-xs text-slate-500">{selected.label}</span>
          </span>
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 max-h-80 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une devise…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {Object.keys(grouped).length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-slate-400">
                Aucune devise trouvée
              </p>
            ) : (
              Object.entries(grouped).map(([region, currencies]) => (
                <div key={region} className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {REGION_LABELS[region] ?? region}
                  </p>
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelect(c.code)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50 ${
                        value === c.code ? 'bg-[#6366F1]/10' : ''
                      }`}
                    >
                      {/* ✅ DRAPEAU CIRCULAIRE DANS LA LISTE */}
                      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-50 text-[13px] leading-none">
                        {c.flag}
                      </span>
                      <span className="flex-1 text-sm text-slate-900">
                        <span className="font-semibold">{c.code}</span>
                        <span className="ml-1.5 text-slate-500">· {c.label}</span>
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {c.symbol}
                      </span>
                      {value === c.code && (
                        <Check className="h-3.5 w-3.5 text-[#6366F1]" />
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}