import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateUserSubscription, prisma, memoryStore } from '@/lib/prisma';
import { addCredits } from '@/lib/credits';

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

          // Check if this was a one-time credit pack top-up
          if (session?.metadata?.type === 'CREDIT_TOPUP') {
            const userId = session.metadata.userId || session.client_reference_id || 'usr_demo_001';
            const creditsToAdd = parseInt(session.metadata.creditsToAdd, 10) || 75;

            const res = await addCredits(
              userId,
              creditsToAdd,
              'PAID_TOPUP',
              `Purchased pack of ${creditsToAdd} credits`
            );

            return NextResponse.json({
              received: true,
              mode: 'sandbox_topup',
              creditsAdded: creditsToAdd,
              balanceRemaining: res.balanceRemaining,
            });
          }

          // Subscription activation (supports monthly, quarterly, semi_annual, annual)
          const userId = session?.metadata?.userId || session?.client_reference_id || 'usr_demo_001';
          const planKey = (session?.metadata?.planKey || 'monthly').toLowerCase();
          const cycleMap: Record<string, 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL'> = {
            monthly: 'MONTHLY',
            quarterly: 'QUARTERLY',
            semi_annual: 'SEMI_ANNUAL',
            annual: 'ANNUAL',
          };
          const billingCycle = cycleMap[planKey] || 'MONTHLY';

          let creditsToAdd = 60;
          if (session?.metadata?.creditsGranted) {
            creditsToAdd = parseInt(session.metadata.creditsGranted, 10);
          } else if (planKey === 'quarterly') {
            creditsToAdd = 180;
          } else if (planKey === 'semi_annual') {
            creditsToAdd = 360;
          } else if (planKey === 'annual') {
            creditsToAdd = 720;
          }

          const monthsMap: Record<string, number> = { monthly: 1, quarterly: 3, semi_annual: 6, annual: 12 };
          const months = monthsMap[planKey] || 1;
          const currentPeriodEnd = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);

          await updateUserSubscription(userId, {
            subscriptionStatus: 'ACTIVE',
            subscriptionId: (session?.subscription as string) || 'sub_sandbox_001',
            stripeCustomerId: (session?.customer as string) || 'cus_sandbox_001',
            isFirstMonthDiscountApplied: true,
            billingCycle,
            autoRenew: true,
            currentPeriodEnd,
          });

          await addCredits(
            userId,
            creditsToAdd,
            'MONTHLY_GRANT',
            `Subscription activated: ${planKey} (${creditsToAdd} credits added)`
          );

          return NextResponse.json({
            received: true,
            mode: 'sandbox',
            billingCycle,
            creditsAdded: creditsToAdd,
          });
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

    // 3. Handle successful checkout session (Top-Up or Subscription)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Check if this was a one-time credit pack top-up
      if (session.metadata?.type === 'CREDIT_TOPUP') {
        const userId = session.metadata.userId || session.client_reference_id;
        const creditsToAdd = parseInt(session.metadata.creditsToAdd, 10);

        if (userId && creditsToAdd) {
          await addCredits(
            userId,
            creditsToAdd,
            'PAID_TOPUP',
            `Purchased pack of ${creditsToAdd} credits`
          );
        }

        return NextResponse.json({ received: true, topupFulfilled: true, creditsAdded: creditsToAdd });
      }

      // Handle subscription activation
      const subscriptionId = session.subscription as string;
      let planKey = session.metadata?.planKey || 'monthly';
      let userId = session.metadata?.userId || session.client_reference_id;
      let creditsToAdd = session.metadata?.creditsGranted ? parseInt(session.metadata.creditsGranted, 10) : 60;

      if (stripe && subscriptionId && (!userId || !session.metadata?.planKey)) {
        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          if (subscription?.metadata) {
            if (subscription.metadata.userId) userId = subscription.metadata.userId;
            if (subscription.metadata.planKey) planKey = subscription.metadata.planKey;
            if (subscription.metadata.creditsGranted) {
              creditsToAdd = parseInt(subscription.metadata.creditsGranted, 10);
            }
          }
        } catch (subErr) {
          console.warn('Could not retrieve subscription details from Stripe:', subErr);
        }
      }

      const cycleMap: Record<string, 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL'> = {
        monthly: 'MONTHLY',
        quarterly: 'QUARTERLY',
        semi_annual: 'SEMI_ANNUAL',
        annual: 'ANNUAL',
      };
      const billingCycle = cycleMap[planKey.toLowerCase()] || 'MONTHLY';

      if (!session.metadata?.creditsGranted) {
        if (planKey === 'quarterly') creditsToAdd = 180;
        else if (planKey === 'semi_annual') creditsToAdd = 360;
        else if (planKey === 'annual') creditsToAdd = 720;
      }

      if (userId) {
        await updateUserSubscription(userId, {
          subscriptionStatus: 'ACTIVE',
          stripeCustomerId: session.customer as string,
          subscriptionId: session.subscription as string,
          isFirstMonthDiscountApplied: true,
          billingCycle,
          autoRenew: true,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        await addCredits(
          userId,
          creditsToAdd,
          'MONTHLY_GRANT',
          `Subscription activated: ${planKey} (${creditsToAdd} credits added)`
        );
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
