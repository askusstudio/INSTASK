import { NextResponse } from 'next/server';
import { updateUserSubscription, findUserById, memoryStore } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId = 'usr_demo_001' } = await req.json();

    let user = await findUserById(userId);
    if (!user) {
      user = Array.from(memoryStore.users.values())[0];
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const updated = await updateUserSubscription(user.id, {
      subscriptionStatus: 'ACTIVE',
      subscriptionId: `sub_sim_${Date.now()}`,
      stripeCustomerId: `cus_sim_${Date.now()}`,
      isFirstMonthDiscountApplied: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription successfully activated with FIRST50 discount applied!',
      user: updated,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
