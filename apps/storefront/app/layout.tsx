import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Montserrat } from 'next/font/google';
import { Providers } from './providers';
import { SiteShell } from '@/components/layout/site-shell';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Eledante — Ethically Sourced Sapphire & Diamond Fine Jewelry',
  description:
    'Eledante — Premium fine jewelry from Istanbul. Sapphires & diamonds ethically sourced from Sri Lanka and Madagascar, crafted by master gemologists.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-white text-brand-ink antialiased">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
