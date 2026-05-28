'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/medusa/format';
import { Minus, Plus, X } from 'lucide-react';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : closeCart())}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 border-l border-brand-border">
        <SheetHeader className="px-6 py-5 border-b border-brand-border">
          <SheetTitle className="font-label text-[11px] text-brand-ink text-left">Your Bag ({cart?.item_count ?? 0})</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100%-60px)]">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <p className="font-display text-2xl text-brand-ink">Your bag is empty</p>
                <p className="mt-2 text-sm text-brand-text-secondary">Begin your journey with our finest pieces.</p>
                <Link href="/shop" onClick={closeCart} className="mt-6 btn-gold">Shop Now</Link>
              </div>
            )}
            {items.map((it) => (
              <div key={it.id} className="flex gap-4">
                <Link href={`/products/${it.product_handle}`} onClick={closeCart} className="shrink-0 block w-20 h-24 relative bg-brand-surface">
                  <Image src={it.thumbnail} alt={it.product_title} fill className="object-cover" sizes="80px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${it.product_handle}`} onClick={closeCart} className="text-sm text-brand-ink leading-snug hover:text-brand-gold">
                    {it.product_title}
                  </Link>
                  <p className="mt-1 text-xs text-brand-text-muted">{it.variant_title}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-brand-border">
                      <button aria-label="Decrease" className="p-2 hover:bg-brand-surface" onClick={() => updateQuantity(it.id, it.quantity - 1)}>
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-sm tabular-nums">{it.quantity}</span>
                      <button aria-label="Increase" className="p-2 hover:bg-brand-surface" onClick={() => updateQuantity(it.id, it.quantity + 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm text-brand-ink tabular-nums">{formatPrice(it.total)}</p>
                  </div>
                </div>
                <button aria-label="Remove" className="text-brand-text-muted hover:text-brand-ink" onClick={() => removeItem(it.id)}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          {items.length > 0 && (
            <div className="border-t border-brand-border px-6 py-5 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label text-[11px] text-brand-text-secondary">Subtotal</span>
                <span className="text-base text-brand-ink tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-brand-text-muted mb-4">Taxes and shipping calculated at checkout.</p>
              <Link href="/checkout" onClick={closeCart} className="btn-gold w-full">Checkout</Link>
              <Link href="/cart" onClick={closeCart} className="mt-2 block text-center text-xs font-label text-brand-text-secondary hover:text-brand-ink">View Bag</Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
