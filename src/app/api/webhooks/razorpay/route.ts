import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateUserSubscription, memoryStore, prisma } from '@/lib/prisma';
import { addCredits } from '@/lib/credits';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    // 1. Signature Verification
    if (signature && secret) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('Razorpay signature verification failed');
        return NextResponse.json({ error: 'Invalid Razorpay signature' }, { status: 400 });
      }
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const event = payload.event;
    const subscriptionEntity = payload.payload?.subscription?.entity;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    // Consolidate notes across order, payment, and subscription entities
    const notes = {
      ...(orderEntity?.notes || {}),
      ...(subscriptionEntity?.notes || {}),
      ...(paymentEntity?.notes || {}),
    };

    const cycleMap: Record<string, 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL'> = {
      monthly: 'MONTHLY',
      quarterly: 'QUARTERLY',
      semi_annual: 'SEMI_ANNUAL',
      annual: 'ANNUAL',
    };

    const creditsMap: Record<string, number> = {
      monthly: 60,
      quarterly: 180,
      semi_annual: 360,
      annual: 720,
    };

    const monthsMap: Record<string, number> = {
      monthly: 1,
      quarterly: 3,
      semi_annual: 6,
      annual: 12,
    };

    // Helper: Resolve User ID without dangerous demo fallbacks in production
    const resolveUserId = async (subId?: string, paymentEmail?: string): Promise<string | null> => {
      if (notes.userId || notes.user_id) return notes.userId || notes.user_id;

      if (subId && prisma) {
        try {
          const u = await prisma.user.findFirst({ where: { subscriptionId: subId } });
          if (u) return u.id;
        } catch (e) {
          console.error('Failed to query user by subscriptionId:', e);
        }
      }

      if (paymentEmail && prisma) {
        try {
          const u = await prisma.user.findFirst({ where: { email: paymentEmail } });
          if (u) return u.id;
        } catch (e) {
          console.error('Failed to query user by email:', e);
        }
      }

      // Memory fallback for mock/local tests
      if (subId && memoryStore?.users) {
        for (const u of memoryStore.users.values()) {
          if (u.subscriptionId === subId) return u.id;
        }
      }

      return process.env.NODE_ENV === 'production' ? null : 'usr_demo_001';
    };

    // 2. Handle Subscription Activation & Recurring Autopay
    if (event === 'subscription.authenticated' || event === 'subscription.activated') {
      const subId = subscriptionEntity?.id || 'sub_razorpay_demo';
      const userId = await resolveUserId(subId, paymentEntity?.email);

      if (!userId) {
        console.error('No valid user found for subscription activation');
        return NextResponse.json({ error: 'User not identifiable from webhook notes' }, { status: 422 });
      }

      const planKey = (notes.planKey || 'monthly').toLowerCase();
      const billingCycle = cycleMap[planKey] || 'MONTHLY';
      const creditsToAdd = notes.creditsGranted
        ? parseInt(notes.creditsGranted, 10)
        : (creditsMap[planKey] || 60);

      const months = monthsMap[planKey] || 1;
      const currentPeriodEnd = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);

      await updateUserSubscription(userId, {
        subscriptionStatus: 'ACTIVE',
        subscriptionId: subId,
        isFirstMonthDiscountApplied: true,
        billingCycle,
        autoRenew: true,
        currentPeriodEnd,
      });

      await addCredits(
        userId,
        creditsToAdd,
        'MONTHLY_GRANT',
        `Razorpay Autopay activated: ${planKey} (${creditsToAdd} credits granted)`
      );

      return NextResponse.json({
        success: true,
        received: true,
        event,
        userId,
        billingCycle,
        creditsAdded: creditsToAdd,
      });
    }

    // 3. Handle Standard Plan Purchases & Captured Payments
    if (event === 'payment.captured' || event === 'order.paid') {
      // Branch A: Topup Credits
      if (notes.type === 'CREDIT_TOPUP') {
        const userId = await resolveUserId(undefined, paymentEntity?.email);
        if (!userId) {
          return NextResponse.json({ error: 'User not identifiable' }, { status: 422 });
        }
        const creditsToAdd = parseInt(notes.creditsToAdd, 10) || 75;

        const res = await addCredits(
          userId,
          creditsToAdd,
          'PAID_TOPUP',
          `Purchased pack of ${creditsToAdd} credits via Razorpay`
        );

        return NextResponse.json({
          success: true,
          received: true,
          event,
          creditsAdded: creditsToAdd,
          balanceRemaining: res?.balanceRemaining,
        });
      }

      // Branch B: Standard Subscription / One-time Plan Activation
      const subId = paymentEntity?.subscription_id || subscriptionEntity?.id;
      const userId = await resolveUserId(subId, paymentEntity?.email);

      if (!userId) {
        return NextResponse.json({ error: 'User not identifiable for payment' }, { status: 422 });
      }

      const planKey = (notes.planKey || 'monthly').toLowerCase();
      const billingCycle = cycleMap[planKey] || 'MONTHLY';
      const creditsToAdd = creditsMap[planKey] || 60;
      const months = monthsMap[planKey] || 1;
      const currentPeriodEnd = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);

      await updateUserSubscription(userId, {
        subscriptionStatus: 'ACTIVE',
        subscriptionId: subId || `pay_${paymentEntity?.id}`,
        billingCycle,
        autoRenew: true,
        currentPeriodEnd,
      });

      await addCredits(
        userId,
        creditsToAdd,
        'MONTHLY_GRANT',
        `Razorpay payment captured: ${planKey} (${creditsToAdd} credits granted)`
      );

      return NextResponse.json({
        success: true,
        received: true,
        event,
        userId,
        creditsAdded: creditsToAdd,
      });
    }

    // 4. Handle Recurring Cycle Billing
    if (event === 'subscription.charged') {
      const subId = subscriptionEntity?.id || paymentEntity?.subscription_id || 'sub_razorpay_demo';
      const userId = await resolveUserId(subId, paymentEntity?.email);

      if (!userId) {
        return NextResponse.json({ error: 'User not found for charged cycle' }, { status: 422 });
      }

      const planKey = (notes.planKey || 'monthly').toLowerCase();
      const creditsToAdd = creditsMap[planKey] || 60;

      await updateUserSubscription(userId, {
        subscriptionStatus: 'ACTIVE',
        autoRenew: true,
      });

      await addCredits(
        userId,
        creditsToAdd,
        'MONTHLY_GRANT',
        `Razorpay recurring cycle charged (${creditsToAdd} credits renewed)`
      );

      return NextResponse.json({
        success: true,
        received: true,
        event,
        userId,
        creditsRenewed: creditsToAdd,
      });
    }

    // 5. Handle Cancellations
    if (
      event === 'subscription.cancelled' ||
      event === 'subscription.paused' ||
      event === 'subscription.halted'
    ) {
      const subId = subscriptionEntity?.id || 'sub_razorpay_demo';
      const userId = await resolveUserId(subId, paymentEntity?.email);

      if (userId) {
        await updateUserSubscription(userId, {
          subscriptionStatus: 'CANCELED',
          autoRenew: false,
        });
      }

      return NextResponse.json({
        success: true,
        received: true,
        event,
        userId,
        subscriptionStatus: 'CANCELED',
      });
    }

    return NextResponse.json({ received: true, event });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error processing Razorpay webhook:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}