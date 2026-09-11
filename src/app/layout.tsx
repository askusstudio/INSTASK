import type { Metadata, Viewport } from 'next';
import './globals.css';

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

export const metadata: Metadata = {
  title: "INSTASK | Autonomous Instagram Growth & Publishing",
  description: "Automate your Instagram feed, creative templates, and daily scheduling with INSTASK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
