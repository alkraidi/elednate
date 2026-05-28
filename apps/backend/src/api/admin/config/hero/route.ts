import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { HERO_CONFIG_MODULE } from '../../../../modules/hero-config';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve(HERO_CONFIG_MODULE) as any;
  res.json({ config: await service.getActive() });
}
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve(HERO_CONFIG_MODULE) as any;
  const updated = await service.updateActive(req.body || {});
  res.json({ config: updated });
}
