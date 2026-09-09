import { NextAuthOptions } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
  findUserByIdentifier,
  findUserById,
  upsertUser,
  AuthProvider,
} from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Meta (Facebook / Instagram) OAuth Provider
    FacebookProvider({
      clientId: process.env.META_APP_ID || 'meta_app_id_placeholder',
      clientSecret: process.env.META_APP_SECRET || 'meta_app_secret_placeholder',
      authorization: {
        params: {
          scope: 'email,public_profile,instagram_basic,instagram_content_publish',
        },
      },
    }),

    // 2. Multi-Channel Phone OTP & Email Credentials Provider
    CredentialsProvider({
      id: 'credentials-or-otp',
      name: 'OTP or Email',
      credentials: {
        identifier: { label: 'Email or Phone', type: 'text' },
        otpOrPassword: { label: 'Code or Password', type: 'password' },
        type: { label: 'Type', type: 'text' }, // 'phone' | 'email'
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier) {
          throw new Error('Email or Phone number is required');
        }

        const type = (credentials.type === 'phone' ? 'phone' : 'email') as 'phone' | 'email';
        const identifier = credentials.identifier.trim();

        // 1. In sandbox / testing mode, allow 6-digit OTP verification or email login
        if (type === 'phone') {
          // If OTP was submitted, check it (or accept test demo OTP "123456" or any 6-digit code)
          const code = credentials.otpOrPassword;
          if (code && code.length !== 6) {
            throw new Error('Please enter a valid 6-digit verification code.');
          }
        }

        // 2. Query user or create a new one
        let user = await findUserByIdentifier(identifier, type);

        if (!user) {
          const provider: AuthProvider = type === 'phone' ? 'PHONE' : 'EMAIL';
          user = await upsertUser({
            email: type === 'email' ? identifier : null,
            phone: type === 'phone' ? identifier : null,
            provider,
            name: credentials.name || (type === 'email' ? identifier.split('@')[0] : identifier),
            subscriptionStatus: 'INACTIVE',
          });
        }

        return {
          id: user.id,
          email: user.email || undefined,
          name: user.name || user.phone || user.email || 'Creator',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        if (account?.provider) {
          token.provider = account.provider.toUpperCase();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { provider?: string }).provider = (token.provider as string) || 'EMAIL';

        // Check live subscription status
        const dbUser = await findUserById(token.sub);
        if (dbUser) {
          (session.user as { subscriptionStatus?: string }).subscriptionStatus = dbUser.subscriptionStatus;
          (session.user as { isFirstMonthDiscountApplied?: boolean }).isFirstMonthDiscountApplied =
            dbUser.isFirstMonthDiscountApplied;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  secret: process.env.NEXTAUTH_SECRET || 'instask_super_secret_jwt_key_2026',
};
