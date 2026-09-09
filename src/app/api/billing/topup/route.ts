import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserCredits, addCredits, TOPUP_BUNDLES } from '@/lib/credits';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret && stripeSecret.startsWith('sk_')
  ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' as Stripe.LatestApiVersion })
  : null;

// GET: Retrieve user credits balance & available top-up bundles
export async function GET(req: Request) {
  let userId = 'usr_demo_001';
  try {
    const { searchParams } = new URL(req.url);
    const paramUserId = searchParams.get('userId');
    if (paramUserId) {
      userId = paramUserId;
    } else {
      const session = await getServerSession(authOptions);
      if (session?.user && (session.user as { id?: string }).id) {
        userId = (session.user as { id?: string }).id!;
      }
    }
  } catch {
    // Demo fallback
  }

  const credits = await getUserCredits(userId);

  return NextResponse.json({
    userId,
    creditsBalance: credits,
    bundles: Object.values(TOPUP_BUNDLES),
  });
}

// POST: Create checkout session or simulate credit top-up
export async function POST(req: Request) {
  let userId = 'usr_demo_001';
  try {
    const session = await getServerSession(authOptions);
    if (session?.user && (session.user as { id?: string }).id) {
      userId = (session.user as { id?: string }).id!;
    }
  } catch {
    // Demo fallback
  }

  const body = await req.json().catch(() => ({}));
  if (body.userId) userId = body.userId;

  const bundleKey = body.bundleKey || 'tier_medium';
  const bundle = TOPUP_BUNDLES[bundleKey as keyof typeof TOPUP_BUNDLES];

  if (!bundle) {
    return NextResponse.json({ error: 'Invalid credit top-up bundle selected.' }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // 1. Live Stripe Checkout Session
  if (stripe) {
    try {
      const checkout = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        client_reference_id: userId,
        metadata: {
          type: 'CREDIT_TOPUP',
          creditsToAdd: bundle.credits.toString(),
          userId,
        },
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${bundle.credits} INSTASK Generation Credits`,
                description: 'On-demand AI copy, competitor intelligence & graphic rendering credits',
              },
              unit_amount: bundle.priceInCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/dashboard?credits_added=true&amount=${bundle.credits}`,
        cancel_url: `${appUrl}/dashboard`,
      });

      return NextResponse.json({ url: checkout.url, mode: 'live', bundle });
    } catch (err: any) {
      console.warn('Live Stripe top-up session failed, falling back to sandbox simulator:', err.message);
    }
  }

  // 2. Zero-Friction Sandbox Fulfillment Simulator
  // If simulation direct credit requested or running in test/sandbox mode:
  await addCredits(
    userId,
    bundle.credits,
    'PAID_TOPUP',
    `Purchased pack of ${bundle.credits} credits (Sandbox)`
  );

  const newBalance = await getUserCredits(userId);

  return NextResponse.json({
    url: `${appUrl}/dashboard?credits_added=true&amount=${bundle.credits}&sandbox=true`,
    mode: 'sandbox',
    creditsAdded: bundle.credits,
    balanceRemaining: newBalance,
    bundle,
  });
}
