import Image from 'next/image';
import Link from 'next/link';

export function CategoryTiles() {
  return (
    <section className="container-eledante py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <CategoryTile
          image="https://images.pexels.com/photos/17232934/pexels-photo-17232934.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1400"
          eyebrow="For Every Moment"
          title="Everyday"
          href="/collections/everyday-rings"
        />
        <CategoryTile
          image="https://images.pexels.com/photos/14058109/pexels-photo-14058109.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1400"
          eyebrow="Mark The Moment"
          title="Special Occasions"
          href="/collections/anniversary"
        />
      </div>
    </section>
  );
}

function CategoryTile({ image, eyebrow, title, href }: { image: string; eyebrow: string; title: string; href: string }) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-brand-surface">
      <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 text-white">
        <p className="font-label text-[11px] mb-3 opacity-90">{eyebrow}</p>
        <h3 className="font-display text-display text-white">{title}</h3>
        <span className="mt-5 inline-block font-label text-[11px] border-b border-white pb-1 group-hover:border-brand-gold-light group-hover:text-brand-gold-light transition-colors">Browse Collection</span>
      </div>
    </Link>
  );
}
