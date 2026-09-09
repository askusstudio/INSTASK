import type { Metadata } from 'next';
import './globals.css';

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
