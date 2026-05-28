import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <Image src="https://images.pexels.com/photos/6475262/pexels-photo-6475262.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=2000" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-brand-ink/40" />
        <div className="relative h-full flex items-center justify-center text-center text-white px-6">
          <div className="max-w-3xl">
            <p className="font-label text-[11px] tracking-[0.3em] mb-4">Our Story</p>
            <h1 className="font-display text-hero text-white">A House of Gemologists</h1>
          </div>
        </div>
      </section>

      <section className="container-eledante py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label mb-4">Founders</p>
          <h2 className="font-display text-display text-brand-ink">Three scientists. One material.</h2>
          <p className="mt-6 font-sans text-lg text-brand-text-secondary leading-relaxed">
            Eledante was founded in Istanbul by three scientists — in geology, material science, and metallurgy. Bonded by a shared passion for the structural beauty of corundum and carbon, we set out to make fine jewelry that respects both the gemstone and the earth it came from.
          </p>
        </div>
      </section>

      <section className="bg-brand-surface py-20 md:py-28">
        <div className="container-eledante grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
            <Image src="https://images.pexels.com/photos/9953656/pexels-photo-9953656.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200" alt="Sapphire ring" fill className="object-cover" />
          </div>
          <div>
            <p className="label mb-4">Sourcing</p>
            <h3 className="font-display text-display text-brand-ink">From Sri Lanka and Madagascar.</h3>
            <p className="mt-6 text-brand-text-secondary leading-relaxed">Our sapphires come exclusively from two regions: the storied highlands of Sri Lanka, where stones of the most coveted blues have been mined for centuries, and the rich earth of Madagascar, home to a rare spectrum of teal, peach, and pink corundum.</p>
            <p className="mt-4 text-brand-text-secondary leading-relaxed">Each parcel is hand-selected on-site by our co-founders. Every stone passes a rigorous review for color, clarity, and ethical provenance before it earns its place in an Eledante piece.</p>
            <Link href="/supply-chain-ethics" className="mt-6 inline-block font-label text-[11px] text-brand-ink border-b border-brand-ink pb-1 hover:text-brand-gold hover:border-brand-gold">Our Supply Chain Ethics</Link>
          </div>
        </div>
      </section>

      <section className="container-eledante py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[{ t: 'Geology', d: 'Stone-by-stone provenance audits.' }, { t: 'Material Science', d: 'Refractive analysis to maximise brilliance.' }, { t: 'Metallurgy', d: 'Investment-grade 18K alloys, hand-finished.' }].map((p) => (
            <div key={p.t} className="border-t border-brand-border pt-6">
              <p className="font-label text-[11px] text-brand-gold">{p.t}</p>
              <p className="font-display text-2xl text-brand-ink mt-3">{p.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
