import { MedusaService } from '@medusajs/framework/utils';
import { HeroConfig } from './models';

class HeroConfigModuleService extends MedusaService({ HeroConfig }) {
  async getActive() {
    const [existing] = await this.listHeroConfigs({}, { take: 1 });
    if (existing) return existing;
    return await this.createHeroConfigs({
      mode: 'slideshow',
      slideshow_interval_seconds: 6,
      video_url: null,
      slides: [
        {
          id: 'slide_1',
          image_url: 'https://images.unsplash.com/photo-1543295204-2ae345412549?auto=format&fit=crop&w=2400&q=85',
          title: 'Discover the Essence of Timeless Beauty',
          subtitle: "Our gems don't just shine.",
          cta_text: 'Shop Now',
          cta_link: '/shop',
        },
      ],
    });
  }
  async updateActive(data: any) {
    const active = await this.getActive();
    return await this.updateHeroConfigs([{ id: (active as any).id, ...data }]);
  }
}
export default HeroConfigModuleService;
