'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthPasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
}

export function AuthPasswordField({ id, label, value, onChange, autoComplete }: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-11 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-1 flex w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-50 hover:text-indigo-700"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
