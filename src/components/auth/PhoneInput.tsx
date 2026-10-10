'use client';

import { useMemo } from 'react';

// ============================================
// BASE DE DONNÉES DES CODES PAYS
// ============================================

interface Country {
  code: string;
  flag: string;
  name: string;
  dial: string;
}

const COUNTRIES: Country[] = [
  // Afrique francophone
  { code: 'CM', flag: '🇨🇲', name: 'Cameroun', dial: '237' },
  { code: 'CI', flag: '🇨🇮', name: 'Côte d\'Ivoire', dial: '225' },
  { code: 'SN', flag: '🇸🇳', name: 'Sénégal', dial: '221' },
  { code: 'ML', flag: '🇲🇱', name: 'Mali', dial: '223' },
  { code: 'BF', flag: '🇧🇫', name: 'Burkina Faso', dial: '226' },
  { code: 'TG', flag: '🇹🇬', name: 'Togo', dial: '228' },
  { code: 'BJ', flag: '🇧🇯', name: 'Bénin', dial: '229' },
  { code: 'NE', flag: '🇳🇪', name: 'Niger', dial: '227' },
  { code: 'GN', flag: '🇬🇳', name: 'Guinée', dial: '224' },
  { code: 'CD', flag: '🇨🇩', name: 'RD Congo', dial: '243' },
  { code: 'CG', flag: '🇨🇬', name: 'Congo', dial: '242' },
  { code: 'GA', flag: '🇬🇦', name: 'Gabon', dial: '241' },
  { code: 'CF', flag: '🇨🇫', name: 'Centrafrique', dial: '236' },
  { code: 'TD', flag: '🇹🇩', name: 'Tchad', dial: '235' },
  { code: 'MR', flag: '🇲🇷', name: 'Mauritanie', dial: '222' },
  { code: 'MG', flag: '🇲🇬', name: 'Madagascar', dial: '261' },
  { code: 'RW', flag: '🇷🇼', name: 'Rwanda', dial: '250' },
  { code: 'BI', flag: '🇧🇮', name: 'Burundi', dial: '257' },
  { code: 'DJ', flag: '🇩🇯', name: 'Djibouti', dial: '253' },
  { code: 'KM', flag: '🇰🇲', name: 'Comores', dial: '269' },
  // Afrique anglophone
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria', dial: '234' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana', dial: '233' },
  { code: 'KE', flag: '🇰🇪', name: 'Kenya', dial: '254' },
  { code: 'ZA', flag: '🇿🇦', name: 'Afrique du Sud', dial: '27' },
  { code: 'UG', flag: '🇺🇬', name: 'Ouganda', dial: '256' },
  { code: 'TZ', flag: '🇹🇿', name: 'Tanzanie', dial: '255' },
  // Maghreb
  { code: 'MA', flag: '🇲🇦', name: 'Maroc', dial: '212' },
  { code: 'DZ', flag: '🇩🇿', name: 'Algérie', dial: '213' },
  { code: 'TN', flag: '🇹🇳', name: 'Tunisie', dial: '216' },
  // Europe / Amérique
  { code: 'FR', flag: '🇫🇷', name: 'France', dial: '33' },
  { code: 'BE', flag: '🇧🇪', name: 'Belgique', dial: '32' },
  { code: 'CH', flag: '🇨🇭', name: 'Suisse', dial: '41' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada', dial: '1' },
  { code: 'US', flag: '🇺🇸', name: 'États-Unis', dial: '1' },
  { code: 'GB', flag: '🇬🇧', name: 'Royaume-Uni', dial: '44' },
  { code: 'DE', flag: '🇩🇪', name: 'Allemagne', dial: '49' },
  { code: 'ES', flag: '🇪🇸', name: 'Espagne', dial: '34' },
  { code: 'IT', flag: '🇮🇹', name: 'Italie', dial: '39' },
  { code: 'PT', flag: '🇵🇹', name: 'Portugal', dial: '351' },
];

// ============================================
// DÉTECTION DU PAYS
// ============================================

function detectCountry(value: string): Country | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 1) return null;

  // Tester les codes à 1, 2, puis 3 chiffres
  for (const len of [3, 2, 1]) {
    const prefix = digits.slice(0, len);
    const found = COUNTRIES.find((c) => c.dial === prefix);
    if (found) return found;
  }
  return null;
}

// ============================================
// COMPOSANT
// ============================================

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
}

export function PhoneInput({
  value,
  onChange,
  id = 'phone',
  placeholder = '237 6XX XX XX XX',
}: PhoneInputProps) {
  const detectedCountry = useMemo(() => detectCountry(value), [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // On accepte chiffres, espaces, tirets
    const raw = e.target.value.replace(/[^\d\s\-]/g, '');
    onChange(raw);
  };

  return (
    <div className="relative">
      {/* Préfixe + */}
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500"
        aria-hidden="true"
      >
        +
      </span>

      {/* Drapeau détecté */}
      {detectedCountry && (
        <span
          className="pointer-events-none absolute left-7 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-[11px] transition-opacity duration-200"
          aria-label={detectedCountry.name}
          title={detectedCountry.name}
        >
          {detectedCountry.flag}
        </span>
      )}

      <input
        id={id}
        type="tel"
        inputMode="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`min-h-10 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm ${
          detectedCountry ? 'pl-14' : 'pl-8'
        } pr-3.5`}
      />
    </div>
  );
}