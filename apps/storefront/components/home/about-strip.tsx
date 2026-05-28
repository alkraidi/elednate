import Image from 'next/image';
import Link from 'next/link';

export function AboutStrip() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src="https://images.unsplash.com/photo-1558346648-9757f2fa4474?auto=format&fit=crop&w=2000&q=80" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-brand-ink/85" />
      </div>
      <div className="relative container-eledante py-20 md:py-28 text-center text-white">
        <p className="font-label text-[11px] mb-5 text-brand-gold-light">About Eledante</p>
        <h2 className="font-display text-display text-white max-w-3xl mx-auto">
          We are three scientists in geology, material science, and metallurgy with a passion to create timeless pieces.
        </h2>
        <Link href="/about-us" className="mt-10 btn-gold inline-flex">Learn More</Link>
      </div>
    </section>
  );
}
