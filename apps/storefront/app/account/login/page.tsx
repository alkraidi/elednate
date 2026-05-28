'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { medusa } from '@/lib/medusa/client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await medusa.customers.login(email, password);
      if (typeof window !== 'undefined') window.localStorage.setItem('eledante_token', r.token);
      toast.success('Welcome back.');
      router.push('/account');
    } catch (e: any) {
      toast.error('Could not sign you in', { description: e?.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Sign In" subtitle="Welcome back to Eledante.">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Email"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" /></Field>
        <Field label="Password"><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" /></Field>
        <div className="flex items-center justify-between">
          <Link href="/account/forgot-password" className="text-xs text-brand-text-secondary underline hover:text-brand-ink">Forgot password?</Link>
        </div>
        <button disabled={submitting} type="submit" className="btn-gold w-full">{submitting ? 'Signing in…' : 'Sign In'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-brand-text-secondary">New to Eledante? <Link href="/account/register" className="underline text-brand-ink">Create an account</Link></p>
      <style jsx global>{`.auth-input { display:block; width:100%; background:transparent; border:0; border-bottom:1px solid #C8BFB0; padding:10px 0; font-size:14px; color:#1A1714; outline:none; } .auth-input:focus { border-color:#B8973A; }`}</style>
    </AuthShell>
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
function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="container-eledante py-16 md:py-24">
      <div className="max-w-md mx-auto bg-white border border-brand-border p-8 md:p-12">
        <p className="label text-center mb-3">Account</p>
        <h1 className="font-display text-display text-brand-ink text-center">{title}</h1>
        <p className="text-center text-brand-text-secondary mt-2 mb-8">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
