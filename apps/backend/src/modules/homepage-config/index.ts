import { Module } from '@medusajs/framework/utils';
import HomepageConfigModuleService from './service';

export const HOMEPAGE_CONFIG_MODULE = 'homepage_config';

export default Module(HOMEPAGE_CONFIG_MODULE, { service: HomepageConfigModuleService });
