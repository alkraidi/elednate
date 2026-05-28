'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { medusa } from '@/lib/medusa/client';
import type { MedusaProduct, MedusaCollection } from '@/lib/medusa/types';
import { ProductCard } from '@/components/product/product-card';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default function CollectionPage() {
  const params = useParams<{ handle: string }>();
  const [data, setData] = useState<{ collection: MedusaCollection; products: MedusaProduct[] } | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medusa.collections
      .retrieve(params.handle)
      .then((r) => setData(r))
      .catch(() => setMissing(true))
      .finally(() => setLoading(false));
  }, [params.handle]);

  if (missing) return notFound();

  return (
    <div className="container-eledante py-12 md:py-16">
      <nav className="text-xs text-brand-text-muted mb-6"><Link href="/" className="hover:text-brand-ink">Home</Link> / <Link href="/shop" className="hover:text-brand-ink">Shop</Link> / <span className="text-brand-ink">{data?.collection.title || ''}</span></nav>
      <div className="text-center mb-12">
        <p className="label mb-3">Collection</p>
        <h1 className="font-display text-display text-brand-ink">{data?.collection.title || ''}</h1>
        <p className="mt-4 text-brand-text-secondary">{data?.products.length ?? 0} pieces</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/5] bg-brand-surface animate-pulse" />)}
        </div>
      ) : (data?.products?.length ?? 0) === 0 ? (
        <p className="text-center text-brand-text-secondary py-20">No pieces in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {data!.products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
