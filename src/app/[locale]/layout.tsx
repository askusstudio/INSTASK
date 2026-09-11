import React from 'react';
import type { Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { locales, rtlLocales, Locale } from '@/i18n';
import { GuidanceProvider } from '@/context/GuidanceContext';
import { BannerAlerts } from '@/components/ui/BannerAlerts';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  interactiveWidget: 'resizes-visual',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable request locale for next-intl
  unstable_setRequestLocale(locale);

  const messages = await getMessages();
  const isRtl = rtlLocales.includes(locale as Locale);

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col font-sans antialiased text-slate-900 bg-slate-50">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <GuidanceProvider>
            <BannerAlerts />
            <main className="flex-1">{children}</main>
          </GuidanceProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
