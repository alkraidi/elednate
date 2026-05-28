import { LegalPageShell } from '@/components/layout/legal-shell';

export default function SupplyChainEthics() {
  return (
    <LegalPageShell eyebrow="Trust" title="Supply Chain Ethics" updated="January 2024">
      <h2>Our Promise</h2>
      <p>Every sapphire and diamond in an Eledante piece is traceable to a single mine or cutting house. We do not source from regions affected by armed conflict, forced labour, or environmental degradation.</p>
      <h2>Direct Sourcing</h2>
      <p>Our co-founders travel to Sri Lanka and Madagascar in person, multiple times a year, to inspect parcels at the source. This eliminates layers of intermediaries and lets us pay miners fair value.</p>
      <h2>Audits</h2>
      <p>We work exclusively with suppliers who provide:</p>
      <ul>
        <li>Kimberley Process certification for all diamonds</li>
        <li>Documented chain of custody for all sapphires</li>
        <li>Proof of safe, paid working conditions</li>
      </ul>
      <h2>Recycled Metals</h2>
      <p>100% of the gold and platinum used in our settings is recycled, certified by SCS Global Services.</p>
      <h2>Carbon Neutrality</h2>
      <p>Every Eledante shipment is offset through certified reforestation projects in Tanzania and Indonesia.</p>
    </LegalPageShell>
  );
}
