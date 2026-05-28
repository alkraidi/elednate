import Image from 'next/image';
import Link from 'next/link';

const TILES = [
  { src: 'https://images.pexels.com/photos/9953656/pexels-photo-9953656.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200', alt: 'Sapphire and diamond ring', large: true },
  { src: 'https://images.unsplash.com/photo-1591210244853-ea68b6126edf?auto=format&fit=crop&w=1200&q=80', alt: 'Gold diamond ring' },
  { src: 'https://images.unsplash.com/photo-1602751584581-2e0372975b46?auto=format&fit=crop&w=1200&q=80', alt: 'Silver ring' },
  { src: 'https://images.unsplash.com/photo-1717605383891-e25d2cbf4203?auto=format&fit=crop&w=1200&q=80', alt: 'Luxury jewellery' },
];

export function HighEndCollection() {
  return (
    <section className="bg-brand-surface py-20 md:py-28">
      <div className="container-eledante">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <p className="label mb-3">Heritage Pieces</p>
            <h2 className="font-display text-display text-brand-ink">High End Collection</h2>
            <p className="mt-4 text-brand-text-secondary max-w-xl">Rare gemstones and one-of-a-kind compositions for the connoisseur.</p>
          </div>
          <Link href="/collections/high-end-collection" className="btn-outline mt-6 md:mt-0">Explore Now</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {TILES.map((t, i) => (
            <Link
              key={i}
              href="/collections/high-end-collection"
              className={`relative overflow-hidden bg-white ${t.large ? 'col-span-2 row-span-2 aspect-square md:aspect-auto md:h-full' : 'aspect-square'}`}
            >
              <Image src={t.src} alt={t.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover hover:scale-[1.04] transition-transform duration-700" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
