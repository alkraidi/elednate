// Medusa v2 Store API–compatible types (subset). The mock backend in this preview
// returns these exact shapes so the storefront can be swapped to a real Medusa
// backend by changing MEDUSA_BACKEND_URL.

export type MedusaImage = { id: string; url: string };

export type MedusaPrice = {
  id: string;
  currency_code: string;
  amount: number; // minor units (cents)
};

export type MedusaCalculatedPrice = {
  calculated_amount: number;
  original_amount: number;
  currency_code: string;
};

export type MedusaOptionValue = { id: string; value: string; option_id: string };

export type MedusaVariant = {
  id: string;
  product_id: string;
  title: string;
  sku: string;
  inventory_quantity: number;
  manage_inventory: boolean;
  prices: MedusaPrice[];
  calculated_price: MedusaCalculatedPrice;
  options: MedusaOptionValue[];
};

export type MedusaProductOption = {
  id: string;
  title: string;
  values: { id: string; value: string }[];
};

export type MedusaTag = { id: string; value: string };

export type EledanteProductMetadata = {
  gemstone_type: string;
  gemstone_color: string;
  total_carat_weight: string; // e.g. "1.17"
  metal: string;
  origin: 'Sri Lanka' | 'Madagascar' | string;
  is_new_arrival: boolean;
  certificate?: string;
  collection_ids?: string[]; // many-to-many simulation
};

export type MedusaProduct = {
  id: string;
  handle: string;
  title: string;
  subtitle: string | null;
  description: string;
  thumbnail: string;
  images: MedusaImage[];
  status: 'published';
  collection_id: string;
  collection?: MedusaCollection;
  tags: MedusaTag[];
  options: MedusaProductOption[];
  variants: MedusaVariant[];
  metadata: EledanteProductMetadata;
  created_at: string;
};

export type MedusaCollection = {
  id: string;
  handle: string;
  title: string;
  metadata?: Record<string, unknown> | null;
  product_count?: number;
};

export type MedusaLineItem = {
  id: string;
  variant_id: string;
  product_id: string;
  product_title: string;
  product_handle: string;
  variant_title: string;
  thumbnail: string;
  quantity: number;
  unit_price: number;
  total: number;
  metadata?: Record<string, unknown>;
};

export type MedusaCart = {
  id: string;
  email: string | null;
  currency_code: string;
  region_id: string;
  items: MedusaLineItem[];
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  item_count: number;
  created_at: string;
  updated_at: string;
};

export type MedusaCustomer = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  has_account: boolean;
  created_at: string;
};

export type HeroConfig = {
  mode: 'slideshow' | 'video';
  slideshow_interval_seconds: number;
  slides: {
    id: string;
    image_url: string;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
  }[];
  video_url: string | null;
};

export type HomepageConfig = {
  show_new_arrivals: boolean;
  show_category_tiles: boolean;
  show_high_end_collection: boolean;
  show_services: boolean;
};

export type AnnouncementConfig = {
  enabled: boolean;
  text: string;
  background_color: string; // hex
  text_color: string;
};
