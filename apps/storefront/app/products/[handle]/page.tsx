'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { medusa } from '@/lib/medusa/client';
import type { MedusaProduct } from '@/lib/medusa/types';
import { formatPrice } from '@/lib/medusa/format';
import { useCart } from '@/lib/cart-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ProductCard } from '@/components/product/product-card';
import { Award, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function ProductPage() {
  const params = useParams<{ handle: string }>();
  const { addItem, loading } = useCart();
  const [product, setProduct] = useState<MedusaProduct | null>(null);
  const [missing, setMissing] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [related, setRelated] = useState<MedusaProduct[]>([]);

  useEffect(() => {
    medusa.products.retrieve(params.handle).then((r) => {
      setProduct(r.product);
      const mid = r.product.variants[Math.floor(r.product.variants.length / 2)];
      setSelectedVariant(mid.id);
    }).catch(() => setMissing(true));
  }, [params.handle]);

  useEffect(() => {
    if (!product) return;
    medusa.products.list({ limit: 4 }).then((r) => setRelated(r.products.filter((p) => p.id !== product.id).slice(0, 4)));
  }, [product]);

  if (missing) return notFound();
  if (!product) {
    return <div className="container-eledante py-20"><div className="animate-pulse h-96 bg-brand-surface" /></div>;
  }

  const variant = product.variants.find((v) => v.id === selectedVariant) || product.variants[0];
  const price = variant.calculated_price.calculated_amount;
  const m = product.metadata;

  return (
    <div className="container-eledante py-10 md:py-16">
      <nav className="text-xs text-brand-text-muted mb-6"><Link href="/" className="hover:text-brand-ink">Home</Link> / <Link href="/shop" className="hover:text-brand-ink">Shop</Link> / <span className="text-brand-ink">{product.title}</span></nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square bg-brand-surface overflow-hidden">
            <Image src={product.images[selectedImageIdx]?.url || product.thumbnail} alt={product.title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setSelectedImageIdx(i)} className={`relative aspect-square bg-brand-surface overflow-hidden ${i === selectedImageIdx ? 'ring-1 ring-brand-gold' : 'opacity-70 hover:opacity-100'}`}>
                  <Image src={img.url} alt="" fill sizes="100px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:pl-4">
          <p className="label mb-3">{product.subtitle}</p>
          <h1 className="font-display text-heading md:text-display text-brand-ink leading-[1.1]">{product.title}</h1>
          <p className="mt-4 text-2xl text-brand-ink tabular-nums">{formatPrice(price)}</p>
          <p className="mt-1 text-xs text-brand-text-muted">Or 4 interest-free payments of {formatPrice(price / 4)}</p>

          {/* Gemstone summary chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Chip>{m.gemstone_type}</Chip>
            <Chip tone="sapphire">{m.gemstone_color}</Chip>
            <Chip>{m.total_carat_weight} TCW</Chip>
            <Chip>{m.metal}</Chip>
            <Chip>{m.origin}</Chip>
          </div>

          {/* Size selector */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <p className="font-label text-[10px] text-brand-ink">Ring Size</p>
              <Link href="/contact" className="text-xs text-brand-text-secondary underline">Size Guide</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  className={`min-w-[56px] px-3 py-2 border text-sm transition-colors ${
                    v.id === selectedVariant
                      ? 'border-brand-ink bg-brand-ink text-white'
                      : 'border-brand-border text-brand-ink hover:border-brand-border-strong'
                  }`}
                >
                  {v.title.replace('US ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <button
            disabled={loading}
            onClick={() => addItem(variant.id, 1, product.title)}
            className="btn-gold mt-8 w-full disabled:opacity-50"
          >Add to Bag</button>
          <Link href="/ask-gemologist" className="mt-3 block text-center font-label text-[11px] text-brand-text-secondary hover:text-brand-ink">Ask a Gemologist about this piece</Link>

          {/* Trust strip */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-brand-border pt-6">
            <Trust icon={Award} text="GIA Certified" />
            <Trust icon={ShieldCheck} text="Lifetime Warranty" />
            <Trust icon={Truck} text="Free Worldwide Shipping" />
            <Trust icon={RotateCcw} text="30-Day Returns" />
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="desc" className="border-brand-border">
              <AccordionTrigger className="font-label text-[11px] text-brand-ink py-4 hover:no-underline">Description</AccordionTrigger>
              <AccordionContent className="text-sm text-brand-text-secondary leading-relaxed pb-6">{product.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="gemstone" className="border-brand-border">
              <AccordionTrigger className="font-label text-[11px] text-brand-ink py-4 hover:no-underline">Gemstone Details</AccordionTrigger>
              <AccordionContent className="text-sm text-brand-text-secondary leading-relaxed pb-6">
                <dl className="grid grid-cols-2 gap-y-2 gap-x-6">
                  <DD label="Type" value={m.gemstone_type} />
                  <DD label="Color" value={m.gemstone_color} />
                  <DD label="Total Carat Weight" value={`${m.total_carat_weight} TCW`} />
                  <DD label="Metal" value={m.metal} />
                  <DD label="Origin" value={m.origin} />
                  <DD label="Certificate" value={m.certificate || 'GIA Certified'} />
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping" className="border-brand-border">
              <AccordionTrigger className="font-label text-[11px] text-brand-ink py-4 hover:no-underline">Shipping & Returns</AccordionTrigger>
              <AccordionContent className="text-sm text-brand-text-secondary leading-relaxed pb-6">Complimentary insured shipping worldwide. Each piece is hand-finished in our Istanbul atelier and ships within 5–7 business days. Returns accepted within 30 days, no questions asked.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="cert" className="border-brand-border">
              <AccordionTrigger className="font-label text-[11px] text-brand-ink py-4 hover:no-underline">Certification</AccordionTrigger>
              <AccordionContent className="text-sm text-brand-text-secondary leading-relaxed pb-6">Every Eledante piece arrives with an independent gemological certificate verifying gemstone origin, color, clarity, cut, and total carat weight.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="font-display text-heading text-brand-ink mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone?: 'sapphire' }) {
  const cls = tone === 'sapphire'
    ? 'bg-brand-sapphire-tint text-brand-sapphire'
    : 'bg-brand-gold-muted text-brand-ink';
  return <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-label ${cls}`}>{children}</span>;
}
function Trust({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={18} className="text-brand-gold" />
      <p className="text-xs text-brand-text-secondary">{text}</p>
    </div>
  );
}
function DD({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-label text-[9px] text-brand-text-muted">{label}</dt>
      <dd className="text-sm text-brand-ink">{value}</dd>
    </div>
  );
}
