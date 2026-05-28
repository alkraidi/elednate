'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function AskGemologistPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'Sapphire identification', question: '' });
  return (
    <div className="container-eledante py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="label mb-3">Complimentary Service</p>
          <h1 className="font-display text-display text-brand-ink">Ask a Gemologist</h1>
          <p className="mt-4 text-brand-text-secondary">Our in-house gemologists — with academic backgrounds in geology and material science — answer your questions about sapphires and diamonds. No purchase necessary. Replies within 48 hours.</p>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success('Question received.', { description: 'A gemologist will reply within 48 hours.' }); setForm({ name: '', email: '', topic: 'Sapphire identification', question: '' }); }}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="ask-input" /></Field>
            <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="ask-input" /></Field>
          </div>
          <Field label="Topic">
            <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="ask-input">
              {['Sapphire identification', 'Stone valuation', 'Origin & provenance', 'Heat treatment', 'Certification', 'Custom design'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Your Question"><textarea required rows={6} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="ask-input resize-none" /></Field>
          <button type="submit" className="btn-gold">Submit Question</button>
          <style jsx global>{`.ask-input { display:block; width:100%; background:transparent; border:0; border-bottom:1px solid #C8BFB0; padding:10px 0; font-size:14px; color:#1A1714; outline:none; font-family: inherit; } .ask-input:focus { border-color:#B8973A; }`}</style>
        </form>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block font-label text-[9px] text-brand-text-muted mb-1">{label}</span>{children}</label>;
}
