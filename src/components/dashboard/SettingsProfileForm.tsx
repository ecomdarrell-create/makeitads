'use client';

import { FormEvent, useState } from 'react';
import { Check, LoaderCircle, Save } from 'lucide-react';

interface SettingsProfileFormProps {
  firstName: string;
  lastName: string;
  currency: string; // ✅ Modifié de 'country' à 'currency'
}

export function SettingsProfileForm({ firstName, lastName, currency }: SettingsProfileFormProps) {
  const [form, setForm] = useState({ 
    firstName, 
    lastName, 
    currency: currency || 'XOF' // Fallback sécurisé
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/profile/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form), // ✅ Envoie maintenant { firstName, lastName, currency }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Échec de l’enregistrement.');
      
      setMessage('Profil enregistré avec succès.');
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'Échec de l’enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  // Classes conservées pour la cohérence, légèrement optimisées pour le confort visuel
  const inputClass = 'min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400';
  const labelClass = 'mb-1.5 block text-xs font-medium text-slate-700';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-first-name" className={labelClass}>Prénom</label>
          <input 
            id="profile-first-name" 
            required 
            maxLength={80} 
            value={form.firstName} 
            onChange={(event) => setForm({ ...form, firstName: event.target.value })} 
            className={inputClass} 
            placeholder="Jean"
          />
        </div>
        <div>
          <label htmlFor="profile-last-name" className={labelClass}>Nom</label>
          <input 
            id="profile-last-name" 
            maxLength={80} 
            value={form.lastName} 
            onChange={(event) => setForm({ ...form, lastName: event.target.value })} 
            className={inputClass} 
            placeholder="Dupont"
          />
        </div>
      </div>
      
      {/* ✅ CHAMP DEVISE REMPLACE LE PAYS */}
      <div>
        <label htmlFor="profile-currency" className={labelClass}>Devise de facturation</label>
        <select
          id="profile-currency"
          value={form.currency}
          onChange={(event) => setForm({ ...form, currency: event.target.value })}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="XOF">Franc CFA (XAF / XOF)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">Dollar US (USD)</option>
        </select>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
          Cette devise sera utilisée pour afficher les prix, les crédits et les factures dans votre espace.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <p aria-live="polite" className={`text-xs font-medium ${isError ? 'text-rose-600' : 'text-emerald-600'}`}>
          {message}
        </p>
        <button 
          type="submit" 
          disabled={loading} 
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-xs font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60 shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : message && !isError ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {loading ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}