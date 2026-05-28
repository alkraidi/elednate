import { model } from '@medusajs/framework/utils';

export const HeroConfig = model.define('hero_config', {
  id: model.id().primaryKey(),
  mode: model.enum(['slideshow', 'video']).default('slideshow'),
  slideshow_interval_seconds: model.number().default(6),
  video_url: model.text().nullable(),
  slides: model.json().default([]),
});
