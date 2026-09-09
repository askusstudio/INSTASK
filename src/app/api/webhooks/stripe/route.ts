import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateUserSubscription, prisma, memoryStore } from '@/lib/prisma';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret && stripeSecret.startsWith('sk_')
  ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' as Stripe.LatestApiVersion })
  : null;

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');

    // 1. In sandbox / testing mode without live webhook signature
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET || !stripe) {
      try {
        const parsed = JSON.parse(payload);
        if (parsed.type === 'checkout.session.completed') {
          const session = parsed.data?.object;
          const userId = session?.client_reference_id || 'usr_demo_001';

          await updateUserSubscription(userId, {
            subscriptionStatus: 'ACTIVE',
            subscriptionId: (session?.subscription as string) || 'sub_sandbox_001',
            stripeCustomerId: (session?.customer as string) || 'cus_sandbox_001',
            isFirstMonthDiscountApplied: true,
          });

          return NextResponse.json({ received: true, mode: 'sandbox' });
        } else if (parsed.type === 'customer.subscription.deleted') {
          const session = parsed.data?.object;
          const subId = session?.id || 'sub_sandbox_001';

          for (const user of memoryStore.users.values()) {
            if (user.subscriptionId === subId) {
              user.subscriptionStatus = 'CANCELED';
            }
          }

          return NextResponse.json({ received: true, mode: 'sandbox_canceled' });
        }
      } catch {
        // Not a JSON test simulation
      }

      return NextResponse.json(
        { error: 'Stripe webhook signature or secret missing' },
        { status: 400 }
      );
    }

    // 2. Real Stripe Webhook Verification
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: unknown) {
      const e = err as Error;
      return NextResponse.json({ error: `Webhook error: ${e.message}` }, { status: 400 });
    }

    // 3. Handle successful initial subscription checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (userId) {
        await updateUserSubscription(userId, {
          subscriptionStatus: 'ACTIVE',
          stripeCustomerId: session.customer as string,
          subscriptionId: session.subscription as string,
          isFirstMonthDiscountApplied: true,
        });
      }
    }

    // 4. Handle recurring subscription cancellations or non-payments
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;

      if (prisma) {
        try {
          await prisma.user.updateMany({
            where: { subscriptionId: subscription.id },
            data: { subscriptionStatus: 'CANCELED' },
          });
        } catch (dbErr) {
          console.warn('Prisma subscription update failed:', dbErr);
        }
      }

      for (const user of memoryStore.users.values()) {
        if (user.subscriptionId === subscription.id) {
          user.subscriptionStatus = 'CANCELED';
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
