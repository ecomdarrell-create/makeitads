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

export function AuthPasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-14 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setVisible((v) => !v);
          }}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 z-20 flex w-12 cursor-pointer items-center justify-center rounded-r-xl text-slate-500 transition-colors select-none hover:text-indigo-700 active:text-indigo-800 active:scale-95"
          style={{
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
        >
          <span className="pointer-events-none flex items-center justify-center">
            {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </span>
        </button>
      </div>
    </div>
  );
}