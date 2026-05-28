'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { medusa } from '@/lib/medusa/client';
import type { HeroConfig } from '@/lib/medusa/types';

export function Hero() {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    medusa.config.hero().then((r) => setConfig(r.config)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!config || config.mode !== 'slideshow' || config.slides.length < 2) return;
    const interval = setInterval(
      () => setIdx((i) => (i + 1) % config.slides.length),
      config.slideshow_interval_seconds * 1000
    );
    return () => clearInterval(interval);
  }, [config]);

  if (!config) {
    return <section className="h-[92vh] min-h-[600px] w-full bg-brand-surface" aria-hidden />;
  }

  // Fallback slide content if admin left slides empty (e.g. video mode without overlay text)
  const fallbackSlide = {
    id: 'fallback',
    image_url: 'https://images.unsplash.com/photo-1543295204-2ae345412549?auto=format&fit=crop&w=2400&q=85',
    title: 'Discover the Essence of Timeless Beauty',
    subtitle: "Our gems don't just shine.",
    cta_text: 'Shop Now',
    cta_link: '/shop',
  };

  if (config.mode === 'video' && config.video_url) {
    const isMp4 = /\.mp4($|\?)/i.test(config.video_url);
    const videoSlide = config.slides[0] ?? fallbackSlide;
    return (
      <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-black">
        {isMp4 ? (
          <video src={config.video_url} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <iframe src={config.video_url} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/50" />
        <HeroOverlay slide={videoSlide} />
      </section>
    );
  }

  const slides = config.slides.length > 0 ? config.slides : [fallbackSlide];
  const slide = slides[idx] ?? slides[0];
  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-black">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${i === idx ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image src={s.image_url} alt={s.title} fill priority={i === 0} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/50" />
        </div>
      ))}
      <HeroOverlay slide={slide} />
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-[2px] transition-all ${i === idx ? 'w-10 bg-white' : 'w-5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function HeroOverlay({ slide }: { slide: HeroConfig['slides'][number] }) {
  return (
    <div className="relative z-10 h-full w-full flex items-center justify-center">
      <div className="text-center text-white px-6 max-w-3xl">
        <p className="font-label text-[11px] tracking-[0.3em] mb-6 opacity-90">Eledante — Istanbul</p>
        <h1 className="font-display text-hero text-white" style={{ textShadow: '0 2px 30px rgba(0,0,0,0.25)' }}>
          {slide.title}
        </h1>
        <p className="mt-6 font-sans text-subhead opacity-95">{slide.subtitle}</p>
        <Link href={slide.cta_link} className="btn-gold mt-10 inline-flex">
          {slide.cta_text}
        </Link>
      </div>
    </div>
  );
}
