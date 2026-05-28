import { defineRouteConfig } from '@medusajs/admin-sdk';
import { Container, Heading, Text } from '@medusajs/ui';
import { Adjustments } from '@medusajs/icons';
import HeroManagerWidget from '../../widgets/hero-manager';
import HomepageSectionsWidget from '../../widgets/homepage-sections';
import AnnouncementBarWidget from '../../widgets/announcement-bar';

const SiteConfigPage = () => {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div>
        <Heading level="h1">Site Configuration</Heading>
        <Text className="text-ui-fg-subtle">Manage everything that lives outside of products — hero, homepage sections, and the announcement bar.</Text>
      </div>
      <AnnouncementBarWidget />
      <HeroManagerWidget />
      <HomepageSectionsWidget />
    </div>
  );
};

export const config = defineRouteConfig({
  label: 'Site Config',
  icon: Adjustments,
});

export default SiteConfigPage;
