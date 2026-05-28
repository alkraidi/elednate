import { RotateCcw, MessageCircleQuestion, Globe2, Sparkles } from 'lucide-react';

const SERVICES = [
  { icon: RotateCcw, label: '30 Days Return', href: '/return-refund-policy' },
  { icon: MessageCircleQuestion, label: 'Ask a Gemologist', href: '/ask-gemologist' },
  { icon: Globe2, label: 'World Wide Shipping', href: '/shipping-handling-policy' },
  { icon: Sparkles, label: 'Design Your Own', href: '/contact' },
];

export function ServicesRow() {
  return (
    <section className="container-eledante py-16 md:py-20 border-t border-brand-border">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {SERVICES.map((s) => (
          <a key={s.label} href={s.href} className="flex flex-col items-center text-center gap-3 group">
            <div className="w-14 h-14 rounded-full bg-brand-sapphire-tint flex items-center justify-center group-hover:bg-brand-gold-muted transition-colors">
              <s.icon size={22} className="text-brand-sapphire-light group-hover:text-brand-gold transition-colors" />
            </div>
            <p className="font-label text-[11px] text-brand-ink">{s.label}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
