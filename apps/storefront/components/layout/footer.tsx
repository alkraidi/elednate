'use client';

import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CARE = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/ask-gemologist', label: 'Ask a Gemologist' },
  { href: '/shipping-handling-policy', label: 'Shipping & Handling' },
  { href: '/return-refund-policy', label: 'Returns & Refunds' },
];
const QUICK = [
  { href: '/shop', label: 'Shop All' },
  { href: '/collections/engagement-rings', label: 'Engagement Rings' },
  { href: '/collections/high-end-collection', label: 'High End Collection' },
  { href: '/about-us', label: 'Our Story' },
];
const POLICIES = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/distance-sales-agreement', label: 'Distance Sales Agreement' },
  { href: '/gemstone-certificate', label: 'Gemstone Certificate' },
  { href: '/supply-chain-ethics', label: 'Supply Chain Ethics' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  return (
    <footer className="bg-brand-surface border-t border-brand-border mt-20">
      <div className="container-eledante py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand + Newsletter */}
          <div className="md:col-span-4">
            <Link href="/" className="font-display text-2xl tracking-[0.22em] text-brand-ink">ELEDANTE</Link>
            <p className="mt-4 text-sm text-brand-text-secondary leading-relaxed max-w-xs">
              Fine sapphire & diamond jewelry from Istanbul. Ethically sourced, masterfully crafted.
            </p>
            <form
              className="mt-6 flex items-center gap-2 max-w-sm"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                toast.success('Welcome to Eledante.', { description: 'You’ve been added to our list.' });
                setEmail('');
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-transparent border-b border-brand-border-strong py-2 text-sm text-brand-ink placeholder:text-brand-text-muted focus:outline-none focus:border-brand-gold"
              />
              <button type="submit" className="font-label text-[10px] text-brand-ink border-b border-brand-ink py-2">Subscribe</button>
            </form>
            <div className="mt-6 flex items-center gap-4">
              <a href="https://instagram.com" aria-label="Instagram" className="text-brand-ink hover:text-brand-gold"><Instagram size={18} /></a>
              <a href="https://facebook.com" aria-label="Facebook" className="text-brand-ink hover:text-brand-gold"><Facebook size={18} /></a>
            </div>
          </div>

          <FooterColumn title="Customer Care" links={CARE} />
          <FooterColumn title="Quick Links" links={QUICK} />
          <FooterColumn title="Policies" links={POLICIES} />
        </div>

        <div className="mt-14 pt-8 border-t border-brand-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-brand-text-muted">© 2024 Eledante. All rights reserved.</p>
          <p className="text-xs text-brand-text-muted">Istanbul, Türkiye · Ethically sourced from Sri Lanka & Madagascar</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="md:col-span-2 lg:col-span-2">
      <h4 className="font-label text-[10px] text-brand-ink mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-brand-text-secondary hover:text-brand-gold transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
