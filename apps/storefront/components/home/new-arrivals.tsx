'use client';

import { useQuery } from '@tanstack/react-query';
import { medusa } from '@/lib/medusa/client';
import { ProductCard } from '@/components/product/product-card';
import Link from 'next/link';

export function NewArrivals() {
  const { data, isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => medusa.products.list({ is_new_arrival: true, limit: 8 }),
  });
  return (
    <section className="container-eledante py-20 md:py-28">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="label mb-3">Just Arrived</p>
          <h2 className="font-display text-display text-brand-ink">New Arrivals</h2>
        </div>
        <Link href="/collections/new-arrivals" className="hidden md:inline-flex font-label text-[11px] text-brand-ink border-b border-brand-ink pb-1 hover:text-brand-gold hover:border-brand-gold">
          View All
        </Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/5] bg-brand-surface animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {data?.products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}
