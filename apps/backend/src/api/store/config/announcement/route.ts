import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { ANNOUNCEMENT_MODULE } from '../../../../modules/announcement';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve(ANNOUNCEMENT_MODULE) as any;
  res.json({ config: await service.getActive() });
}
