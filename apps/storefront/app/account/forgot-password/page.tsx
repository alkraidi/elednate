'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <div className="container-eledante py-16 md:py-24">
      <div className="max-w-md mx-auto bg-white border border-brand-border p-8 md:p-12">
        <p className="label text-center mb-3">Account</p>
        <h1 className="font-display text-display text-brand-ink text-center">Reset Password</h1>
        <p className="text-center text-brand-text-secondary mt-2 mb-8">We’ll email you instructions to reset it.</p>
        {done ? (
          <div className="text-center text-sm text-brand-text-secondary">If an account exists for that email, a reset link is on its way.</div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); toast.success('Reset link sent.'); }} className="space-y-5">
            <label className="block">
              <span className="block font-label text-[9px] text-brand-text-muted mb-1">Email</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full bg-transparent border-0 border-b border-brand-border-strong py-2 text-sm focus:outline-none focus:border-brand-gold" />
            </label>
            <button type="submit" className="btn-gold w-full">Send Reset Link</button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-brand-text-secondary"><Link href="/account/login" className="underline text-brand-ink">Back to sign in</Link></p>
      </div>
    </div>
  );
}
