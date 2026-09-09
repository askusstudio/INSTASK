import { headers } from 'next/headers';
import { getPricingForCountry } from '@/lib/currency';
import { PaymentOnboardingClient } from '@/components/onboarding/PaymentOnboardingClient';

export const dynamic = 'force-dynamic';

interface PaymentPageProps {
  params: { locale: string };
}

export default async function PaymentOnboarding({ params: { locale } }: PaymentPageProps) {
  const headersList = await headers();
  const countryCode = headersList.get('x-user-country') || headersList.get('x-vercel-ip-country') || 'US';
  const pricing = getPricingForCountry(countryCode);

  return <PaymentOnboardingClient locale={locale} pricing={pricing} />;
}
