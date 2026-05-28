import type {
  MedusaProduct,
  MedusaCollection,
  MedusaVariant,
  HeroConfig,
  HomepageConfig,
  AnnouncementConfig,
} from './types';

// ---- Collections (8 per spec) ----
export const seedCollections: MedusaCollection[] = [
  { id: 'col_dating', handle: 'dating-rings', title: 'Dating Rings' },
  { id: 'col_everyday', handle: 'everyday-rings', title: 'Everyday Rings' },
  { id: 'col_wedding', handle: 'wedding-rings', title: 'Wedding Rings' },
  { id: 'col_engagement', handle: 'engagement-rings', title: 'Engagement Rings' },
  { id: 'col_anniversary', handle: 'anniversary', title: 'Anniversary' },
  { id: 'col_gifts', handle: 'gifts', title: 'Gifts' },
  { id: 'col_new', handle: 'new-arrivals', title: 'New Arrivals' },
  { id: 'col_highend', handle: 'high-end-collection', title: 'High End Collection' },
];

const RING_SIZES = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9'];

function buildVariants(productId: string, basePrice: number): MedusaVariant[] {
  return RING_SIZES.map((size, i) => ({
    id: `var_${productId}_${i}`,
    product_id: productId,
    title: `US ${size}`,
    sku: `${productId.toUpperCase()}-${size.replace('.', '_')}`,
    inventory_quantity: 5,
    manage_inventory: true,
    prices: [{ id: `pr_${productId}_${i}`, currency_code: 'usd', amount: basePrice }],
    calculated_price: {
      calculated_amount: basePrice,
      original_amount: basePrice,
      currency_code: 'usd',
    },
    options: [{ id: `optval_${productId}_${i}`, value: `US ${size}`, option_id: `opt_${productId}_size` }],
  }));
}

function buildOptions(productId: string) {
  return [
    {
      id: `opt_${productId}_size`,
      title: 'Ring Size',
      values: RING_SIZES.map((s, i) => ({ id: `optv_${productId}_${i}`, value: `US ${s}` })),
    },
  ];
}

type SeedDef = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  images: string[];
  basePriceCents: number;
  collection_id: string; // primary
  collection_ids: string[]; // M2M sim
  gemstone_type: string;
  gemstone_color: string;
  total_carat_weight: string;
  metal: string;
  origin: 'Sri Lanka' | 'Madagascar';
  is_new_arrival: boolean;
  certificate?: string;
  tags: string[];
};

