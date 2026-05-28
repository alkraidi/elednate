'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/medusa/format';
import { medusa } from '@/lib/medusa/client';
import { toast } from 'sonner';

type Step = 'address' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refresh } = useCart();
  const [step, setStep] = useState<Step>('address');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '', first_name: '', last_name: '', address_1: '', city: '', postal_code: '', country: 'TR', phone: '',
    card_number: '4242 4242 4242 4242', exp: '12/27', cvc: '123', name_on_card: '',
  });

  const items = cart?.items ?? [];

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function continueToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!cart) return;
    await medusa.carts.setEmail(cart.id, form.email).catch(() => {});
    await refresh();
    setStep('payment');
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!cart) return;
    setSubmitting(true);
    try {
      const res = await medusa.carts.complete(cart.id);
      toast.success('Order placed!', { description: `Order #${res.order.display_id}` });
      if (typeof window !== 'undefined') window.localStorage.removeItem('eledante_cart_id');
      router.push(`/account?order=${res.order.display_id}`);
    } catch (e: any) {
      toast.error('Checkout failed', { description: e?.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-eledante py-20 text-center">
        <h1 className="font-display text-display text-brand-ink">Your bag is empty.</h1>
        <Link href="/shop" className="btn-gold mt-6 inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-eledante py-10 md:py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-display text-brand-ink">Checkout</h1>
        <Link href="/cart" className="font-label text-[11px] text-brand-text-secondary hover:text-brand-ink">Back to Bag</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
        <div>
          <Stepper step={step} />
          {step === 'address' && (
            <form onSubmit={continueToPayment} className="space-y-5">
              <Section title="Contact">
                <Field label="Email"><input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-line" /></Field>
                <Field label="Phone"><input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-line" /></Field>
              </Section>
              <Section title="Shipping Address">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First name"><input required value={form.first_name} onChange={(e) => update('first_name', e.target.value)} className="input-line" /></Field>
                  <Field label="Last name"><input required value={form.last_name} onChange={(e) => update('last_name', e.target.value)} className="input-line" /></Field>
                </div>
                <Field label="Address"><input required value={form.address_1} onChange={(e) => update('address_1', e.target.value)} className="input-line" /></Field>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="City"><input required value={form.city} onChange={(e) => update('city', e.target.value)} className="input-line" /></Field>
                  <Field label="Postal code"><input required value={form.postal_code} onChange={(e) => update('postal_code', e.target.value)} className="input-line" /></Field>
                  <Field label="Country">
                    <select value={form.country} onChange={(e) => update('country', e.target.value)} className="input-line">
                      <option value="TR">Türkiye</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="AE">UAE</option>
                    </select>
                  </Field>
                </div>
              </Section>
              <button type="submit" className="btn-gold w-full">Continue to Payment</button>
            </form>
          )}
          {step === 'payment' && (
            <form onSubmit={placeOrder} className="space-y-5">
              <Section title="Payment">
                <div className="flex items-center justify-between mb-4 p-3 bg-brand-sapphire-tint">
                  <span className="text-sm text-brand-sapphire">Stripe</span>
                  <span className="font-label text-[10px] text-brand-sapphire">Secured · PCI compliant</span>
                </div>
                <Field label="Card number"><input required value={form.card_number} onChange={(e) => update('card_number', e.target.value)} className="input-line" /></Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry (MM/YY)"><input required value={form.exp} onChange={(e) => update('exp', e.target.value)} className="input-line" /></Field>
                  <Field label="CVC"><input required value={form.cvc} onChange={(e) => update('cvc', e.target.value)} className="input-line" /></Field>
                </div>
                <Field label="Name on card"><input required value={form.name_on_card} onChange={(e) => update('name_on_card', e.target.value)} className="input-line" /></Field>
                <p className="text-xs text-brand-text-muted mt-2">This is a demo checkout. The real storefront uses live Stripe (and iyzico in v2) configured in the Medusa backend.</p>
              </Section>
              <button disabled={submitting} type="submit" className="btn-gold w-full disabled:opacity-60">{submitting ? 'Placing order…' : `Place Order — ${formatPrice(cart?.total ?? 0)}`}</button>
              <button type="button" onClick={() => setStep('address')} className="mt-3 w-full text-center font-label text-[11px] text-brand-text-secondary hover:text-brand-ink">Back to Address</button>
            </form>
          )}
        </div>

        <aside className="bg-brand-surface p-6 md:p-8 self-start">
          <h2 className="font-label text-[10px] text-brand-ink">Order Summary</h2>
          <ul className="mt-5 space-y-4">
            {items.map((it) => (
              <li key={it.id} className="flex gap-3">
                <div className="relative w-14 h-16 bg-white shrink-0"><Image src={it.thumbnail} alt={it.product_title} fill sizes="56px" className="object-cover" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-brand-ink leading-tight line-clamp-2">{it.product_title}</p>
                  <p className="text-xs text-brand-text-muted">{it.variant_title} · Qty {it.quantity}</p>
                </div>
                <span className="text-sm text-brand-ink tabular-nums">{formatPrice(it.total)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 pt-6 border-t border-brand-border space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-brand-text-secondary">Subtotal</dt><dd>{formatPrice(cart?.subtotal ?? 0)}</dd></div>
            <div className="flex justify-between"><dt className="text-brand-text-secondary">Shipping</dt><dd>Free</dd></div>
          </dl>
          <div className="mt-4 pt-4 border-t border-brand-border flex justify-between">
            <span className="font-label text-[11px]">Total</span>
            <span className="text-xl tabular-nums">{formatPrice(cart?.total ?? 0)}</span>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .input-line { display:block; width:100%; background:transparent; border:0; border-bottom:1px solid #C8BFB0; padding:8px 0; font-size:14px; color:#1A1714; outline:none; }
        .input-line:focus { border-color:#B8973A; }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h3 className="font-label text-[11px] text-brand-ink mb-5">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-label text-[9px] text-brand-text-muted mb-1">{label}</span>
      {children}
    </label>
  );
}
function Stepper({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-3 mb-8 font-label text-[10px]">
      <span className={step === 'address' ? 'text-brand-ink' : 'text-brand-text-muted'}>1. Address</span>
      <span className="text-brand-text-muted">/</span>
      <span className={step === 'payment' ? 'text-brand-ink' : 'text-brand-text-muted'}>2. Payment</span>
    </div>
  );
}
