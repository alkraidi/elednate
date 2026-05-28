import { model } from '@medusajs/framework/utils';

export const HomepageConfig = model.define('homepage_config', {
  id: model.id().primaryKey(),
  show_new_arrivals: model.boolean().default(true),
  show_category_tiles: model.boolean().default(true),
  show_high_end_collection: model.boolean().default(true),
  show_services: model.boolean().default(true),
});
