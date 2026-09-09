// INSTASK - Multi-Tier Recurring Subscription Plans Configuration
// Supports Monthly (base), Quarterly (3mo, 5% off), Semi-Annual (6mo, 10% off), Annual (12mo, 15% off)

export interface PlanTier {
  id: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  months: number;
  label: string;
  discountPercentage: number;
  badge?: string;
  usd: {
    total: number;
    monthlyEquivalent: number;
    stripePriceId: string;
  };
  inr: {
    total: number;
    monthlyEquivalent: number;
    stripePriceId: string;
  };
  creditsGranted: number;
}

export const SUBSCRIPTION_PLANS: Record<string, PlanTier> = {
  monthly: {
    id: 'monthly',
    months: 1,
    label: 'Monthly Plan',
    discountPercentage: 0,
    usd: {
      total: 49,
      monthlyEquivalent: 49,
      stripePriceId: process.env.STRIPE_PRICE_MONTHLY_USD || 'price_1mo_usd',
    },
    inr: {
      total: 3999,
      monthlyEquivalent: 3999,
      stripePriceId: process.env.STRIPE_PRICE_MONTHLY_INR || 'price_1mo_inr',
    },
    creditsGranted: 60,
  },
  quarterly: {
    id: 'quarterly',
    months: 3,
    label: '3 Months (Quarterly)',
    discountPercentage: 5,
    badge: '5% SAVINGS',
    usd: {
      total: 139.65, // ($49 * 3) - 5%
      monthlyEquivalent: 46.55,
      stripePriceId: process.env.STRIPE_PRICE_3MO_USD || 'price_3mo_usd',
    },
    inr: {
      total: 11397,
      monthlyEquivalent: 3799,
      stripePriceId: process.env.STRIPE_PRICE_3MO_INR || 'price_3mo_inr',
    },
    creditsGranted: 180,
  },
  semi_annual: {
    id: 'semi_annual',
    months: 6,
    label: '6 Months (Half-Year)',
    discountPercentage: 10,
    badge: '10% POPULAR',
    usd: {
      total: 264.6, // ($49 * 6) - 10%
      monthlyEquivalent: 44.1,
      stripePriceId: process.env.STRIPE_PRICE_6MO_USD || 'price_6mo_usd',
    },
    inr: {
      total: 21594,
      monthlyEquivalent: 3599,
      stripePriceId: process.env.STRIPE_PRICE_6MO_INR || 'price_6mo_inr',
    },
    creditsGranted: 360,
  },
  annual: {
    id: 'annual',
    months: 12,
    label: '12 Months (Annual)',
    discountPercentage: 15,
    badge: '15% BEST VALUE',
    usd: {
      total: 499.8, // ($49 * 12) - 15%
      monthlyEquivalent: 41.65,
      stripePriceId: process.env.STRIPE_PRICE_12MO_USD || 'price_12mo_usd',
    },
    inr: {
      total: 40789,
      monthlyEquivalent: 3399,
      stripePriceId: process.env.STRIPE_PRICE_12MO_INR || 'price_12mo_inr',
    },
    creditsGranted: 720,
  },
};
