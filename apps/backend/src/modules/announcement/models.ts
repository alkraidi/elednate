import { model } from '@medusajs/framework/utils';

export const Announcement = model.define('announcement', {
  id: model.id().primaryKey(),
  enabled: model.boolean().default(true),
  text: model.text().default('Complimentary worldwide shipping on orders over $500'),
  background_color: model.text().default('#B8973A'),
  text_color: model.text().default('#FFFFFF'),
});
