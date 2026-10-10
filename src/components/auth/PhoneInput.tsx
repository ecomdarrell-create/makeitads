'use client';

import { useMemo, useState } from 'react';

// ============================================
// BASE DE DONNÉES DES CODES PAYS (monde entier)
// ============================================

interface Country {
  code: string; // ISO 3166-1 alpha-2 (lowercase pour le CDN)
  name: string;
  dial: string;
}

const COUNTRIES: Country[] = [
  // ─── Afrique ───
  { code: 'dz', name: 'Algérie', dial: '213' },
  { code: 'ao', name: 'Angola', dial: '244' },
  { code: 'bj', name: 'Bénin', dial: '229' },
  { code: 'bw', name: 'Botswana', dial: '267' },
  { code: 'bf', name: 'Burkina Faso', dial: '226' },
  { code: 'bi', name: 'Burundi', dial: '257' },
  { code: 'cm', name: 'Cameroun', dial: '237' },
  { code: 'cv', name: 'Cap-Vert', dial: '238' },
  { code: 'cf', name: 'Centrafrique', dial: '236' },
  { code: 'km', name: 'Comores', dial: '269' },
  { code: 'cg', name: 'Congo', dial: '242' },
  { code: 'cd', name: 'RD Congo', dial: '243' },
  { code: 'ci', name: "Côte d'Ivoire", dial: '225' },
  { code: 'dj', name: 'Djibouti', dial: '253' },
  { code: 'eg', name: 'Égypte', dial: '20' },
  { code: 'er', name: 'Érythrée', dial: '291' },
  { code: 'sz', name: 'Eswatini', dial: '268' },
  { code: 'et', name: 'Éthiopie', dial: '251' },
  { code: 'ga', name: 'Gabon', dial: '241' },
  { code: 'gm', name: 'Gambie', dial: '220' },
  { code: 'gh', name: 'Ghana', dial: '233' },
  { code: 'gn', name: 'Guinée', dial: '224' },
  { code: 'gw', name: 'Guinée-Bissau', dial: '245' },
  { code: 'gq', name: 'Guinée équatoriale', dial: '240' },
  { code: 'ke', name: 'Kenya', dial: '254' },
  { code: 'ls', name: 'Lesotho', dial: '266' },
  { code: 'lr', name: 'Liberia', dial: '231' },
  { code: 'ly', name: 'Libye', dial: '218' },
  { code: 'mg', name: 'Madagascar', dial: '261' },
  { code: 'mw', name: 'Malawi', dial: '265' },
  { code: 'ml', name: 'Mali', dial: '223' },
  { code: 'ma', name: 'Maroc', dial: '212' },
  { code: 'mu', name: 'Maurice', dial: '230' },
  { code: 'mr', name: 'Mauritanie', dial: '222' },
  { code: 'mz', name: 'Mozambique', dial: '258' },
  { code: 'na', name: 'Namibie', dial: '264' },
  { code: 'ne', name: 'Niger', dial: '227' },
  { code: 'ng', name: 'Nigeria', dial: '234' },
  { code: 'ug', name: 'Ouganda', dial: '256' },
  { code: 'rw', name: 'Rwanda', dial: '250' },
  { code: 'st', name: 'Sao Tomé-et-Principe', dial: '239' },
  { code: 'sn', name: 'Sénégal', dial: '221' },
  { code: 'sc', name: 'Seychelles', dial: '248' },
  { code: 'sl', name: 'Sierra Leone', dial: '232' },
  { code: 'so', name: 'Somalie', dial: '252' },
  { code: 'za', name: 'Afrique du Sud', dial: '27' },
  { code: 'ss', name: 'Soudan du Sud', dial: '211' },
  { code: 'sd', name: 'Soudan', dial: '249' },
  { code: 'tz', name: 'Tanzanie', dial: '255' },
  { code: 'td', name: 'Tchad', dial: '235' },
  { code: 'tg', name: 'Togo', dial: '228' },
  { code: 'tn', name: 'Tunisie', dial: '216' },
  { code: 'zm', name: 'Zambie', dial: '260' },
  { code: 'zw', name: 'Zimbabwe', dial: '263' },

  // ─── Europe ───
  { code: 'al', name: 'Albanie', dial: '355' },
  { code: 'ad', name: 'Andorre', dial: '376' },
  { code: 'de', name: 'Allemagne', dial: '49' },
  { code: 'at', name: 'Autriche', dial: '43' },
  { code: 'be', name: 'Belgique', dial: '32' },
  { code: 'by', name: 'Biélorussie', dial: '375' },
  { code: 'ba', name: 'Bosnie-Herzégovine', dial: '387' },
  { code: 'bg', name: 'Bulgarie', dial: '359' },
  { code: 'cy', name: 'Chypre', dial: '357' },
  { code: 'hr', name: 'Croatie', dial: '385' },
  { code: 'dk', name: 'Danemark', dial: '45' },
  { code: 'es', name: 'Espagne', dial: '34' },
  { code: 'ee', name: 'Estonie', dial: '372' },
  { code: 'fi', name: 'Finlande', dial: '358' },
  { code: 'fr', name: 'France', dial: '33' },
  { code: 'gr', name: 'Grèce', dial: '30' },
  { code: 'hu', name: 'Hongrie', dial: '36' },
  { code: 'ie', name: 'Irlande', dial: '353' },
  { code: 'is', name: 'Islande', dial: '354' },
  { code: 'it', name: 'Italie', dial: '39' },
  { code: 'xk', name: 'Kosovo', dial: '383' },
  { code: 'lv', name: 'Lettonie', dial: '371' },
  { code: 'li', name: 'Liechtenstein', dial: '423' },
  { code: 'lt', name: 'Lituanie', dial: '370' },
  { code: 'lu', name: 'Luxembourg', dial: '352' },
  { code: 'mk', name: 'Macédoine du Nord', dial: '389' },
  { code: 'mt', name: 'Malte', dial: '356' },
  { code: 'md', name: 'Moldavie', dial: '373' },
  { code: 'mc', name: 'Monaco', dial: '377' },
  { code: 'me', name: 'Monténégro', dial: '382' },
  { code: 'no', name: 'Norvège', dial: '47' },
  { code: 'nl', name: 'Pays-Bas', dial: '31' },
  { code: 'pl', name: 'Pologne', dial: '48' },
  { code: 'pt', name: 'Portugal', dial: '351' },
  { code: 'cz', name: 'République tchèque', dial: '420' },
  { code: 'ro', name: 'Roumanie', dial: '40' },
  { code: 'gb', name: 'Royaume-Uni', dial: '44' },
  { code: 'ru', name: 'Russie', dial: '7' },
  { code: 'sm', name: 'Saint-Marin', dial: '378' },
  { code: 'rs', name: 'Serbie', dial: '381' },
  { code: 'sk', name: 'Slovaquie', dial: '421' },
  { code: 'si', name: 'Slovénie', dial: '386' },
  { code: 'se', name: 'Suède', dial: '46' },
  { code: 'ch', name: 'Suisse', dial: '41' },
  { code: 'ua', name: 'Ukraine', dial: '380' },
  { code: 'va', name: 'Vatican', dial: '379' },

  // ─── Amériques ───
  { code: 'ag', name: 'Antigua-et-Barbuda', dial: '1268' },
  { code: 'ar', name: 'Argentine', dial: '54' },
  { code: 'bs', name: 'Bahamas', dial: '1242' },
  { code: 'bb', name: 'Barbade', dial: '1246' },
  { code: 'bz', name: 'Belize', dial: '501' },
  { code: 'bo', name: 'Bolivie', dial: '591' },
  { code: 'br', name: 'Brésil', dial: '55' },
  { code: 'ca', name: 'Canada', dial: '1' },
  { code: 'cl', name: 'Chili', dial: '56' },
  { code: 'co', name: 'Colombie', dial: '57' },
  { code: 'cr', name: 'Costa Rica', dial: '506' },
  { code: 'cu', name: 'Cuba', dial: '53' },
  { code: 'dm', name: 'Dominique', dial: '1767' },
  { code: 'do', name: 'République dominicaine', dial: '1809' },
  { code: 'ec', name: 'Équateur', dial: '593' },
  { code: 'sv', name: 'Salvador', dial: '503' },
  { code: 'us', name: 'États-Unis', dial: '1' },
  { code: 'gd', name: 'Grenade', dial: '1473' },
  { code: 'gt', name: 'Guatemala', dial: '502' },
  { code: 'gy', name: 'Guyana', dial: '592' },
  { code: 'ht', name: 'Haïti', dial: '509' },
  { code: 'hn', name: 'Honduras', dial: '504' },
  { code: 'jm', name: 'Jamaïque', dial: '1876' },
  { code: 'mx', name: 'Mexique', dial: '52' },
  { code: 'ni', name: 'Nicaragua', dial: '505' },
  { code: 'pa', name: 'Panama', dial: '507' },
  { code: 'py', name: 'Paraguay', dial: '595' },
  { code: 'pe', name: 'Pérou', dial: '51' },
  { code: 'kn', name: 'Saint-Kitts-et-Nevis', dial: '1869' },
  { code: 'lc', name: 'Sainte-Lucie', dial: '1758' },
  { code: 'vc', name: 'Saint-Vincent-et-les-Grenadines', dial: '1784' },
  { code: 'sr', name: 'Suriname', dial: '597' },
  { code: 'tt', name: 'Trinité-et-Tobago', dial: '1868' },
  { code: 'uy', name: 'Uruguay', dial: '598' },
  { code: 've', name: 'Venezuela', dial: '58' },

  // ─── Asie & Moyen-Orient ───
  { code: 'af', name: 'Afghanistan', dial: '93' },
  { code: 'sa', name: 'Arabie saoudite', dial: '966' },
  { code: 'am', name: 'Arménie', dial: '374' },
  { code: 'az', name: 'Azerbaïdjan', dial: '994' },
  { code: 'bh', name: 'Bahreïn', dial: '973' },
  { code: 'bd', name: 'Bangladesh', dial: '880' },
  { code: 'bt', name: 'Bhoutan', dial: '975' },
  { code: 'bn', name: 'Brunei', dial: '673' },
  { code: 'kh', name: 'Cambodge', dial: '855' },
  { code: 'cn', name: 'Chine', dial: '86' },
  { code: 'kp', name: 'Corée du Nord', dial: '850' },
  { code: 'kr', name: 'Corée du Sud', dial: '82' },
  { code: 'ae', name: 'Émirats arabes unis', dial: '971' },
  { code: 'ge', name: 'Géorgie', dial: '995' },
  { code: 'hk', name: 'Hong Kong', dial: '852' },
  { code: 'in', name: 'Inde', dial: '91' },
  { code: 'id', name: 'Indonésie', dial: '62' },
  { code: 'iq', name: 'Irak', dial: '964' },
  { code: 'ir', name: 'Iran', dial: '98' },
  { code: 'il', name: 'Israël', dial: '972' },
  { code: 'jp', name: 'Japon', dial: '81' },
  { code: 'jo', name: 'Jordanie', dial: '962' },
  { code: 'kz', name: 'Kazakhstan', dial: '7' },
  { code: 'kg', name: 'Kirghizistan', dial: '996' },
  { code: 'kw', name: 'Koweït', dial: '965' },
  { code: 'la', name: 'Laos', dial: '856' },
  { code: 'lb', name: 'Liban', dial: '961' },
  { code: 'mo', name: 'Macao', dial: '853' },
  { code: 'my', name: 'Malaisie', dial: '60' },
  { code: 'mv', name: 'Maldives', dial: '960' },
  { code: 'mn', name: 'Mongolie', dial: '976' },
  { code: 'mm', name: 'Myanmar', dial: '95' },
  { code: 'np', name: 'Népal', dial: '977' },
  { code: 'om', name: 'Oman', dial: '968' },
  { code: 'uz', name: 'Ouzbékistan', dial: '998' },
  { code: 'pk', name: 'Pakistan', dial: '92' },
  { code: 'ps', name: 'Palestine', dial: '970' },
  { code: 'ph', name: 'Philippines', dial: '63' },
  { code: 'qa', name: 'Qatar', dial: '974' },
  { code: 'sg', name: 'Singapour', dial: '65' },
  { code: 'lk', name: 'Sri Lanka', dial: '94' },
  { code: 'sy', name: 'Syrie', dial: '963' },
  { code: 'tj', name: 'Tadjikistan', dial: '992' },
  { code: 'tw', name: 'Taïwan', dial: '886' },
  { code: 'th', name: 'Thaïlande', dial: '66' },
  { code: 'tl', name: 'Timor oriental', dial: '670' },
  { code: 'tm', name: 'Turkménistan', dial: '993' },
  { code: 'tr', name: 'Turquie', dial: '90' },
  { code: 'vn', name: 'Viêt Nam', dial: '84' },
  { code: 'ye', name: 'Yémen', dial: '967' },

  // ─── Océanie ───
  { code: 'au', name: 'Australie', dial: '61' },
  { code: 'fj', name: 'Fidji', dial: '679' },
  { code: 'ki', name: 'Kiribati', dial: '686' },
  { code: 'mh', name: 'Îles Marshall', dial: '692' },
  { code: 'fm', name: 'Micronésie', dial: '691' },
  { code: 'nr', name: 'Nauru', dial: '674' },
  { code: 'nz', name: 'Nouvelle-Zélande', dial: '64' },
  { code: 'pw', name: 'Palaos', dial: '680' },
  { code: 'pg', name: 'Papouasie-Nouvelle-Guinée', dial: '675' },
  { code: 'ws', name: 'Samoa', dial: '685' },
  { code: 'sb', name: 'Îles Salomon', dial: '677' },
  { code: 'to', name: 'Tonga', dial: '676' },
  { code: 'tv', name: 'Tuvalu', dial: '688' },
  { code: 'vu', name: 'Vanuatu', dial: '678' },
];

