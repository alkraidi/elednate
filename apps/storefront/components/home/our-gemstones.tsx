import Image from 'next/image';
import Link from 'next/link';

export function OurGemstones() {
  return (
    <section className="container-eledante py-20 md:py-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <p className="label mb-4">Our Gemstones</p>
          <h2 className="font-display text-display text-brand-ink">Sourced from where the earth shines brightest.</h2>
          <p className="mt-6 font-sans text-base md:text-lg text-brand-text-secondary leading-relaxed max-w-lg">
            Sourced ethically from the heart of Sri Lanka and Madagascar, our gems are carefully faceted to perfection by master craftsmen. Every stone passes a rigorous review by our in-house gemologists before it earns its place in an Eledante piece.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link href="/about-us" className="btn-outline">Our Story</Link>
            <Link href="/supply-chain-ethics" className="font-label text-[11px] text-brand-ink border-b border-brand-ink pb-1 hover:text-brand-gold hover:border-brand-gold">Supply Chain Ethics</Link>
          </div>
        </div>
        <div className="order-1 md:order-2 relative aspect-[4/5] overflow-hidden bg-brand-surface">
          <Image src="https://images.pexels.com/photos/6475262/pexels-photo-6475262.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200" alt="Raw sapphire being inspected" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
