import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { locales, defaultLocale, Locale } from './i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Read geolocation header provided automatically by Vercel edge network
  const country = req.headers.get('x-vercel-ip-country') || req.headers.get('x-user-country') || 'US';

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-country', country);
  req.headers.set('x-user-country', country);

  // 2. Detect locale and path
  const segments = pathname.split('/').filter(Boolean);
  const hasLocale = locales.includes(segments[0] as Locale);
  const currentLocale = hasLocale ? segments[0] : defaultLocale;
  const pathWithoutLocale = hasLocale ? '/' + segments.slice(1).join('/') : pathname;

  const isAuthRoute =
    pathWithoutLocale.startsWith('/login') ||
    pathWithoutLocale.startsWith('/signup') ||
    pathWithoutLocale === '/auth';

  const isProtectedRoute =
    pathWithoutLocale.startsWith('/dashboard') ||
    pathWithoutLocale.startsWith('/settings');

  // 3. Read NextAuth session token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'instask_super_secret_jwt_key_2026',
  });

  // Check for admin / test mode bypass (via URL query or cookie)
  const isBypassSession =
    req.nextUrl.searchParams.get('activated') === 'true' ||
    Boolean(req.nextUrl.searchParams.get('session')) ||
    req.cookies.get('instask_auth')?.value === 'true' ||
    req.cookies.get('instask_plan')?.value === 'pro';

  // 4. Unauthenticated user trying to access protected dashboard -> Redirect to login (Bypassed if testing)
  if (!token && isProtectedRoute && !isBypassSession) {
    const loginPath = hasLocale ? `/${currentLocale}/login` : '/login';
    const loginUrl = new URL(loginPath, req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Authenticated user visiting login/signup -> Forward directly to dashboard
  if (token && isAuthRoute) {
    const dashboardPath = hasLocale ? `/${currentLocale}/dashboard` : '/dashboard';
    return NextResponse.redirect(new URL(dashboardPath, req.url));
  }

  // 6. Hand off to next-intl with country header propagated
  const response = intlMiddleware(req);

  const rewriteUrl = response.headers.get('x-middleware-rewrite');
  if (rewriteUrl) {
    const rewrittenResponse = NextResponse.rewrite(new URL(rewriteUrl), {
      request: {
        headers: requestHeaders,
      },
    });

    response.headers.forEach((val, key) => {
      if (key !== 'x-middleware-rewrite') {
        rewrittenResponse.headers.set(key, val);
      }
    });
    rewrittenResponse.headers.set('x-user-country', country);
    return rewrittenResponse;
  }

  response.headers.set('x-user-country', country);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};