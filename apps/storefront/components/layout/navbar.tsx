'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, User, ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections/engagement-rings', label: 'Engagement' },
  { href: '/collections/wedding-rings', label: 'Wedding' },
  { href: '/collections/high-end-collection', label: 'High End' },
  { href: '/about-us', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { openCart, cart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const itemCount = cart?.item_count ?? 0;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-white border-b border-brand-border transition-shadow',
        scrolled && 'shadow-[0_1px_0_rgba(0,0,0,0.04)]'
      )}
    >
      <div className="container-eledante flex items-center justify-between py-5">
        {/* Left: links (desktop) / hamburger (mobile) */}
        <div className="flex items-center gap-8 w-1/3">
          <button className="lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen((v) => !v)}>
            <Menu size={20} />
          </button>
          <nav className="hidden lg:flex items-center gap-7">
            {LINKS.slice(0, 4).map((l) => (
              <Link key={l.href} href={l.href} className="font-label text-[11px] text-brand-ink hover:text-brand-gold transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: logo */}
        <Link href="/" className="flex-1 text-center" aria-label="Eledante home">
          <span className="font-display text-2xl md:text-3xl tracking-[0.22em] text-brand-ink">ELEDANTE</span>
        </Link>

        {/* Right: utility */}
        <div className="flex items-center justify-end gap-5 w-1/3">
          <Link href="/shop" aria-label="Search" className="hidden sm:block">
            <Search size={18} className="text-brand-ink hover:text-brand-gold transition-colors" />
          </Link>
          <Link href="/account/login" aria-label="Account">
            <User size={18} className="text-brand-ink hover:text-brand-gold transition-colors" />
          </Link>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative"
          >
            <ShoppingBag size={18} className="text-brand-ink hover:text-brand-gold transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[10px] font-medium min-w-[16px] h-4 rounded-full px-1 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-brand-border bg-white">
          <nav className="container-eledante py-4 flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-label text-xs text-brand-ink py-2"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
