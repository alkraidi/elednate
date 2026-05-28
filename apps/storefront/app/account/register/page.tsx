'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { medusa } from '@/lib/medusa/client';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await medusa.customers.register(form);
      if (typeof window !== 'undefined') window.localStorage.setItem('eledante_token', r.token);
      toast.success('Account created.');
      router.push('/account');
    } catch (e: any) {
      toast.error('Registration failed', { description: e?.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-eledante py-16 md:py-24">
      <div className="max-w-md mx-auto bg-white border border-brand-border p-8 md:p-12">
        <p className="label text-center mb-3">Account</p>
        <h1 className="font-display text-display text-brand-ink text-center">Create Account</h1>
        <p className="text-center text-brand-text-secondary mt-2 mb-8">Begin your Eledante journey.</p>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name"><input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="auth-input" /></Field>
            <Field label="Last name"><input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="auth-input" /></Field>
          </div>
          <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="auth-input" /></Field>
          <Field label="Password"><input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="auth-input" /></Field>
          <button disabled={submitting} type="submit" className="btn-gold w-full">{submitting ? 'Creating…' : 'Create Account'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-brand-text-secondary">Already have an account? <Link href="/account/login" className="underline text-brand-ink">Sign in</Link></p>
        <style jsx global>{`.auth-input { display:block; width:100%; background:transparent; border:0; border-bottom:1px solid #C8BFB0; padding:10px 0; font-size:14px; color:#1A1714; outline:none; } .auth-input:focus { border-color:#B8973A; }`}</style>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block font-label text-[9px] text-brand-text-muted mb-1">{label}</span>{children}</label>;
}
