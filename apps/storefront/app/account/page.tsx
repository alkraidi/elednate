'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const sp = useSearchParams();
  const order = sp.get('order');
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') setHasToken(!!window.localStorage.getItem('eledante_token'));
  }, []);

  return (
    <div className="container-eledante py-12 md:py-16">
      <p className="label mb-3">Account</p>
      <h1 className="font-display text-display text-brand-ink">My Eledante</h1>

      {order && (
        <div className="mt-8 p-6 bg-brand-gold-muted border border-brand-gold/30">
          <p className="font-label text-[10px] text-brand-ink">Order Confirmed</p>
          <p className="font-display text-2xl text-brand-ink mt-2">Thank you. Order #{order} is being prepared.</p>
          <p className="text-sm text-brand-text-secondary mt-2">You’ll receive a confirmation email shortly. Estimated delivery: 5–7 business days.</p>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Order History" description="Track and review your previous orders." href="#" />
        <Card title="Profile" description="Manage your account details." href="#" />
        <Card title="Address Book" description="Saved shipping and billing addresses." href="#" />
      </div>

      {!hasToken && (
        <div className="mt-10 p-6 border border-brand-border">
          <p className="text-sm text-brand-text-secondary">You’re browsing as a guest. <Link href="/account/login" className="underline text-brand-ink">Sign in</Link> or <Link href="/account/register" className="underline text-brand-ink">create an account</Link> to view your order history.</p>
        </div>
      )}
    </div>
  );
}

function Card({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="block p-6 border border-brand-border hover:border-brand-gold transition-colors">
      <h3 className="font-display text-xl text-brand-ink">{title}</h3>
      <p className="text-sm text-brand-text-secondary mt-2">{description}</p>
    </Link>
  );
}
