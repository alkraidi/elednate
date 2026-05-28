import { MedusaService } from '@medusajs/framework/utils';
import { HomepageConfig } from './models';

class HomepageConfigModuleService extends MedusaService({ HomepageConfig }) {
  async getActive() {
    const [existing] = await this.listHomepageConfigs({}, { take: 1 });
    if (existing) return existing;
    return await this.createHomepageConfigs({
      show_new_arrivals: true,
      show_category_tiles: true,
      show_high_end_collection: true,
      show_services: true,
    });
  }
  async updateActive(data: any) {
    const active = await this.getActive();
    return await this.updateHomepageConfigs([{ id: (active as any).id, ...data }]);
  }
}
export default HomepageConfigModuleService;
