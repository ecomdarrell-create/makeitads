'use client';

import { FormEvent, useState } from 'react';
import { Check, LoaderCircle, Save } from 'lucide-react';

interface SettingsProfileFormProps {
  firstName: string;
  lastName: string;
  phone: string;
  currency: string;
}

export function SettingsProfileForm({
  firstName,
  lastName,
  phone,
  currency,
}: SettingsProfileFormProps) {
  const [form, setForm] = useState({
    firstName,
    lastName,
    phone: phone || '',
    currency: currency || 'XOF',
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
        body: JSON.stringify(form),
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

  const inputClass =
    'min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 sm:min-h-11 sm:text-sm';
  const labelClass = 'mb-1.5 block text-[11px] font-medium text-slate-700 sm:text-xs';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <label htmlFor="profile-first-name" className={labelClass}>
            Prénom
          </label>
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
          <label htmlFor="profile-last-name" className={labelClass}>
            Nom
          </label>
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

      <div>
        <label htmlFor="profile-phone" className={labelClass}>
          Téléphone
        </label>
        <input
          id="profile-phone"
          type="tel"
          maxLength={20}
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
          className={inputClass}
          placeholder="+237 6XX XX XX XX"
        />
        <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
          Utilisé uniquement pour les informations importantes liées à votre compte.
        </p>
      </div>

      <div>
        <label htmlFor="profile-currency" className={labelClass}>
          Devise de facturation
        </label>
        <select
          id="profile-currency"
          value={form.currency}
          onChange={(event) => setForm({ ...form, currency: event.target.value })}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="XAF">Franc CFA CEMAC (XAF)</option>
          <option value="XOF">Franc CFA UEMOA (XOF)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">Dollar US (USD)</option>
        </select>
        <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
          Cette devise sera utilisée pour afficher les prix, les crédits et les factures dans votre espace.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
        <p
          aria-live="polite"
          className={`text-[11px] font-medium sm:text-xs ${
            isError ? 'text-rose-600' : 'text-emerald-600'
          }`}
        >
          {message}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 sm:min-h-11 sm:w-auto sm:text-xs"
        >
          {loading ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
          ) : message && !isError ? (
            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
          {loading ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}