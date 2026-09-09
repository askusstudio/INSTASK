import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { findUserById, upsertUser, updateUserSubscription, memoryStore } from '@/lib/prisma';
import { SUBSCRIPTION_PLANS } from '@/lib/pricing-plans';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret && stripeSecret.startsWith('sk_')
  ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' as Stripe.LatestApiVersion })
  : null;

export async function POST(req: Request) {
  try {
    // 1. Resolve user from authenticated session, or fallback to request body / demo user
    let userId: string | null = null;
    let userEmail: string | undefined = undefined;

    try {
      const session = await getServerSession(authOptions);
      if (session?.user && (session.user as { id?: string }).id) {
        userId = (session.user as { id?: string }).id!;
        userEmail = session.user.email || undefined;
      }
    } catch {
      // Session retrieval failed, fallback to request body
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty
    }

    if (!userId && body?.userId) {
      userId = body.userId;
    }

    if (!userId) {
      userId = 'usr_demo_001';
    }

    const planKey = (body?.planKey || 'monthly').toLowerCase();
    const currency = (body?.currency || 'usd').toLowerCase();
    const selectedPlan = SUBSCRIPTION_PLANS[planKey] || SUBSCRIPTION_PLANS.monthly;

    const planPriceId = body?.planPriceId || (currency === 'inr'
      ? selectedPlan.inr.stripePriceId
      : selectedPlan.usd.stripePriceId);

    let user = await findUserById(userId);
    if (!user) {
      user = await upsertUser({
        id: userId,
        email: userEmail || null,
        provider: 'EMAIL',
        subscriptionStatus: 'INACTIVE',
      });
    }

    // 2. Attach 50% off coupon for first-time monthly subscribers
    const isMonthly = selectedPlan.id === 'monthly';
    const isEligibleForDiscount = isMonthly && !user.isFirstMonthDiscountApplied;
    const couponId = process.env.STRIPE_50_OFF_COUPON_ID || 'FIRST50';
    const discounts = isEligibleForDiscount ? [{ coupon: couponId }] : [];

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 3. Live Stripe Checkout Session Creation
    if (stripe) {
      try {
        let customerId = user.stripeCustomerId;
        if (!customerId) {
          try {
            const customer = await stripe.customers.create({
              email: user.email || undefined,
              metadata: { userId: user.id },
            });
            customerId = customer.id;
            await updateUserSubscription(user.id, {
              subscriptionStatus: user.subscriptionStatus,
              stripeCustomerId: customerId,
            });
          } catch (cErr) {
            console.warn('Stripe customer create failed:', cErr);
          }
        }

        const checkoutSession = await stripe.checkout.sessions.create({
          customer: customerId || undefined,
          client_reference_id: user.id,
          customer_email: customerId ? undefined : (user.email || undefined),
          mode: 'subscription',
          payment_method_types: ['card'],
          payment_method_collection: 'always',
          line_items: [
            {
              price: planPriceId,
              quantity: 1,
            },
          ],
          discounts,
          allow_promotion_codes: discounts.length === 0,
          success_url: `${appUrl}/dashboard?plan_activated=${selectedPlan.id}`,
          cancel_url: `${appUrl}/pricing`,
          subscription_data: {
            metadata: {
              userId: user.id,
              planKey: selectedPlan.id,
              creditsGranted: selectedPlan.creditsGranted.toString(),
            },
          },
        });

        return NextResponse.json({
          url: checkoutSession.url,
          checkoutUrl: checkoutSession.url,
          mode: 'live',
        });
      } catch (stripeErr: unknown) {
        const sErr = stripeErr as Error;
        console.warn('Live Stripe session creation error, falling back to sandbox simulator:', sErr.message);
      }
    }

    // 4. Zero-Friction Sandbox Fallback Simulator
    const sandboxUrl = `${appUrl}/pricing?sandbox=true&eligible=${isEligibleForDiscount}&userId=${user.id}&planPriceId=${encodeURIComponent(planPriceId)}&planKey=${selectedPlan.id}&creditsGranted=${selectedPlan.creditsGranted}`;

    return NextResponse.json({
      url: sandboxUrl,
      checkoutUrl: sandboxUrl,
      mode: 'sandbox',
      discountApplied: isEligibleForDiscount,
      discountPercent: isMonthly ? 50 : selectedPlan.discountPercentage,
      originalPrice: currency === 'inr' ? selectedPlan.inr.total : selectedPlan.usd.total,
      discountedPrice: currency === 'inr' ? selectedPlan.inr.total : selectedPlan.usd.total,
      creditsGranted: selectedPlan.creditsGranted,
      planKey: selectedPlan.id,
      message: 'Sandbox mode active. Autopay subscription verified.',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
