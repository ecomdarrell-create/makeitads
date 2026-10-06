'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { SiApple, SiGoogle } from 'react-icons/si';

export function AuthProviderButtons() {
  const [provider, setProvider] = useState<'Google' | 'Apple' | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" onClick={() => setProvider('Google')} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">
          <SiGoogle className="h-3.5 w-3.5" /> Google
        </button>
        <button type="button" onClick={() => setProvider('Apple')} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">
          <SiApple className="h-4 w-4" /> Apple
        </button>
      </div>

      {provider && (
        <div role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setProvider(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="provider-coming-soon" className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-2xl">
            <button type="button" aria-label="Fermer" onClick={() => setProvider(null)} className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600">Connexion {provider}</p>
            <h2 id="provider-coming-soon" className="mt-2 text-lg font-semibold text-slate-900">Bientôt disponible</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">La connexion avec {provider} sera activée prochainement.</p>
            <button type="button" onClick={() => setProvider(null)} className="mt-5 inline-flex min-h-9 items-center justify-center rounded-full bg-indigo-600 px-5 text-xs font-semibold text-white hover:bg-indigo-700">Compris</button>
          </section>
        </div>
      )}
    </>
  );
}
