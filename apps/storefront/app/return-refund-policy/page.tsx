import { LegalPageShell } from '@/components/layout/legal-shell';

export default function ReturnPolicy() {
  return (
    <LegalPageShell eyebrow="Customer Care" title="Returns & Refunds" updated="January 2024">
      <h2>30-Day Returns</h2>
      <p>We accept returns within 30 days of delivery for a full refund, provided the piece is unworn and accompanied by its original packaging and gemological certificate.</p>
      <h2>How To Return</h2>
      <ol>
        <li>Email <a href="mailto:hello@eledante.com">hello@eledante.com</a> with your order number.</li>
        <li>We’ll issue a prepaid, insured return label.</li>
        <li>Drop the parcel at any DHL/UPS pickup point.</li>
      </ol>
      <h2>Refunds</h2>
      <p>Refunds are processed within 5 business days of receipt on the original payment method. Custom and personalised pieces are non-returnable.</p>
      <h2>Exchanges</h2>
      <p>Need a different size? We’ll exchange or resize any standard piece free of charge within 90 days of purchase.</p>
    </LegalPageShell>
  );
}
