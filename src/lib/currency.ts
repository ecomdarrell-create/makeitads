// ======================================================
// SYSTÈME DE DEVISES — MakeItAds
// Source unique de vérité pour les conversions et formats
// ======================================================

export type Currency = 'XOF' | 'XAF' | 'EUR' | 'USD';

// ✅ Devises supportées + symbole + label + taux de conversion (base = 1 XOF)
// Taux approximatifs — à mettre à jour manuellement si besoin
export const CURRENCY_INFO: Record<
  Currency,
  { symbol: string; label: string; rateFromXOF: number; decimals: number }
> = {
  XOF: { symbol: 'FCFA', label: 'Franc CFA (XOF)', rateFromXOF: 1, decimals: 0 },
  XAF: { symbol: 'FCFA', label: 'Franc CFA (XAF)', rateFromXOF: 1, decimals: 0 },
  EUR: { symbol: '€', label: 'Euro (EUR)', rateFromXOF: 1 / 655.957, decimals: 2 },
  USD: { symbol: '$', label: 'Dollar US (USD)', rateFromXOF: 1 / 600, decimals: 2 },
};

// ✅ Toutes les devises valides
export const SUPPORTED_CURRENCIES: Currency[] = ['XOF', 'XAF', 'EUR', 'USD'];

// ======================================================
// NORMALISATION
// ======================================================
export function normalizeCurrency(currency: string | null | undefined): Currency {
  if (!currency) return 'XOF';

  const upper = currency.toUpperCase().trim();

  // Aliases courants → XAF (CEMAC)
  if (upper === 'XAF' || upper === 'FCFA-CEMAC') return 'XAF';

  // Aliases courants → XOF (UEMOA)
  if (upper === 'XOF' || upper === 'FCFA' || upper === 'CFA' || upper === 'FCFA-UEMOA') {
    return 'XOF';
  }

  // Devises directes
  if (upper === 'EUR') return 'EUR';
  if (upper === 'USD') return 'USD';

  // Fallback par défaut
  return 'XOF';
}

// ======================================================
// SYMBOLE
// ======================================================
export function getCurrencySymbol(currency: Currency | string | null | undefined): string {
  const normalized = normalizeCurrency(currency);
  return CURRENCY_INFO[normalized].symbol;
}

// ======================================================
// CONVERSION
// ======================================================

/**
 * Convertit un montant de la devise source vers la devise cible.
 * Utilise XOF comme pivot si les devises diffèrent.
 */
export function convertCurrency(
  amount: number,
  from: Currency | string,
  to: Currency | string
): number {
  const fromCur = normalizeCurrency(from);
  const toCur = normalizeCurrency(to);

  if (fromCur === toCur) return amount;

  // Pivot en XOF
  const amountInXOF = amount / CURRENCY_INFO[fromCur].rateFromXOF;
  const result = amountInXOF * CURRENCY_INFO[toCur].rateFromXOF;

  return result;
}

/**
 * Convertit un montant depuis XOF (base) vers la devise cible.
 * Pratique quand tous les prix de référence sont en XOF.
 */
export function convertFromXOF(amountXOF: number, targetCurrency: Currency | string): number {
  const target = normalizeCurrency(targetCurrency);
  return amountXOF * CURRENCY_INFO[target].rateFromXOF;
}

// ======================================================
// FORMATAGE
// ======================================================

/**
 * Formate un montant avec le bon séparateur + symbole.
 * Ex XOF : "10 000 FCFA"
 * Ex EUR : "15,24 €"
 * Ex USD : "16,67 $"
 */
export function formatPrice(
  amount: number,
  currency: Currency | string | null | undefined
): string {
  const cur = normalizeCurrency(currency);
  const info = CURRENCY_INFO[cur];

  // Arrondi selon la devise (0 décimales pour FCFA, 2 pour EUR/USD)
  const rounded = info.decimals === 0 ? Math.round(amount) : Number(amount.toFixed(2));

  const formatted = rounded.toLocaleString('fr-FR', {
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  });

  return `${formatted} ${info.symbol}`;
}

/**
 * Formate un montant depuis XOF vers la devise cible.
 * Ex : formatPriceFromXOF(10000, 'EUR') → "15,24 €"
 */
export function formatPriceFromXOF(
  amountXOF: number,
  targetCurrency: Currency | string | null | undefined
): string {
  const target = normalizeCurrency(targetCurrency);
  const converted = convertFromXOF(amountXOF, target);
  return formatPrice(converted, target);
}

// ======================================================
// HELPERS POUR LES PLANS
// ======================================================

// Prix de base en XOF (source de vérité)
const BASE_PLAN_PRICES_XOF: Record<string, number> = {
  pro: 10000,
  premium: 25000,
  enterprise: 100000,
};

/**
 * Formate le prix d'un plan dans la devise cible.
 * @param planId 'pro' | 'premium' | 'enterprise'
 * @param currency devise cible
 * @param period ex: '/an'
 */
export function formatPlanPrice(
  planId: 'pro' | 'premium' | 'enterprise',
  currency: Currency | string = 'XOF',
  period: string = '/an'
): string {
  const base = BASE_PLAN_PRICES_XOF[planId];
  if (!base) return '—';

  return `${formatPriceFromXOF(base, currency)}${period}`;
}

/**
 * Récupère le prix numérique d'un plan dans la devise cible.
 */
export function getPlanPriceInCurrency(
  planId: 'pro' | 'premium' | 'enterprise',
  currency: Currency | string = 'XOF'
): number {
  const base = BASE_PLAN_PRICES_XOF[planId];
  return convertFromXOF(base, currency);
}

// ======================================================
// HELPERS POUR LES PACKS DE RECHARGE
// ======================================================

// Prix de base des packs en XOF (source de vérité)
const BASE_RECHARGE_PRICES_XOF: Record<number, number> = {
  10: 1500,
  30: 4000,
  80: 9000,
};

/**
 * Formate le prix d'un pack de recharge dans la devise cible.
 * @param credits nombre de crédits (10, 30, 80)
 */
export function formatRechargePrice(
  credits: number,
  currency: Currency | string = 'XOF'
): string {
  const base = BASE_RECHARGE_PRICES_XOF[credits];
  if (!base) return '—';

  return formatPriceFromXOF(base, currency);
}

// ======================================================
// PARSING (utile pour lire les prix dans les configs)
// ======================================================

/**
 * Extrait un montant numérique d'une chaîne comme "10 000 FCFA/an".
 * Retourne null si rien trouvé.
 */
export function parsePriceFromString(text: string): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d]/g, '');
  const num = parseInt(cleaned, 10);
  return Number.isFinite(num) ? num : null;
}