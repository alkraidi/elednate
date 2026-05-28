'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  return (
    <div className="container-eledante py-12 md:py-20">
      <div className="text-center mb-12">
        <p className="label mb-3">Get In Touch</p>
        <h1 className="font-display text-display text-brand-ink">Contact Eledante</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-8">
          <InfoRow icon={MapPin} title="Atelier">
            KIREÇBURNU MAH. GONCALAR SK.<br />NO: 7 |C KAPI NO: 1<br />SARIYER / ISTANBUL / TÜRKİYE
          </InfoRow>
          <InfoRow icon={Phone} title="Phone">+90 539 234 88 66</InfoRow>
          <InfoRow icon={Clock} title="Hours">Monday – Saturday<br />8:00 AM – 4:00 PM (GMT+3)</InfoRow>
          <InfoRow icon={Mail} title="Email">hello@eledante.com</InfoRow>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); toast.success('Message sent.', { description: 'We’ll be in touch within 24 hours.' }); setForm({ name: '', email: '', message: '' }); }}
          className="space-y-5"
        >
          <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="contact-input" /></Field>
          <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="contact-input" /></Field>
          <Field label="Message"><textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="contact-input resize-none" /></Field>
          <button type="submit" className="btn-gold w-full md:w-auto">Send Message</button>
          <style jsx global>{`.contact-input { display:block; width:100%; background:transparent; border:0; border-bottom:1px solid #C8BFB0; padding:10px 0; font-size:14px; color:#1A1714; outline:none; font-family: inherit; } .contact-input:focus { border-color:#B8973A; }`}</style>
        </form>
      </div>
    </div>
  );
}
function InfoRow({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-10 h-10 rounded-full bg-brand-sapphire-tint flex items-center justify-center"><Icon size={18} className="text-brand-sapphire-light" /></div>
      <div>
        <p className="font-label text-[10px] text-brand-ink mb-1">{title}</p>
        <p className="text-sm text-brand-text-secondary leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block font-label text-[9px] text-brand-text-muted mb-1">{label}</span>{children}</label>;
}