const defs: SeedDef[] = [
  {
    id: 'prod_blue_pave_117',
    handle: 'blue-sapphire-diamond-pave-ring-117-tcw',
    title: 'Blue Sapphire and Diamond Pave Ring – 1.17 TCW',
    subtitle: 'Pavé Set Engagement Ring',
    description:
      'An exquisite oval blue sapphire centerpiece flanked by a delicate diamond pavé band, hand-set in 18K white gold. Ethically sourced from the highlands of Sri Lanka, every gemstone is faceted to maximise refraction and brilliance.',
    thumbnail: 'https://images.pexels.com/photos/9953656/pexels-photo-9953656.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
    images: [
      'https://images.pexels.com/photos/9953656/pexels-photo-9953656.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200',
      'https://images.unsplash.com/photo-1543295204-2ae345412549?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591210244853-ea68b6126edf?auto=format&fit=crop&w=1200&q=80',
    ],
    basePriceCents: 245000,
    collection_id: 'col_engagement',
    collection_ids: ['col_engagement', 'col_new', 'col_dating'],
    gemstone_type: 'Blue Sapphire',
    gemstone_color: 'Blue',
    total_carat_weight: '1.17',
    metal: '18K White Gold',
    origin: 'Sri Lanka',
    is_new_arrival: true,
    certificate: 'GIA Certified',
    tags: ['sapphire', 'diamond', 'pave', 'engagement'],
  },
  {
    id: 'prod_teal_halo_117',
    handle: 'teal-sapphire-diamond-halo-ring-117-tcw',
    title: 'Teal Sapphire and Diamond Halo Ring – 1.17 TCW',
    subtitle: 'Halo Set Engagement Ring',
    description:
      'A rare teal sapphire from Madagascar, encircled by a brilliant diamond halo. The setting is finished in 18K white gold with a knife-edge band for a contemporary silhouette.',
    thumbnail: 'https://images.unsplash.com/photo-1591210244853-ea68b6126edf?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1591210244853-ea68b6126edf?auto=format&fit=crop&w=1200&q=80',
      'https://images.pexels.com/photos/9953656/pexels-photo-9953656.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200',
    ],
    basePriceCents: 265000,
    collection_id: 'col_engagement',
    collection_ids: ['col_engagement', 'col_new'],
    gemstone_type: 'Teal Sapphire',
    gemstone_color: 'Teal',
    total_carat_weight: '1.17',
    metal: '18K White Gold',
    origin: 'Madagascar',
    is_new_arrival: true,
    certificate: 'GIA Certified',
    tags: ['sapphire', 'diamond', 'halo', 'engagement', 'teal'],
  },
  {
    id: 'prod_royal_195',
    handle: 'royal-blue-sapphire-diamond-ring-195-tcw',
    title: 'Royal Blue Sapphire and Diamond Ring – 1.95 TCW',
    subtitle: 'Statement Heritage Ring',
    description:
      'A deep royal blue cushion-cut sapphire from Ceylon, set in a tapered diamond shoulder mount. A heritage statement piece destined to be passed down through generations.',
    thumbnail: 'https://images.unsplash.com/photo-1543295204-2ae345412549?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1543295204-2ae345412549?auto=format&fit=crop&w=1200&q=80',
      'https://images.pexels.com/photos/14058109/pexels-photo-14058109.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200',
    ],
    basePriceCents: 489000,
    collection_id: 'col_highend',
    collection_ids: ['col_highend', 'col_engagement', 'col_anniversary'],
    gemstone_type: 'Royal Blue Sapphire',
    gemstone_color: 'Royal Blue',
    total_carat_weight: '1.95',
    metal: '18K White Gold',
    origin: 'Sri Lanka',
    is_new_arrival: true,
    certificate: 'GIA & GRS Certified',
    tags: ['sapphire', 'diamond', 'royal-blue', 'heritage', 'high-end'],
  },
  {
    id: 'prod_yellow_169',
    handle: 'yellow-sapphire-diamond-ring-169-tcw',
    title: 'Yellow Sapphire and Diamond Ring – 1.69 TCW',
    subtitle: 'Everyday Statement Ring',
    description:
      'A radiant yellow sapphire framed by twin diamond accents. A warm, sun-toned ring designed for everyday brilliance.',
    thumbnail: 'https://images.unsplash.com/photo-1602751584581-2e0372975b46?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1602751584581-2e0372975b46?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591210244853-ea68b6126edf?auto=format&fit=crop&w=1200&q=80',
    ],
    basePriceCents: 229000,
    collection_id: 'col_everyday',
    collection_ids: ['col_everyday', 'col_anniversary', 'col_new'],
    gemstone_type: 'Yellow Sapphire',
    gemstone_color: 'Yellow',
    total_carat_weight: '1.69',
    metal: '18K Yellow Gold',
    origin: 'Sri Lanka',
    is_new_arrival: true,
    certificate: 'GIA Certified',
    tags: ['sapphire', 'diamond', 'yellow', 'everyday'],
  },
  {
    id: 'prod_natural_halo_158',
    handle: 'natural-blue-sapphire-halo-ring-158-tcw',
    title: 'Natural Blue Sapphire Halo Ring – 1.58 TCW',
    subtitle: 'Classic Halo Engagement Ring',
    description:
      'A timeless round natural blue sapphire encircled by a halo of brilliant diamonds, set on a slender 18K white gold band.',
    thumbnail: 'https://images.pexels.com/photos/5370700/pexels-photo-5370700.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
    images: [
      'https://images.pexels.com/photos/5370700/pexels-photo-5370700.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200',
      'https://images.pexels.com/photos/9953656/pexels-photo-9953656.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200',
    ],
    basePriceCents: 315000,
    collection_id: 'col_engagement',
    collection_ids: ['col_engagement', 'col_wedding'],
    gemstone_type: 'Natural Blue Sapphire',
    gemstone_color: 'Blue',
    total_carat_weight: '1.58',
    metal: '18K White Gold',
    origin: 'Sri Lanka',
    is_new_arrival: false,
    certificate: 'GIA Certified',
    tags: ['sapphire', 'diamond', 'halo', 'engagement', 'wedding'],
  },
  {
    id: 'prod_peach_halo_208',
    handle: 'peach-sapphire-diamond-halo-ring-208-tcw',
    title: 'Peach Sapphire and Diamond Halo Ring – 2.08 TCW',
    subtitle: 'Romantic Halo Engagement Ring',
    description:
      'A warm peach Madagascan sapphire surrounded by a glowing diamond halo. A modern romantic piece with a soft, sunset palette.',
    thumbnail: 'https://images.pexels.com/photos/14058109/pexels-photo-14058109.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
    images: [
      'https://images.pexels.com/photos/14058109/pexels-photo-14058109.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200',
      'https://images.pexels.com/photos/11567607/pexels-photo-11567607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200',
    ],
    basePriceCents: 425000,
    collection_id: 'col_highend',
    collection_ids: ['col_highend', 'col_engagement', 'col_anniversary'],
    gemstone_type: 'Peach Sapphire',
    gemstone_color: 'Peach',
    total_carat_weight: '2.08',
    metal: '18K Rose Gold',
    origin: 'Madagascar',
    is_new_arrival: true,
    certificate: 'GIA Certified',
    tags: ['sapphire', 'diamond', 'halo', 'peach', 'high-end'],
  },
  {
    id: 'prod_cornflower_pave_153',
    handle: 'cornflower-blue-sapphire-diamond-pave-ring-153-tcw',
    title: 'Cornflower Blue Sapphire and Diamond Pave Ring – 1.53 TCW',
    subtitle: 'Pavé Cornflower Ring',
    description:
      'A serene cornflower blue Ceylon sapphire set above a diamond pavé band. The hue is the most coveted in the world of sapphires — the colour of an early morning sky.',
    thumbnail: 'https://images.unsplash.com/photo-1602751584547-5fb8e6c21740?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1602751584547-5fb8e6c21740?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591210244853-ea68b6126edf?auto=format&fit=crop&w=1200&q=80',
    ],
    basePriceCents: 289000,
    collection_id: 'col_dating',
    collection_ids: ['col_dating', 'col_anniversary', 'col_new'],
    gemstone_type: 'Cornflower Blue Sapphire',
    gemstone_color: 'Cornflower Blue',
    total_carat_weight: '1.53',
    metal: '18K White Gold',
    origin: 'Sri Lanka',
    is_new_arrival: true,
    certificate: 'GIA Certified',
    tags: ['sapphire', 'diamond', 'pave', 'cornflower'],
  },
  {
    id: 'prod_pink_petite_046',
    handle: 'pink-sapphire-diamond-petite-ring-046-tcw',
    title: 'Pink Sapphire and Diamond Petite Ring – 0.46 TCW',
    subtitle: 'Petite Stacking Ring',
    description:
      'A delicate pink Madagascan sapphire with diamond accents on a refined 18K rose gold band. Perfect as a gift, a promise ring, or a stacking piece.',
    thumbnail: 'https://images.pexels.com/photos/11567607/pexels-photo-11567607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
    images: [
      'https://images.pexels.com/photos/11567607/pexels-photo-11567607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200',
      'https://images.pexels.com/photos/14058109/pexels-photo-14058109.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200',
    ],
    basePriceCents: 115000,
    collection_id: 'col_gifts',
    collection_ids: ['col_gifts', 'col_everyday', 'col_new'],
    gemstone_type: 'Pink Sapphire',
    gemstone_color: 'Pink',
    total_carat_weight: '0.46',
    metal: '18K Rose Gold',
    origin: 'Madagascar',
    is_new_arrival: true,
    certificate: 'GIA Certified',
    tags: ['sapphire', 'diamond', 'petite', 'pink', 'gift'],
  },
];

