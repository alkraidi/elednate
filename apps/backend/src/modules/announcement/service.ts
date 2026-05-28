import { MedusaService } from '@medusajs/framework/utils';
import { Announcement } from './models';

class AnnouncementModuleService extends MedusaService({ Announcement }) {
  async getActive() {
    const [existing] = await this.listAnnouncements({}, { take: 1 });
    if (existing) return existing;
    return await this.createAnnouncements({
      enabled: true,
      text: 'Complimentary worldwide shipping on orders over $500 — ethically sourced sapphires & diamonds.',
      background_color: '#B8973A',
      text_color: '#FFFFFF',
    });
  }
  async updateActive(data: any) {
    const active = await this.getActive();
    return await this.updateAnnouncements([{ id: (active as any).id, ...data }]);
  }
}
export default AnnouncementModuleService;
