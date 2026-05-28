import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { handle: 'dating-rings', title: 'Dating', image: 'https://images.pexels.com/photos/11567607/pexels-photo-11567607.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=600' },
  { handle: 'engagement-rings', title: 'Engagement', image: 'https://images.pexels.com/photos/9953656/pexels-photo-9953656.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=600' },
  { handle: 'wedding-rings', title: 'Wedding', image: 'https://images.unsplash.com/photo-1602751584547-5fb8e6c21740?auto=format&fit=crop&w=600&q=80' },
  { handle: 'anniversary', title: 'Anniversary', image: 'https://images.pexels.com/photos/14058109/pexels-photo-14058109.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=600' },
  { handle: 'gifts', title: 'Gifts', image: 'https://images.unsplash.com/photo-1591210244853-ea68b6126edf?auto=format&fit=crop&w=600&q=80' },
];

export function ShopByCategory() {
  return (
    <section className="container-eledante py-16 md:py-24 border-t border-brand-border">
      <div className="text-center mb-12">
        <p className="label mb-3">Shop By</p>
        <h2 className="font-display text-display text-brand-ink">Category</h2>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
        {CATEGORIES.map((c) => (
          <Link key={c.handle} href={`/collections/${c.handle}`} className="group text-center">
            <div className="relative aspect-square rounded-full overflow-hidden bg-brand-surface">
              <Image src={c.image} alt={c.title} fill sizes="(max-width: 768px) 33vw, 20vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <p className="mt-4 font-label text-[11px] text-brand-ink group-hover:text-brand-gold transition-colors">{c.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
