'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MedusaProduct } from '@/lib/medusa/types';
import { formatPrice } from '@/lib/medusa/format';
import { useCart } from '@/lib/cart-context';

export function ProductCard({ product }: { product: MedusaProduct }) {
  const { addItem, loading } = useCart();
  const primaryVariant = product.variants.find((v) => v.title.includes('US 6.5')) || product.variants[Math.floor(product.variants.length / 2)] || product.variants[0];
  const price = primaryVariant?.calculated_price.calculated_amount ?? 0;

  return (
    <div className="group relative bg-white border border-brand-border flex flex-col">
      <Link href={`/products/${product.handle}`} className="relative block bg-brand-surface aspect-[4/5] overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
        />
        {product.metadata.is_new_arrival && (
          <span className="absolute top-3 left-3 bg-brand-gold-muted text-brand-ink font-label text-[10px] px-2 py-1 rounded-btn">New</span>
        )}
      </Link>
      <div className="flex flex-col flex-1 px-4 py-4">
        <Link href={`/products/${product.handle}`} className="block">
          <h3 className="font-display text-lg leading-tight text-brand-ink hover:text-brand-gold transition-colors line-clamp-2 min-h-[3.2rem]">{product.title}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 bg-brand-sapphire-tint text-brand-sapphire font-label text-[9px]">
            {product.metadata.gemstone_color}
          </span>
          <span className="text-xs text-brand-text-muted">{product.metadata.total_carat_weight} TCW</span>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-sm text-brand-ink tabular-nums">{formatPrice(price)}</span>
          <button
            disabled={loading}
            onClick={(e) => { e.preventDefault(); addItem(primaryVariant.id, 1, product.title); }}
            className="font-label text-[10px] text-brand-ink border-b border-brand-ink pb-1 hover:text-brand-gold hover:border-brand-gold disabled:opacity-50"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
