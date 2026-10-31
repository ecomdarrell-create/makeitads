// ======================================================
// SYSTÈME DE DEVISES — MakeItAds
// Source unique de vérité pour les conversions et formats
// ======================================================

export type Currency = string; // ✅ Toutes les devises ISO 4217

export type CurrencyInfo = {
  code: string;
  symbol: string;
  label: string;
  rateFromXOF: number;
  decimals: number;
  region: 'africa' | 'europe' | 'america' | 'asia' | 'middle_east' | 'other';
  flag?: string;
};

// ✅ Taux approximatifs (base = 1 XOF). À mettre à jour régulièrement.
export const CURRENCY_INFO: Record<string, CurrencyInfo> = {
  // ═══ AFRIQUE ═══
  XOF: { code: 'XOF', symbol: 'FCFA', label: 'Franc CFA (UEMOA)', rateFromXOF: 1, decimals: 0, region: 'africa', flag: '🌍' },
  XAF: { code: 'XAF', symbol: 'FCFA', label: 'Franc CFA (CEMAC)', rateFromXOF: 1, decimals: 0, region: 'africa', flag: '🌍' },
  NGN: { code: 'NGN', symbol: '₦', label: 'Naira nigérian', rateFromXOF: 1 / 0.65, decimals: 0, region: 'africa', flag: '🇳🇬' },
  GHS: { code: 'GHS', symbol: '₵', label: 'Cedi ghanéen', rateFromXOF: 1 / 45, decimals: 2, region: 'africa', flag: '🇬🇭' },
  KES: { code: 'KES', symbol: 'KSh', label: 'Shilling kényan', rateFromXOF: 1 / 5, decimals: 0, region: 'africa', flag: '🇰🇪' },
  ZAR: { code: 'ZAR', symbol: 'R', label: 'Rand sud-africain', rateFromXOF: 1 / 35, decimals: 2, region: 'africa', flag: '🇿🇦' },
  EGP: { code: 'EGP', symbol: 'E£', label: 'Livre égyptienne', rateFromXOF: 1 / 19, decimals: 2, region: 'africa', flag: '🇪🇬' },
  MAD: { code: 'MAD', symbol: 'DH', label: 'Dirham marocain', rateFromXOF: 1 / 60, decimals: 2, region: 'africa', flag: '🇲🇦' },
  TND: { code: 'TND', symbol: 'DT', label: 'Dinar tunisien', rateFromXOF: 1 / 190, decimals: 2, region: 'africa', flag: '🇹🇳' },
  DZD: { code: 'DZD', symbol: 'DA', label: 'Dinar algérien', rateFromXOF: 1 / 4.5, decimals: 2, region: 'africa', flag: '🇩🇿' },

  // ═══ EUROPE ═══
  EUR: { code: 'EUR', symbol: '€', label: 'Euro', rateFromXOF: 1 / 655.957, decimals: 2, region: 'europe', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', label: 'Livre sterling', rateFromXOF: 1 / 780, decimals: 2, region: 'europe', flag: '🇬🇧' },
  CHF: { code: 'CHF', symbol: 'CHF', label: 'Franc suisse', rateFromXOF: 1 / 680, decimals: 2, region: 'europe', flag: '🇨🇭' },
  SEK: { code: 'SEK', symbol: 'kr', label: 'Couronne suédoise', rateFromXOF: 1 / 57, decimals: 2, region: 'europe', flag: '🇸🇪' },
  NOK: { code: 'NOK', symbol: 'kr', label: 'Couronne norvégienne', rateFromXOF: 1 / 56, decimals: 2, region: 'europe', flag: '🇳🇴' },

  // ═══ AMÉRIQUE ═══
  USD: { code: 'USD', symbol: '$', label: 'Dollar américain', rateFromXOF: 1 / 600, decimals: 2, region: 'america', flag: '🇺🇸' },
  CAD: { code: 'CAD', symbol: 'C$', label: 'Dollar canadien', rateFromXOF: 1 / 440, decimals: 2, region: 'america', flag: '🇨🇦' },
  BRL: { code: 'BRL', symbol: 'R$', label: 'Réal brésilien', rateFromXOF: 1 / 105, decimals: 2, region: 'america', flag: '🇧🇷' },
  MXN: { code: 'MXN', symbol: 'Mex$', label: 'Peso mexicain', rateFromXOF: 1 / 30, decimals: 2, region: 'america', flag: '🇲🇽' },

  // ═══ ASIE ═══
  CNY: { code: 'CNY', symbol: '¥', label: 'Yuan chinois', rateFromXOF: 1 / 83, decimals: 2, region: 'asia', flag: '🇨🇳' },
  JPY: { code: 'JPY', symbol: '¥', label: 'Yen japonais', rateFromXOF: 1 / 4, decimals: 0, region: 'asia', flag: '🇯🇵' },
  INR: { code: 'INR', symbol: '₹', label: 'Roupie indienne', rateFromXOF: 1 / 7.2, decimals: 2, region: 'asia', flag: '🇮🇳' },
  KRW: { code: 'KRW', symbol: '₩', label: 'Won coréen', rateFromXOF: 1 / 0.45, decimals: 0, region: 'asia', flag: '🇰🇷' },
  IDR: { code: 'IDR', symbol: 'Rp', label: 'Roupie indonésienne', rateFromXOF: 1 / 0.038, decimals: 0, region: 'asia', flag: '🇮🇩' },
  SGD: { code: 'SGD', symbol: 'S$', label: 'Dollar singapourien', rateFromXOF: 1 / 445, decimals: 2, region: 'asia', flag: '🇸🇬' },

  // ═══ MOYEN-ORIENT ═══
  AED: { code: 'AED', symbol: 'د.إ', label: 'Dirham émirati', rateFromXOF: 1 / 163, decimals: 2, region: 'middle_east', flag: '🇦🇪' },
  SAR: { code: 'SAR', symbol: '﷼', label: 'Riyal saoudien', rateFromXOF: 1 / 160, decimals: 2, region: 'middle_east', flag: '🇸🇦' },
  QAR: { code: 'QAR', symbol: 'ر.ق', label: 'Riyal qatari', rateFromXOF: 1 / 165, decimals: 2, region: 'middle_east', flag: '🇶🇦' },
  ILS: { code: 'ILS', symbol: '₪', label: 'Shekel israélien', rateFromXOF: 1 / 165, decimals: 2, region: 'middle_east', flag: '🇮🇱' },
  TRY: { code: 'TRY', symbol: '₺', label: 'Livre turque', rateFromXOF: 1 / 18, decimals: 2, region: 'middle_east', flag: '🇹🇷' },
};

export const SUPPORTED_CURRENCIES: string[] = Object.keys(CURRENCY_INFO);

export const REGION_LABELS: Record<string, string> = {
  africa: '🌍 Afrique',
  europe: '🇪🇺 Europe',
  america: '🌎 Amérique',
  asia: '🌏 Asie',
  middle_east: '🕌 Moyen-Orient',
  other: '🌐 Autres',
};

// ═══ Helpers ═══

export function normalizeCurrency(currency: string | null | undefined): string {
  if (!currency) return 'XOF';
  const upper = currency.toUpperCase().trim();
  if (CURRENCY_INFO[upper]) return upper;
  if (upper === 'FCFA' || upper === 'CFA') return 'XOF';
  return 'XOF';
}

export function getCurrencySymbol(currency: string | null | undefined): string {
  const normalized = normalizeCurrency(currency);
  return CURRENCY_INFO[normalized]?.symbol ?? 'FCFA';
}

export function getCurrencyInfo(currency: string | null | undefined): CurrencyInfo {
  const normalized = normalizeCurrency(currency);
  return CURRENCY_INFO[normalized];
}

export function convertCurrency(amount: number, from: string, to: string): number {
  const fromCur = normalizeCurrency(from);
  const toCur = normalizeCurrency(to);
  if (fromCur === toCur) return amount;
  const amountInXOF = amount / CURRENCY_INFO[fromCur].rateFromXOF;
  return amountInXOF * CURRENCY_INFO[toCur].rateFromXOF;
}

export function convertFromXOF(amountXOF: number, targetCurrency: string): number {
  const target = normalizeCurrency(targetCurrency);
  return amountXOF * CURRENCY_INFO[target].rateFromXOF;
}

export function formatPrice(amount: number, currency: string | null | undefined): string {
  const cur = normalizeCurrency(currency);
  const info = CURRENCY_INFO[cur];
  const rounded = info.decimals === 0 ? Math.round(amount) : Number(amount.toFixed(2));
  const formatted = rounded.toLocaleString('fr-FR', {
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  });
  return `${formatted} ${info.symbol}`;
}

export function formatPriceFromXOF(amountXOF: number, targetCurrency: string | null | undefined): string {
  const target = normalizeCurrency(targetCurrency);
  const converted = convertFromXOF(amountXOF, target);
  return formatPrice(converted, target);
}

const BASE_PLAN_PRICES_XOF: Record<string, number> = {
  pro: 10000,
  premium: 25000,
  enterprise: 100000,
};

export function formatPlanPrice(
  planId: 'pro' | 'premium' | 'enterprise',
  currency: string = 'XOF',
  period: string = '/an'
): string {
  const base = BASE_PLAN_PRICES_XOF[planId];
  if (!base) return '—';
  return `${formatPriceFromXOF(base, currency)}${period}`;
}

export function getPlanPriceInCurrency(
  planId: 'pro' | 'premium' | 'enterprise',
  currency: string = 'XOF'
): number {
  const base = BASE_PLAN_PRICES_XOF[planId];
  return convertFromXOF(base, currency);
}

const BASE_RECHARGE_PRICES_XOF: Record<number, number> = {
  10: 1500,
  30: 4000,
  80: 9000,
};

export function formatRechargePrice(credits: number, currency: string = 'XOF'): string {
  const base = BASE_RECHARGE_PRICES_XOF[credits];
  if (!base) return '—';
  return formatPriceFromXOF(base, currency);
}

export function parsePriceFromString(text: string): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d]/g, '');
  const num = parseInt(cleaned, 10);
  return Number.isFinite(num) ? num : null;
}