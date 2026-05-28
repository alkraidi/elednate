import { ExecArgs } from '@medusajs/framework/types';
import { ContainerRegistrationKeys, Modules, ProductStatus } from '@medusajs/framework/utils';
import {
  createProductsWorkflow,
  createCollectionsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from '@medusajs/medusa/core-flows';

/**
 * Seeds Eledante with:
 *  - 1 region (EU/USD default), 1 sales channel, 1 stock location
 *  - 8 collections (matching the spec)
 *  - 8 real Eledante products with full metadata + ring-size variants
 */
export default async function seedEledante({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // ---------- Region + Sales channel + Stock location ----------
  logger.info('Creating default region…');
  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [{ name: 'Global', currency_code: 'usd', countries: ['us', 'gb', 'de', 'fr', 'tr', 'ae'], payment_providers: ['pp_stripe_stripe'] }],
    },
  });
  const region = regions[0];

  logger.info('Creating sales channel…');
  const { result: channels } = await createSalesChannelsWorkflow(container).run({
    input: { salesChannelsData: [{ name: 'Eledante Storefront' }] },
  });
  const channel = channels[0];

  logger.info('Creating stock location…');
  const { result: locations } = await createStockLocationsWorkflow(container).run({
    input: { locations: [{ name: 'Istanbul Atelier', address: { city: 'Istanbul', country_code: 'tr', address_1: 'Kireçburnu Mah. Goncalar Sk. No: 7' } }] },
  });
  const location = locations[0];

  await linkSalesChannelsToStockLocationWorkflow(container).run({ input: { id: location.id, add: [channel.id] } });

  logger.info('Creating shipping profile…');
  await createShippingProfilesWorkflow(container).run({ input: { data: [{ name: 'Default', type: 'default' }] } });

  // ---------- Collections ----------
  logger.info('Creating collections…');
  const { result: collections } = await createCollectionsWorkflow(container).run({
    input: {
      collections: [
        { handle: 'dating-rings', title: 'Dating Rings' },
        { handle: 'everyday-rings', title: 'Everyday Rings' },
        { handle: 'wedding-rings', title: 'Wedding Rings' },
        { handle: 'engagement-rings', title: 'Engagement Rings' },
        { handle: 'anniversary', title: 'Anniversary' },
        { handle: 'gifts', title: 'Gifts' },
        { handle: 'new-arrivals', title: 'New Arrivals' },
        { handle: 'high-end-collection', title: 'High End Collection' },
      ],
    },
  });
  const byHandle = (h: string) => collections.find((c: any) => c.handle === h)!.id;

  // ---------- Products ----------
  const RING_SIZES = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9'];
  const variant = (size: string, price: number) => ({
    title: `US ${size}`,
    sku: `RING-${size.replace('.', '_')}`,
    manage_inventory: true,
    prices: [{ amount: price, currency_code: 'usd' }],
    options: { 'Ring Size': `US ${size}` },
  });
  const productOptions = [{ title: 'Ring Size', values: RING_SIZES.map((s) => `US ${s}`) }];

  const PRODUCTS = [
    {
      title: 'Blue Sapphire and Diamond Pave Ring – 1.17 TCW', handle: 'blue-sapphire-diamond-pave-ring-117-tcw',
      subtitle: 'Pavé Set Engagement Ring',
      description: 'An exquisite oval blue sapphire centerpiece flanked by a delicate diamond pavé band, hand-set in 18K white gold. Ethically sourced from the highlands of Sri Lanka.',
      thumbnail: 'https://images.pexels.com/photos/9953656/pexels-photo-9953656.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
      collection_id: byHandle('engagement-rings'),
      base_price: 245000,
      metadata: { gemstone_type: 'Blue Sapphire', gemstone_color: 'Blue', total_carat_weight: '1.17', metal: '18K White Gold', origin: 'Sri Lanka', is_new_arrival: true, certificate: 'GIA Certified', collection_handles: ['engagement-rings', 'new-arrivals', 'dating-rings'] },
    },
    {
      title: 'Teal Sapphire and Diamond Halo Ring – 1.17 TCW', handle: 'teal-sapphire-diamond-halo-ring-117-tcw',
      subtitle: 'Halo Set Engagement Ring',
      description: 'A rare teal sapphire from Madagascar, encircled by a brilliant diamond halo, finished in 18K white gold.',
      thumbnail: 'https://images.unsplash.com/photo-1591210244853-ea68b6126edf?auto=format&fit=crop&w=900&q=80',
      collection_id: byHandle('engagement-rings'),
      base_price: 265000,
      metadata: { gemstone_type: 'Teal Sapphire', gemstone_color: 'Teal', total_carat_weight: '1.17', metal: '18K White Gold', origin: 'Madagascar', is_new_arrival: true, certificate: 'GIA Certified', collection_handles: ['engagement-rings', 'new-arrivals'] },
    },
    {
      title: 'Royal Blue Sapphire and Diamond Ring – 1.95 TCW', handle: 'royal-blue-sapphire-diamond-ring-195-tcw',
      subtitle: 'Statement Heritage Ring',
      description: 'A deep royal blue cushion-cut sapphire from Ceylon, set in a tapered diamond shoulder mount.',
      thumbnail: 'https://images.unsplash.com/photo-1543295204-2ae345412549?auto=format&fit=crop&w=900&q=80',
      collection_id: byHandle('high-end-collection'),
      base_price: 489000,
      metadata: { gemstone_type: 'Royal Blue Sapphire', gemstone_color: 'Royal Blue', total_carat_weight: '1.95', metal: '18K White Gold', origin: 'Sri Lanka', is_new_arrival: true, certificate: 'GIA & GRS Certified', collection_handles: ['high-end-collection', 'engagement-rings', 'anniversary'] },
    },
    {
      title: 'Yellow Sapphire and Diamond Ring – 1.69 TCW', handle: 'yellow-sapphire-diamond-ring-169-tcw',
      subtitle: 'Everyday Statement Ring',
      description: 'A radiant yellow sapphire framed by twin diamond accents. Designed for everyday brilliance.',
      thumbnail: 'https://images.unsplash.com/photo-1602751584581-2e0372975b46?auto=format&fit=crop&w=900&q=80',
      collection_id: byHandle('everyday-rings'),
      base_price: 229000,
      metadata: { gemstone_type: 'Yellow Sapphire', gemstone_color: 'Yellow', total_carat_weight: '1.69', metal: '18K Yellow Gold', origin: 'Sri Lanka', is_new_arrival: true, certificate: 'GIA Certified', collection_handles: ['everyday-rings', 'anniversary', 'new-arrivals'] },
    },
    {
      title: 'Natural Blue Sapphire Halo Ring – 1.58 TCW', handle: 'natural-blue-sapphire-halo-ring-158-tcw',
      subtitle: 'Classic Halo Engagement Ring',
      description: 'A timeless round natural blue sapphire encircled by a halo of brilliant diamonds, set on a slender 18K white gold band.',
      thumbnail: 'https://images.pexels.com/photos/5370700/pexels-photo-5370700.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
      collection_id: byHandle('engagement-rings'),
      base_price: 315000,
      metadata: { gemstone_type: 'Natural Blue Sapphire', gemstone_color: 'Blue', total_carat_weight: '1.58', metal: '18K White Gold', origin: 'Sri Lanka', is_new_arrival: false, certificate: 'GIA Certified', collection_handles: ['engagement-rings', 'wedding-rings'] },
    },
    {
      title: 'Peach Sapphire and Diamond Halo Ring – 2.08 TCW', handle: 'peach-sapphire-diamond-halo-ring-208-tcw',
      subtitle: 'Romantic Halo Engagement Ring',
      description: 'A warm peach Madagascan sapphire surrounded by a glowing diamond halo. A modern romantic piece.',
      thumbnail: 'https://images.pexels.com/photos/14058109/pexels-photo-14058109.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
      collection_id: byHandle('high-end-collection'),
      base_price: 425000,
      metadata: { gemstone_type: 'Peach Sapphire', gemstone_color: 'Peach', total_carat_weight: '2.08', metal: '18K Rose Gold', origin: 'Madagascar', is_new_arrival: true, certificate: 'GIA Certified', collection_handles: ['high-end-collection', 'engagement-rings', 'anniversary'] },
    },
    {
      title: 'Cornflower Blue Sapphire and Diamond Pave Ring – 1.53 TCW', handle: 'cornflower-blue-sapphire-diamond-pave-ring-153-tcw',
      subtitle: 'Pavé Cornflower Ring',
      description: 'A serene cornflower blue Ceylon sapphire set above a diamond pavé band.',
      thumbnail: 'https://images.unsplash.com/photo-1602751584547-5fb8e6c21740?auto=format&fit=crop&w=900&q=80',
      collection_id: byHandle('dating-rings'),
      base_price: 289000,
      metadata: { gemstone_type: 'Cornflower Blue Sapphire', gemstone_color: 'Cornflower Blue', total_carat_weight: '1.53', metal: '18K White Gold', origin: 'Sri Lanka', is_new_arrival: true, certificate: 'GIA Certified', collection_handles: ['dating-rings', 'anniversary', 'new-arrivals'] },
    },
    {
      title: 'Pink Sapphire and Diamond Petite Ring – 0.46 TCW', handle: 'pink-sapphire-diamond-petite-ring-046-tcw',
      subtitle: 'Petite Stacking Ring',
      description: 'A delicate pink Madagascan sapphire with diamond accents on a refined 18K rose gold band.',
      thumbnail: 'https://images.pexels.com/photos/11567607/pexels-photo-11567607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
      collection_id: byHandle('gifts'),
      base_price: 115000,
      metadata: { gemstone_type: 'Pink Sapphire', gemstone_color: 'Pink', total_carat_weight: '0.46', metal: '18K Rose Gold', origin: 'Madagascar', is_new_arrival: true, certificate: 'GIA Certified', collection_handles: ['gifts', 'everyday-rings', 'new-arrivals'] },
    },
  ];

  logger.info(`Creating ${PRODUCTS.length} products…`);
  await createProductsWorkflow(container).run({
    input: {
      products: PRODUCTS.map((p) => ({
        title: p.title,
        handle: p.handle,
        subtitle: p.subtitle,
        description: p.description,
        thumbnail: p.thumbnail,
        images: [{ url: p.thumbnail }],
        status: ProductStatus.PUBLISHED,
        collection_id: p.collection_id,
        options: productOptions,
        variants: RING_SIZES.map((s) => variant(s, p.base_price)),
        sales_channels: [{ id: channel.id }],
        metadata: p.metadata,
      })) as any,
    },
  });

  // Assign products to additional collections via metadata.collection_handles
  // (Medusa v2 products belong to a single collection by default; the storefront
  //  reads metadata.collection_handles for the many-to-many simulation.)

  logger.info('Seed complete — 8 collections, 8 products, default region.');
}
