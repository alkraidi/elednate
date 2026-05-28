'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { medusa } from '@/lib/medusa/client';
import type { MedusaProduct, MedusaCollection } from '@/lib/medusa/types';
import { ProductCard } from '@/components/product/product-card';

const COLORS = ['Blue', 'Royal Blue', 'Teal', 'Yellow', 'Peach', 'Cornflower Blue', 'Pink'];
const METALS = ['White Gold', 'Yellow Gold', 'Rose Gold'];

export default function ShopPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [collections, setCollections] = useState<MedusaCollection[]>([]);
  const [loading, setLoading] = useState(true);

  const collection = params.get('collection') || '';
  const color = params.get('color') || '';
  const metal = params.get('metal') || '';
  const max = params.get('max') || '';

  useEffect(() => { medusa.collections.list().then((r) => setCollections(r.collections)); }, []);

  useEffect(() => {
    setLoading(true);
    medusa.products.list({
      collection_handle: collection || undefined,
      gemstone_color: color || undefined,
      metal: metal || undefined,
      max_price: max ? Number(max) * 100 : undefined,
      limit: 100,
    }).then((r) => setProducts(r.products)).finally(() => setLoading(false));
  }, [collection, color, metal, max]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    router.push(`/shop?${next.toString()}`);
  }

  return (
    <div className="container-eledante py-12 md:py-16">
      <div className="text-center mb-10">
        <p className="label mb-3">Shop All</p>
        <h1 className="font-display text-display text-brand-ink">The Collection</h1>
        <p className="mt-4 text-brand-text-secondary max-w-xl mx-auto">Sapphires & diamonds, ethically sourced and masterfully crafted.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
        <aside className="md:sticky md:top-32 self-start">
          <FilterBlock title="Collection">
            {collections.map((c) => (
              <FilterChip key={c.id} active={collection === c.handle} onClick={() => update('collection', collection === c.handle ? '' : c.handle)}>
                {c.title}
              </FilterChip>
            ))}
          </FilterBlock>
          <FilterBlock title="Gemstone Color">
            {COLORS.map((c) => (
              <FilterChip key={c} active={color === c} onClick={() => update('color', color === c ? '' : c)}>{c}</FilterChip>
            ))}
          </FilterBlock>
          <FilterBlock title="Metal">
            {METALS.map((m) => (
              <FilterChip key={m} active={metal === m} onClick={() => update('metal', metal === m ? '' : m)}>{m}</FilterChip>
            ))}
          </FilterBlock>
          <FilterBlock title="Max Price (USD)">
            <input
              type="number"
              defaultValue={max}
              onBlur={(e) => update('max', e.target.value)}
              placeholder="e.g. 3000"
              className="w-full bg-transparent border-b border-brand-border-strong py-2 text-sm focus:outline-none focus:border-brand-gold"
            />
          </FilterBlock>
          {(collection || color || metal || max) && (
            <button onClick={() => router.push('/shop')} className="font-label text-[10px] text-brand-ink border-b border-brand-ink mt-2 pb-0.5 hover:text-brand-gold hover:border-brand-gold">Clear All</button>
          )}
        </aside>

        <div>
          <p className="text-xs font-label text-brand-text-muted mb-5">{products.length} pieces</p>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/5] bg-brand-surface animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-brand-text-secondary py-20">No pieces match these filters.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="font-label text-[10px] text-brand-ink mb-3">{title}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function FilterChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-left text-sm py-1 transition-colors ${active ? 'text-brand-gold' : 'text-brand-text-secondary hover:text-brand-ink'}`}
    >
      {active && <span className="mr-1">•</span>}{children}
    </button>
  );
}
