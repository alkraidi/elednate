import { LegalPageShell } from '@/components/layout/legal-shell';

export default function PrivacyPolicy() {
  return (
    <LegalPageShell eyebrow="Policies" title="Privacy Policy" updated="January 2024">
      <h2>What We Collect</h2>
      <p>We collect only what we need to fulfil your order and serve you well: your name, email, shipping address, phone number, and order history. Payment data is processed by Stripe and iyzico — we never store your card details.</p>
      <h2>How We Use It</h2>
      <ul>
        <li>To process and ship your order.</li>
        <li>To send order confirmations and shipping updates.</li>
        <li>With your explicit consent, to send occasional newsletters.</li>
      </ul>
      <h2>Your Rights</h2>
      <p>You may request a copy, correction, or deletion of your personal data at any time by emailing <a href="mailto:privacy@eledante.com">privacy@eledante.com</a>.</p>
      <h2>Cookies</h2>
      <p>We use only essential cookies for cart and session functionality. We do not run advertising trackers.</p>
    </LegalPageShell>
  );
}
