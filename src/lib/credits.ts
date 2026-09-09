import { prisma, memoryStore } from "@/lib/prisma";

export type CreditDeductionType =
  | "COMPETITOR_SCRAPE"
  | "COPY_GENERATION"
  | "IMAGE_RENDER"
  | "REGENERATION";

export type CreditTopupType = "MONTHLY_GRANT" | "PAID_TOPUP";

export const TOPUP_BUNDLES = {
  tier_small: {
    key: 'tier_small',
    credits: 25,
    priceInCents: 500,
    priceFormatted: '$5',
    inrFormatted: '₹399',
    description: '25 Extra Credits for post regeneration & competitor lookups',
  },
  tier_medium: {
    key: 'tier_medium',
    credits: 75,
    priceInCents: 1200,
    priceFormatted: '$12',
    inrFormatted: '₹899',
    popular: true,
    description: '75 Extra Credits • Best value for active brands',
  },
  tier_large: {
    key: 'tier_large',
    credits: 200,
    priceInCents: 2500,
    priceFormatted: '$25',
    inrFormatted: '₹1,899',
    description: '200 Power Credits for heavy multi-campaign testing',
  },
};

export interface CreditResult {
  success: boolean;
  balanceRemaining?: number;
  error?: string;
}

/**
 * Atomic credit deduction gatekeeper.
 * Verifies that the user exists and has sufficient balance before executing any expensive AI/scraper pipeline.
 */
export async function deductCredits(
  userId: string,
  amount: number,
  type: CreditDeductionType,
  description: string
): Promise<CreditResult> {
  // 1. Live Prisma Transaction (Supabase PostgreSQL)
  if (prisma) {
    try {
      return await prisma.$transaction(async (tx) => {
        let user = await tx.user.findUnique({
          where: { id: userId },
          select: { creditsBalance: true },
        });

        if (!user && userId === 'usr_demo_001') {
          user = await tx.user.upsert({
            where: { id: 'usr_demo_001' },
            create: {
              id: 'usr_demo_001',
              email: 'demo@instask.ai',
              name: 'Luna Baker',
              role: 'OWNER',
              subscriptionStatus: 'ACTIVE',
              creditsBalance: 60,
              monthlyCreditsLimit: 60,
            },
            update: {},
            select: { creditsBalance: true },
          });
        }

        if (!user) {
          return { success: false, error: "User not found." };
        }

        if (user.creditsBalance < amount) {
          return {
            success: false,
            error: `Insufficient credits. You need ${amount} credits, but only have ${user.creditsBalance} remaining. Please top up your balance.`,
          };
        }

        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { creditsBalance: { decrement: amount } },
          select: { creditsBalance: true },
        });

        await tx.creditTransaction.create({
          data: {
            userId,
            amount: -amount,
            type,
            description,
          },
        });

        return { success: true, balanceRemaining: updatedUser.creditsBalance };
      });
    } catch (e) {
      console.warn("Prisma credit transaction failed, falling back to memoryStore:", e);
    }
  }

  // 2. Resilient In-Memory Transaction Fallback
  const user = memoryStore.users.get(userId);
  if (!user) {
    return { success: false, error: "User not found." };
  }

  const currentBalance = user.creditsBalance ?? 60;
  if (currentBalance < amount) {
    return {
      success: false,
      error: `Insufficient credits. You need ${amount} credits, but only have ${currentBalance} remaining. Please top up your balance.`,
    };
  }

  user.creditsBalance = currentBalance - amount;
  user.updatedAt = new Date();

  memoryStore.creditTransactions.push({
    id: `ctx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    amount: -amount,
    type,
    description,
    createdAt: new Date(),
  });

  return { success: true, balanceRemaining: user.creditsBalance };
}

/**
 * Add credits to user balance (for Stripe top-up purchases or monthly renewal grants)
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: CreditTopupType,
  description: string
): Promise<CreditResult> {
  if (prisma) {
    try {
      return await prisma.$transaction(async (tx) => {
        let user = await tx.user.findUnique({ where: { id: userId } });
        if (!user && userId === 'usr_demo_001') {
          await tx.user.upsert({
            where: { id: 'usr_demo_001' },
            create: {
              id: 'usr_demo_001',
              email: 'demo@instask.ai',
              name: 'Luna Baker',
              role: 'OWNER',
              subscriptionStatus: 'ACTIVE',
              creditsBalance: 60,
              monthlyCreditsLimit: 60,
            },
            update: {},
          });
        }

        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { creditsBalance: { increment: amount } },
          select: { creditsBalance: true },
        });

        await tx.creditTransaction.create({
          data: {
            userId,
            amount,
            type,
            description,
          },
        });

        return { success: true, balanceRemaining: updatedUser.creditsBalance };
      });
    } catch (e) {
      console.warn("Prisma addCredits failed, falling back to memoryStore:", e);
    }
  }

  const user = memoryStore.users.get(userId);
  if (!user) {
    return { success: false, error: "User not found." };
  }

  user.creditsBalance = (user.creditsBalance ?? 60) + amount;
  user.updatedAt = new Date();

  memoryStore.creditTransactions.push({
    id: `ctx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    amount,
    type,
    description,
    createdAt: new Date(),
  });

  return { success: true, balanceRemaining: user.creditsBalance };
}

/**
 * Retrieve current credit balance for user
 */
export async function getUserCredits(userId: string): Promise<number> {
  if (prisma) {
    try {
      let user = await prisma.user.findUnique({
        where: { id: userId },
        select: { creditsBalance: true },
      });
      if (!user && userId === 'usr_demo_001') {
        user = await prisma.user.upsert({
          where: { id: 'usr_demo_001' },
          create: {
            id: 'usr_demo_001',
            email: 'demo@instask.ai',
            name: 'Luna Baker',
            role: 'OWNER',
            subscriptionStatus: 'ACTIVE',
            creditsBalance: 60,
            monthlyCreditsLimit: 60,
          },
          update: {},
          select: { creditsBalance: true },
        });
      }
      if (user) return user.creditsBalance;
    } catch {
      // Fall back
    }
  }

  const user = memoryStore.users.get(userId);
  return user?.creditsBalance ?? 60;
}
