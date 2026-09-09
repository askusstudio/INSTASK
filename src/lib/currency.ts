export interface CurrencyConfig {
  code: string;
  symbol: string;
  regularPrice: number;
  discountPrice: number;
  stripePriceId: string; // Dynamic Stripe recurring Price ID per currency
}

export const REGIONAL_PRICING: Record<string, CurrencyConfig> = {
  IN: {
    code: "INR",
    symbol: "₹",
    regularPrice: 3999,
    discountPrice: 1999,
    stripePriceId: process.env.STRIPE_PRICE_INR || "price_inr_xxx",
  },
  US: {
    code: "USD",
    symbol: "$",
    regularPrice: 49,
    discountPrice: 24.5,
    stripePriceId: process.env.STRIPE_PRICE_USD || "price_usd_xxx",
  },
  GB: {
    code: "GBP",
    symbol: "£",
    regularPrice: 39,
    discountPrice: 19.5,
    stripePriceId: process.env.STRIPE_PRICE_GBP || "price_gbp_xxx",
  },
  EU: {
    code: "EUR",
    symbol: "€",
    regularPrice: 45,
    discountPrice: 22.5,
    stripePriceId: process.env.STRIPE_PRICE_EUR || "price_eur_xxx",
  },
  AE: {
    code: "AED",
    symbol: "AED ",
    regularPrice: 180,
    discountPrice: 90,
    stripePriceId: process.env.STRIPE_PRICE_AED || "price_aed_xxx",
  },
};

const EUROPEAN_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
]);

// Fallback to USD for unlisted countries
export const DEFAULT_CURRENCY: CurrencyConfig = REGIONAL_PRICING.US;

export function getPricingForCountry(countryCode?: string | null): CurrencyConfig {
  if (!countryCode) return DEFAULT_CURRENCY;
  const upper = countryCode.toUpperCase();
  if (REGIONAL_PRICING[upper]) return REGIONAL_PRICING[upper];
  if (EUROPEAN_COUNTRIES.has(upper)) return REGIONAL_PRICING.EU;
  return DEFAULT_CURRENCY;
}
