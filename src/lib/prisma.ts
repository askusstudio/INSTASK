// INSTASK - Prisma ORM Singleton & Resilient Data Store
// Automatically connects to Supabase PostgreSQL when DATABASE_URL is provided,
// or provides an in-memory fallback store for zero-friction local demonstration.

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var memoryStore: InMemoryStore | undefined;
}

export type AuthProvider = 'EMAIL' | 'PHONE' | 'INSTAGRAM' | 'FACEBOOK';
export type SubscriptionStatus = 'INACTIVE' | 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';

export interface UserRecord {
  id: string;
  email?: string | null;
  phone?: string | null;
  provider: AuthProvider;
  providerAccountId?: string | null;
  name?: string | null;
  role: string;
  stripeCustomerId?: string | null;
  subscriptionId?: string | null;
  subscriptionStatus: SubscriptionStatus;
  isFirstMonthDiscountApplied: boolean;
  creditsBalance: number;
  monthlyCreditsLimit: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type TransactionType =
  | 'MONTHLY_GRANT'
  | 'PAID_TOPUP'
  | 'COMPETITOR_SCRAPE'
  | 'COPY_GENERATION'
  | 'IMAGE_RENDER'
  | 'REGENERATION';

export interface CreditTransactionRecord {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  description?: string | null;
  createdAt: Date | string;
}

export interface BrandRecord {
  id: string;
  userId: string;
  brandName: string;
  industry: string;
  country: string;
  currency: string;
  website?: string | null;
  instagramHandle?: string | null;
  logoUrl?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PostRecord {
  id: string;
  accountId: string;
  dayNumber: number;
  scheduledTime: Date | string;
  theme: string;
  headline: string;
  bodyBullets: string[];
  caption: string;
  hashtags: string[];
  templateId?: string | null;
  mediaType: 'IMAGE' | 'CAROUSEL' | 'REEL';
  mediaUrl?: string | null;
  mediaAspectRatio: '1:1' | '4:5';
  status: 'DRAFT' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  containerId?: string | null;
  livePostId?: string | null;
  errorMessage?: string | null;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AccountRecord {
  id: string;
  userId: string;
  igUserId?: string | null;
  username?: string | null;
  profilePictureUrl?: string | null;
  accessToken?: string | null;
  tokenExpiresAt?: Date | string | null;
  brandName: string;
  city?: string | null;
  country?: string | null;
  productSummary: string;
  brandColor?: string | null;
  logoUrl?: string | null;
  targetTimezone: string;
  language: string;
  autoPilotEnabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CompetitorRecord {
  id: string;
  accountId: string;
  handle: string;
  scrapedPostsCount: number;
  avgEngagementRate?: number | null;
  hashtagClusters?: string[] | null;
  topHooks?: string[] | null;
  rawMetrics?: Record<string, unknown> | null;
  lastScrapedAt?: Date | string | null;
  createdAt: Date | string;
}

// In-Memory fallback store for zero-friction testing & demo mode
class InMemoryStore {
  users: Map<string, UserRecord> = new Map();
  brands: Map<string, BrandRecord> = new Map();
  accounts: Map<string, AccountRecord> = new Map();
  competitors: Map<string, CompetitorRecord> = new Map();
  posts: Map<string, PostRecord> = new Map();
  creditTransactions: CreditTransactionRecord[] = [];

  constructor() {
    // Seed default demo user
    const demoUserId = 'usr_demo_001';
    this.users.set(demoUserId, {
      id: demoUserId,
      email: 'demo@instask.ai',
      phone: '+15551234567',
      provider: 'EMAIL',
      name: 'Luna Baker',
      role: 'OWNER',
      subscriptionStatus: 'ACTIVE',
      isFirstMonthDiscountApplied: false,
      creditsBalance: 60,
      monthlyCreditsLimit: 60,
      stripeCustomerId: 'cus_demo_123',
      subscriptionId: 'sub_demo_123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed default demo brand
    this.brands.set('brd_demo_001', {
      id: 'brd_demo_001',
      userId: demoUserId,
      brandName: 'Luna Artisan Bakery',
      industry: 'Artisan Bakery',
      country: 'US',
      currency: 'USD',
      website: 'https://lunabakery.com',
      instagramHandle: 'artisan_luna_bakery',
      logoUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed default demo account
    const demoAccountId = 'acc_demo_001';
    this.accounts.set(demoAccountId, {
      id: demoAccountId,
      userId: demoUserId,
      igUserId: process.env.META_IG_USER_ID || '17841400000000000',
      username: 'artisan_luna_bakery',
      profilePictureUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
      brandName: 'Luna Artisan Bakery',
      city: 'Austin, TX',
      country: 'USA',
      productSummary: 'Fresh sourdough breads, handcrafted viennoiseries, and specialty pour-over coffee.',
      brandColor: '#e1306c',
      targetTimezone: 'America/Chicago',
      language: 'en',
      autoPilotEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export const memoryStore = global.memoryStore || new InMemoryStore();
if (process.env.NODE_ENV !== 'production') global.memoryStore = memoryStore;

// Initialize Prisma client safely if DATABASE_URL is present
let prismaClient: PrismaClient | null = null;

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
    prismaClient = global.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== 'production') global.prisma = prismaClient;
  }
} catch {
  // Fall back silently to in-memory store
  prismaClient = null;
}

export const prisma = prismaClient;

export async function findUserById(id: string): Promise<UserRecord | null> {
  if (prisma) {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (user) return user as unknown as UserRecord;
    } catch (e) {
      console.warn('Prisma findUserById failed, falling back to memory store:', e);
    }
  }
  return memoryStore.users.get(id) || null;
}

export async function findUserByIdentifier(identifier: string, type: 'email' | 'phone'): Promise<UserRecord | null> {
  if (prisma) {
    try {
      const user = await prisma.user.findFirst({
        where: type === 'phone' ? { phone: identifier } : { email: identifier }
      });
      if (user) return user as unknown as UserRecord;
    } catch (e) {
      console.warn('Prisma findUserByIdentifier failed, falling back to memory store:', e);
    }
  }
  for (const user of memoryStore.users.values()) {
    if (type === 'phone' && user.phone === identifier) return user;
    if (type === 'email' && user.email === identifier) return user;
  }
  return null;
}

export async function upsertUser(data: {
  id?: string;
  email?: string | null;
  phone?: string | null;
  provider: AuthProvider;
  providerAccountId?: string | null;
  name?: string | null;
  subscriptionStatus?: SubscriptionStatus;
}): Promise<UserRecord> {
  const now = new Date();
  if (prisma) {
    try {
      if (data.id) {
        const updated = await prisma.user.upsert({
          where: { id: data.id },
          update: {
            email: data.email ?? undefined,
            phone: data.phone ?? undefined,
            name: data.name ?? undefined,
            provider: data.provider,
            providerAccountId: data.providerAccountId ?? undefined,
            subscriptionStatus: data.subscriptionStatus ?? undefined,
          },
          create: {
            id: data.id,
            email: data.email ?? null,
            phone: data.phone ?? null,
            name: data.name ?? null,
            provider: data.provider,
            providerAccountId: data.providerAccountId ?? null,
            subscriptionStatus: data.subscriptionStatus ?? 'INACTIVE',
          }
        });
        return updated as unknown as UserRecord;
      }
    } catch (e) {
      console.warn('Prisma upsertUser failed, falling back to memory store:', e);
    }
  }

  const existing = (data.id && memoryStore.users.get(data.id)) ||
    (data.email && Array.from(memoryStore.users.values()).find(u => u.email === data.email)) ||
    (data.phone && Array.from(memoryStore.users.values()).find(u => u.phone === data.phone));

  if (existing) {
    const updated: UserRecord = {
      ...existing,
      email: data.email ?? existing.email,
      phone: data.phone ?? existing.phone,
      name: data.name ?? existing.name,
      provider: data.provider ?? existing.provider,
      providerAccountId: data.providerAccountId ?? existing.providerAccountId,
      subscriptionStatus: data.subscriptionStatus ?? existing.subscriptionStatus,
      updatedAt: now,
    };
    memoryStore.users.set(existing.id, updated);
    return updated;
  }

  const newId = data.id || `usr_${Date.now()}`;
  const newUser: UserRecord = {
    id: newId,
    email: data.email ?? null,
    phone: data.phone ?? null,
    provider: data.provider,
    providerAccountId: data.providerAccountId ?? null,
    name: data.name ?? (data.email ? data.email.split('@')[0] : 'Creator'),
    role: 'OWNER',
    subscriptionStatus: data.subscriptionStatus || 'INACTIVE',
    isFirstMonthDiscountApplied: false,
    creditsBalance: 60,
    monthlyCreditsLimit: 60,
    createdAt: now,
    updatedAt: now,
  };
  memoryStore.users.set(newId, newUser);
  return newUser;
}

export async function getBrandByUserId(userId: string): Promise<BrandRecord | null> {
  if (prisma) {
    try {
      const brand = await prisma.brand.findUnique({ where: { userId } });
      if (brand) return brand as unknown as BrandRecord;
    } catch (e) {
      console.warn('Prisma getBrandByUserId failed, using memory store:', e);
    }
  }
  for (const b of memoryStore.brands.values()) {
    if (b.userId === userId) return b;
  }
  return null;
}

export async function upsertBrand(data: {
  userId: string;
  brandName: string;
  industry: string;
  country?: string;
  currency?: string;
  website?: string | null;
  instagramHandle?: string | null;
  logoUrl?: string | null;
}): Promise<BrandRecord> {
  const now = new Date();
  if (prisma) {
    try {
      const brand = await prisma.brand.upsert({
        where: { userId: data.userId },
        update: {
          brandName: data.brandName,
          industry: data.industry,
          country: data.country || 'US',
          currency: data.currency || 'USD',
          website: data.website ?? null,
          instagramHandle: data.instagramHandle ?? null,
          logoUrl: data.logoUrl ?? null,
        },
        create: {
          userId: data.userId,
          brandName: data.brandName,
          industry: data.industry,
          country: data.country || 'US',
          currency: data.currency || 'USD',
          website: data.website ?? null,
          instagramHandle: data.instagramHandle ?? null,
          logoUrl: data.logoUrl ?? null,
        }
      });
      return brand as unknown as BrandRecord;
    } catch (e) {
      console.warn('Prisma upsertBrand failed, falling back to memory store:', e);
    }
  }

  let existing = Array.from(memoryStore.brands.values()).find(b => b.userId === data.userId);
  if (existing) {
    existing = {
      ...existing,
      brandName: data.brandName,
      industry: data.industry,
      country: data.country || existing.country,
      currency: data.currency || existing.currency,
      website: data.website !== undefined ? data.website : existing.website,
      instagramHandle: data.instagramHandle !== undefined ? data.instagramHandle : existing.instagramHandle,
      logoUrl: data.logoUrl !== undefined ? data.logoUrl : existing.logoUrl,
      updatedAt: now,
    };
    memoryStore.brands.set(existing.id, existing);
    return existing;
  }

  const newId = `brd_${Date.now()}`;
  const newBrand: BrandRecord = {
    id: newId,
    userId: data.userId,
    brandName: data.brandName,
    industry: data.industry,
    country: data.country || 'US',
    currency: data.currency || 'USD',
    website: data.website || null,
    instagramHandle: data.instagramHandle || null,
    logoUrl: data.logoUrl || null,
    createdAt: now,
    updatedAt: now,
  };
  memoryStore.brands.set(newId, newBrand);
  return newBrand;
}

export async function updateUserSubscription(
  userId: string,
  subData: {
    subscriptionStatus: SubscriptionStatus;
    subscriptionId?: string;
    stripeCustomerId?: string;
    isFirstMonthDiscountApplied?: boolean;
  }
): Promise<UserRecord | null> {
  const now = new Date();
  if (prisma) {
    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: subData.subscriptionStatus,
          subscriptionId: subData.subscriptionId ?? undefined,
          stripeCustomerId: subData.stripeCustomerId ?? undefined,
          isFirstMonthDiscountApplied: subData.isFirstMonthDiscountApplied ?? undefined,
        }
      });
      return updated as unknown as UserRecord;
    } catch (e) {
      console.warn('Prisma updateUserSubscription failed, falling back to memory store:', e);
    }
  }

  const user = memoryStore.users.get(userId);
  if (user) {
    user.subscriptionStatus = subData.subscriptionStatus;
    if (subData.subscriptionId) user.subscriptionId = subData.subscriptionId;
    if (subData.stripeCustomerId) user.stripeCustomerId = subData.stripeCustomerId;
    if (subData.isFirstMonthDiscountApplied !== undefined) {
      user.isFirstMonthDiscountApplied = subData.isFirstMonthDiscountApplied;
    }
    user.updatedAt = now;
    memoryStore.users.set(userId, user);
    return user;
  }
  return null;
}
