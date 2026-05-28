import { LegalPageShell } from '@/components/layout/legal-shell';

export default function GemstoneCertificate() {
  return (
    <LegalPageShell eyebrow="Trust" title="Gemstone Certificate" updated="January 2024">
      <h2>Independent Certification</h2>
      <p>Every Eledante piece ships with an independent gemological certificate from a globally recognised laboratory — GIA, GRS, or AGL — verifying:</p>
      <ul>
        <li>Gemstone species and variety</li>
        <li>Origin (e.g. Sri Lanka, Madagascar)</li>
        <li>Colour grade</li>
        <li>Total carat weight</li>
        <li>Treatment disclosure</li>
      </ul>
      <h2>Re-certification</h2>
      <p>We offer complimentary re-certification of any Eledante piece for life. Reach out to <a href="mailto:hello@eledante.com">hello@eledante.com</a> to arrange.</p>
    </LegalPageShell>
  );
}
