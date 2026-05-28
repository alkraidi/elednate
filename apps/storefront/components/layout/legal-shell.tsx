import Link from 'next/link';

export function LegalPageShell({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-eledante py-12 md:py-20 max-w-3xl">
      <nav className="text-xs text-brand-text-muted mb-6">
        <Link href="/" className="hover:text-brand-ink">Home</Link> / <span className="text-brand-ink">{title}</span>
      </nav>
      <p className="label mb-3">{eyebrow}</p>
      <h1 className="font-display text-display text-brand-ink">{title}</h1>
      <p className="text-xs text-brand-text-muted mt-2 mb-10">Last updated: {updated}</p>
      <article className="legal-prose">
        {children}
      </article>
      <style>{`
        .legal-prose h2 { font-family: var(--font-cormorant), serif; font-size: 1.5rem; color: #1A1714; margin: 2rem 0 0.75rem; font-weight: 500; }
        .legal-prose p, .legal-prose li { font-size: 0.95rem; color: #5C5449; line-height: 1.75; margin-bottom: 0.5rem; }
        .legal-prose ul, .legal-prose ol { padding-left: 1.25rem; margin-bottom: 1rem; }
        .legal-prose ul { list-style: disc; }
        .legal-prose ol { list-style: decimal; }
        .legal-prose a { color: #B8973A; text-decoration: underline; }
      `}</style>
    </div>
  );
}