export const seedProducts: MedusaProduct[] = defs.map((d) => ({
  id: d.id,
  handle: d.handle,
  title: d.title,
  subtitle: d.subtitle,
  description: d.description,
  thumbnail: d.thumbnail,
  images: d.images.map((url, i) => ({ id: `img_${d.id}_${i}`, url })),
  status: 'published' as const,
  collection_id: d.collection_id,
  collection: seedCollections.find((c) => c.id === d.collection_id),
  tags: d.tags.map((t, i) => ({ id: `tag_${d.id}_${i}`, value: t })),
  options: buildOptions(d.id),
  variants: buildVariants(d.id, d.basePriceCents),
  metadata: {
    gemstone_type: d.gemstone_type,
    gemstone_color: d.gemstone_color,
    total_carat_weight: d.total_carat_weight,
    metal: d.metal,
    origin: d.origin,
    is_new_arrival: d.is_new_arrival,
    certificate: d.certificate,
    collection_ids: d.collection_ids,
  },
  created_at: new Date(2024, 9, 1 + defs.indexOf(d)).toISOString(),
}));

// Attach product_count to collections
seedCollections.forEach((c) => {
  c.product_count = seedProducts.filter((p) => p.metadata.collection_ids?.includes(c.id)).length;
});

// ---- Site config defaults (mirrors Medusa custom modules) ----
export const defaultHeroConfig: HeroConfig = {
  mode: 'slideshow',
  slideshow_interval_seconds: 6,
  slides: [
    {
      id: 'slide_1',
      image_url: 'https://images.unsplash.com/photo-1543295204-2ae345412549?auto=format&fit=crop&w=2400&q=85',
      title: 'Discover the Essence of Timeless Beauty',
      subtitle: "Our gems don't just shine.",
      cta_text: 'Shop Now',
      cta_link: '/shop',
    },
    {
      id: 'slide_2',
      image_url: 'https://images.pexels.com/photos/9953656/pexels-photo-9953656.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=2400',
      title: 'Ethically Sourced. Masterfully Crafted.',
      subtitle: 'From Sri Lanka and Madagascar to Istanbul.',
      cta_text: 'Explore Collections',
      cta_link: '/shop',
    },
  ],
  video_url: null,
};

export const defaultHomepageConfig: HomepageConfig = {
  show_new_arrivals: true,
  show_category_tiles: true,
  show_high_end_collection: true,
  show_services: true,
};

export const defaultAnnouncement: AnnouncementConfig = {
  enabled: true,
  text: 'Complimentary worldwide shipping on orders over $500 — ethically sourced sapphires & diamonds.',
  background_color: '#B8973A',
  text_color: '#FFFFFF',
};