// Tri par indicatif décroissant (longueur) pour matcher les codes longs en premier
const SORTED_COUNTRIES = [...COUNTRIES].sort(
  (a, b) => b.dial.length - a.dial.length
);

// ============================================
// DÉTECTION DU PAYS
// ============================================

function detectCountry(value: string): Country | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 1) return null;

  // On teste les indicatifs du plus long au plus court (3, puis 2, puis 1)
  for (const len of [4, 3, 2, 1]) {
    const prefix = digits.slice(0, len);
    const found = SORTED_COUNTRIES.find((c) => c.dial === prefix);
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
  const [imageError, setImageError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // On accepte chiffres, espaces, tirets
    const raw = e.target.value.replace(/[^\d\s\-]/g, '');
    onChange(raw);
  };

  // URL du drapeau circulaire (SVG, parfaitement rond)
  const flagUrl = detectedCountry
    ? `https://hatscripts.github.io/circle-flags/flags/${detectedCountry.code}.svg`
    : null;

  return (
    <div className="relative">
      {/* Préfixe + */}
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 sm:text-sm"
        aria-hidden="true"
      >
        +
      </span>

      {/* Drapeau circulaire détecté */}
      {detectedCountry && flagUrl && !imageError && (
        <span
          className="pointer-events-none absolute left-7 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full ring-1 ring-slate-200 transition-opacity duration-200"
          aria-label={detectedCountry.name}
          title={detectedCountry.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={flagUrl}
            alt={detectedCountry.name}
            width={20}
            height={20}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="h-full w-full rounded-full object-cover"
          />
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
          detectedCountry && !imageError ? 'pl-14' : 'pl-8'
        } pr-3.5`}
      />
    </div>
  );
}