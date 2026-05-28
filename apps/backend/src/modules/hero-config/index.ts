import { Module } from '@medusajs/framework/utils';
import HeroConfigModuleService from './service';

export const HERO_CONFIG_MODULE = 'hero_config';

export default Module(HERO_CONFIG_MODULE, { service: HeroConfigModuleService });
