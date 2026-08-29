// src/config/currencies.ts

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  locale: string;
  timezone: string;
}

export const COUNTRIES: CountryConfig[] = [
  { code: "CM", name: "Cameroun", currency: "XAF", currencySymbol: "FCFA", flag: "🇨🇲", locale: "fr-CM", timezone: "Africa/Douala" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", currencySymbol: "FCFA", flag: "🇨🇮", locale: "fr-CI", timezone: "Africa/Abidjan" },
  { code: "SN", name: "Sénégal", currency: "XOF", currencySymbol: "FCFA", flag: "🇸🇳", locale: "fr-SN", timezone: "Africa/Dakar" },
  { code: "BJ", name: "Bénin", currency: "XOF", currencySymbol: "FCFA", flag: "🇧🇯", locale: "fr-BJ", timezone: "Africa/Porto-Novo" },
  { code: "ML", name: "Mali", currency: "XOF", currencySymbol: "FCFA", flag: "🇲🇱", locale: "fr-ML", timezone: "Africa/Bamako" },
  { code: "TG", name: "Togo", currency: "XOF", currencySymbol: "FCFA", flag: "🇹🇬", locale: "fr-TG", timezone: "Africa/Lome" },
  { code: "GA", name: "Gabon", currency: "XAF", currencySymbol: "FCFA", flag: "🇬🇦", locale: "fr-GA", timezone: "Africa/Libreville" },
  { code: "CD", name: "Rép. Dém. du Congo", currency: "CDF", currencySymbol: "CDF", flag: "🇨🇩", locale: "fr-CD", timezone: "Africa/Kinshasa" },
  { code: "NG", name: "Nigeria", currency: "NGN", currencySymbol: "₦", flag: "🇳🇬", locale: "en-NG", timezone: "Africa/Lagos" },
  { code: "GH", name: "Ghana", currency: "GHS", currencySymbol: "₵", flag: "🇬🇭", locale: "en-GH", timezone: "Africa/Accra" },
  { code: "KE", name: "Kenya", currency: "KES", currencySymbol: "KSh", flag: "🇰🇪", locale: "en-KE", timezone: "Africa/Nairobi" },
  { code: "ZA", name: "Afrique du Sud", currency: "ZAR", currencySymbol: "R", flag: "🇿🇦", locale: "en-ZA", timezone: "Africa/Johannesburg" },
  { code: "FR", name: "France", currency: "EUR", currencySymbol: "€", flag: "🇫🇷", locale: "fr-FR", timezone: "Europe/Paris" },
  { code: "GB", name: "Royaume-Uni", currency: "GBP", currencySymbol: "£", flag: "🇬🇧", locale: "en-GB", timezone: "Europe/London" },
  { code: "US", name: "États-Unis", currency: "USD", currencySymbol: "$", flag: "🇺🇸", locale: "en-US", timezone: "America/New_York" },
  { code: "CA", name: "Canada", currency: "CAD", currencySymbol: "$", flag: "🇨🇦", locale: "fr-CA", timezone: "America/Toronto" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Cameroun par défaut

// Fonction utilitaire pour récupérer la config d'un pays par son code
export const getCountryByCode = (code: string): CountryConfig => {
  return COUNTRIES.find(c => c.code === code) || DEFAULT_COUNTRY;
};