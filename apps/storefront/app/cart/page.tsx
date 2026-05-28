'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/medusa/format';
import { Minus, Plus, X } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeItem } = useCart();
  const items = cart?.items ?? [];

  return (
    <div className="container-eledante py-10 md:py-16">
      <h1 className="font-display text-display text-brand-ink mb-10">Your Bag</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-brand-ink mb-4">Your bag is empty.</p>
          <Link href="/shop" className="btn-gold">Browse the Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          <div className="divide-y divide-brand-border">
            {items.map((it) => (
              <div key={it.id} className="flex gap-5 py-6">
                <Link href={`/products/${it.product_handle}`} className="relative w-28 h-32 shrink-0 bg-brand-surface">
                  <Image src={it.thumbnail} alt={it.product_title} fill sizes="112px" className="object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${it.product_handle}`} className="font-display text-lg text-brand-ink hover:text-brand-gold">{it.product_title}</Link>
                  <p className="mt-1 text-xs text-brand-text-secondary">{it.variant_title}</p>
                  <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center border border-brand-border">
                      <button className="p-2 hover:bg-brand-surface" onClick={() => updateQuantity(it.id, it.quantity - 1)}><Minus size={12} /></button>
                      <span className="px-3 text-sm tabular-nums">{it.quantity}</span>
                      <button className="p-2 hover:bg-brand-surface" onClick={() => updateQuantity(it.id, it.quantity + 1)}><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeItem(it.id)} className="font-label text-[10px] text-brand-text-secondary hover:text-brand-error inline-flex items-center gap-1"><X size={12} /> Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-brand-ink tabular-nums">{formatPrice(it.total)}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-brand-surface p-6 md:p-8 self-start">
            <h2 className="font-display text-heading text-brand-ink">Order Summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <Row label="Subtotal" value={formatPrice(cart?.subtotal ?? 0)} />
              <Row label="Shipping" value="Complimentary" />
              <Row label="Taxes" value="Calculated at checkout" />
            </dl>
            <div className="mt-6 pt-6 border-t border-brand-border flex items-center justify-between">
              <span className="font-label text-[11px]">Total</span>
              <span className="text-xl tabular-nums">{formatPrice(cart?.total ?? 0)}</span>
            </div>
            <Link href="/checkout" className="btn-gold mt-6 w-full">Proceed to Checkout</Link>
            <Link href="/shop" className="mt-3 block text-center font-label text-[11px] text-brand-text-secondary hover:text-brand-ink">Continue Shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-brand-text-secondary">{label}</dt>
      <dd className="text-brand-ink">{value}</dd>
    </div>
  );
}
