import { LegalPageShell } from '@/components/layout/legal-shell';

export default function ShippingPolicy() {
  return (
    <LegalPageShell eyebrow="Customer Care" title="Shipping & Handling" updated="January 2024">
      <h2>Complimentary Worldwide Shipping</h2>
      <p>Every Eledante piece ships free worldwide via fully insured DHL Express, signature on delivery.</p>
      <h2>Processing Times</h2>
      <p>Ready-to-ship pieces are dispatched within 1–2 business days. Custom and made-to-order pieces require 2–4 weeks.</p>
      <h2>Delivery Estimates</h2>
      <ul>
        <li>Türkiye: 1–2 business days</li>
        <li>EU & UK: 3–5 business days</li>
        <li>North America: 4–6 business days</li>
        <li>Rest of world: 5–7 business days</li>
      </ul>
      <h2>Duties & Taxes</h2>
      <p>Import duties and taxes are calculated at checkout where possible. For destinations where they cannot be pre-collected, the buyer is responsible for any local charges.</p>
    </LegalPageShell>
  );
}
