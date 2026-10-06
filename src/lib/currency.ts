export type Currency = 'XOF' | 'EUR' | 'USD';

export const CURRENCY_INFO: Record<Currency, { symbol: string; label: string }> = {
  XOF: { symbol: 'FCFA', label: 'Franc CFA (XOF)' },
  EUR: { symbol: '€', label: 'Euro (EUR)' },
  USD: { symbol: '$', label: 'Dollar US (USD)' },
};

// Prix de base en FCFA
const BASE_PRICES_XOF = {
  pro: 10000,
  premium: 25000,
  enterprise: 100000,
};

// Taux de conversion fixes approximatifs
const CONVERSION_RATES: Record<Currency, number> = {
  XOF: 1,
  EUR: 655,
  USD: 600,
};

// ✅ Fonction de normalisation pour garantir une devise valide
export function normalizeCurrency(currency: string | null | undefined): Currency {
  if (!currency) return 'XOF';
  
  const upper = currency.toUpperCase().trim();
  
  // Gestion des alias courants
  if (upper === 'XAF' || upper === 'FCFA' || upper === 'CFA') return 'XOF';
  
  // Vérifie si c'est une devise valide
  if (upper === 'XOF' || upper === 'EUR' || upper === 'USD') {
    return upper as Currency;
  }
  
  // Fallback par défaut
  return 'XOF';
}

export function formatPlanPrice(planId: 'pro' | 'premium' | 'enterprise', currency: Currency | string = 'XOF', period: string = '/an'): string {
  const normalizedCurrency = normalizeCurrency(currency);
  const base = BASE_PRICES_XOF[planId];
  const amount = Math.round(base / CONVERSION_RATES[normalizedCurrency]);
  const symbol = CURRENCY_INFO[normalizedCurrency].symbol;
  
  return normalizedCurrency === 'XOF' 
    ? `${amount.toLocaleString('fr-FR')} ${symbol}${period}` 
    : `${amount} ${symbol}${period}`;
}

// ✅ Fonction corrigée avec fallback
export function getCurrencySymbol(currency: Currency | string | null | undefined): string {
  const normalized = normalizeCurrency(currency);
  return CURRENCY_INFO[normalized].symbol;
}