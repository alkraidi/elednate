// In-memory mock store. Persists for the lifetime of the Node process.
// In production this would be replaced by the real Medusa backend.

import { randomUUID } from 'crypto';
import {
  seedProducts,
  seedCollections,
  defaultHeroConfig,
  defaultHomepageConfig,
  defaultAnnouncement,
} from './seed';
import type {
  MedusaCart,
  MedusaCustomer,
  MedusaLineItem,
  HeroConfig,
  HomepageConfig,
  AnnouncementConfig,
} from './types';

// Singleton across hot reloads using globalThis (Next.js dev hot-reloads modules)
declare global {
  // eslint-disable-next-line no-var
  var __ELEDANTE_STORE__:
    | {
        carts: Map<string, MedusaCart>;
        customers: Map<string, MedusaCustomer>;
        passwords: Map<string, string>;
        sessions: Map<string, string>; // token -> customer_id
        hero: HeroConfig;
        homepage: HomepageConfig;
        announcement: AnnouncementConfig;
      }
    | undefined;
}

function store() {
  if (!globalThis.__ELEDANTE_STORE__) {
    globalThis.__ELEDANTE_STORE__ = {
      carts: new Map(),
      customers: new Map(),
      passwords: new Map(),
      sessions: new Map(),
      hero: defaultHeroConfig,
      homepage: defaultHomepageConfig,
      announcement: defaultAnnouncement,
    };
    // ----- Seed demo customer (preview only) -----
    const demo: MedusaCustomer = {
      id: 'cus_demo_eledante',
      email: 'demo@eledante.com',
      first_name: 'Demo',
      last_name: 'Shopper',
      has_account: true,
      created_at: new Date('2024-01-01').toISOString(),
    };
    globalThis.__ELEDANTE_STORE__.customers.set(demo.id, demo);
    globalThis.__ELEDANTE_STORE__.passwords.set(demo.email, 'demo123');
  }
  return globalThis.__ELEDANTE_STORE__!;
}

// ---- Products ----
export function listProducts(opts: {
  limit?: number;
  offset?: number;
  collection_id?: string;
  collection_handle?: string;
  q?: string;
  is_new_arrival?: boolean;
  gemstone_color?: string;
  metal?: string;
  min_price?: number;
  max_price?: number;
} = {}) {
  let products = seedProducts.slice();

  if (opts.collection_handle) {
    const col = seedCollections.find((c) => c.handle === opts.collection_handle);
    if (col) products = products.filter((p) => p.metadata.collection_ids?.includes(col.id));
    else products = [];
  }
  if (opts.collection_id) {
    products = products.filter((p) => p.metadata.collection_ids?.includes(opts.collection_id!));
  }
  if (opts.is_new_arrival !== undefined) {
    products = products.filter((p) => p.metadata.is_new_arrival === opts.is_new_arrival);
  }
  if (opts.q) {
    const q = opts.q.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.metadata.gemstone_color.toLowerCase().includes(q) ||
        p.metadata.gemstone_type.toLowerCase().includes(q)
    );
  }
  if (opts.gemstone_color) {
    products = products.filter(
      (p) => p.metadata.gemstone_color.toLowerCase() === opts.gemstone_color!.toLowerCase()
    );
  }
  if (opts.metal) {
    products = products.filter((p) => p.metadata.metal.toLowerCase().includes(opts.metal!.toLowerCase()));
  }
  if (opts.min_price !== undefined) {
    products = products.filter((p) => p.variants[0].calculated_price.calculated_amount >= opts.min_price!);
  }
  if (opts.max_price !== undefined) {
    products = products.filter((p) => p.variants[0].calculated_price.calculated_amount <= opts.max_price!);
  }

  const count = products.length;
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;
  return { products: products.slice(offset, offset + limit), count, limit, offset };
}

export function getProductByHandle(handle: string) {
  return seedProducts.find((p) => p.handle === handle);
}
export function getProductById(id: string) {
  return seedProducts.find((p) => p.id === id);
}
export function getVariantById(id: string) {
  for (const p of seedProducts) {
    const v = p.variants.find((v) => v.id === id);
    if (v) return { variant: v, product: p };
  }
  return null;
}

// ---- Collections ----
export function listCollections() {
  return { collections: seedCollections, count: seedCollections.length };
}
export function getCollectionByHandle(handle: string) {
  return seedCollections.find((c) => c.handle === handle) ?? null;
}

// ---- Carts ----
function recomputeCart(cart: MedusaCart) {
  cart.subtotal = cart.items.reduce((s, i) => s + i.total, 0);
  cart.shipping_total = 0;
  cart.tax_total = 0;
  cart.total = cart.subtotal + cart.shipping_total + cart.tax_total;
  cart.item_count = cart.items.reduce((s, i) => s + i.quantity, 0);
  cart.updated_at = new Date().toISOString();
}

export function createCart(): MedusaCart {
  const cart: MedusaCart = {
    id: `cart_${randomUUID()}`,
    email: null,
    currency_code: 'usd',
    region_id: 'reg_default',
    items: [],
    subtotal: 0,
    shipping_total: 0,
    tax_total: 0,
    total: 0,
    item_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  store().carts.set(cart.id, cart);
  return cart;
}

export function getCart(id: string): MedusaCart | null {
  return store().carts.get(id) ?? null;
}

export function addLineItem(cartId: string, variantId: string, quantity: number) {
  const cart = getCart(cartId);
  if (!cart) return null;
  const found = getVariantById(variantId);
  if (!found) return null;
  const { variant, product } = found;
  const existing = cart.items.find((it) => it.variant_id === variantId);
  if (existing) {
    existing.quantity += quantity;
    existing.total = existing.unit_price * existing.quantity;
  } else {
    const item: MedusaLineItem = {
      id: `li_${randomUUID()}`,
      variant_id: variant.id,
      product_id: product.id,
      product_title: product.title,
      product_handle: product.handle,
      variant_title: variant.title,
      thumbnail: product.thumbnail,
      quantity,
      unit_price: variant.calculated_price.calculated_amount,
      total: variant.calculated_price.calculated_amount * quantity,
      metadata: { gemstone_color: product.metadata.gemstone_color, tcw: product.metadata.total_carat_weight },
    };
    cart.items.push(item);
  }
  recomputeCart(cart);
  return cart;
}

export function updateLineItem(cartId: string, lineId: string, quantity: number) {
  const cart = getCart(cartId);
  if (!cart) return null;
  const item = cart.items.find((it) => it.id === lineId);
  if (!item) return null;
  if (quantity <= 0) {
    cart.items = cart.items.filter((it) => it.id !== lineId);
  } else {
    item.quantity = quantity;
    item.total = item.unit_price * quantity;
  }
  recomputeCart(cart);
  return cart;
}

export function removeLineItem(cartId: string, lineId: string) {
  const cart = getCart(cartId);
  if (!cart) return null;
  cart.items = cart.items.filter((it) => it.id !== lineId);
  recomputeCart(cart);
  return cart;
}

export function setCartEmail(cartId: string, email: string) {
  const cart = getCart(cartId);
  if (!cart) return null;
  cart.email = email;
  recomputeCart(cart);
  return cart;
}

// ---- Customers / Auth (mock; always succeeds) ----
export function registerCustomer(email: string, password: string, first_name: string, last_name: string) {
  const existing = Array.from(store().customers.values()).find((c) => c.email === email);
  if (existing) return { error: 'A customer with that email already exists' as const };
  const customer: MedusaCustomer = {
    id: `cus_${randomUUID()}`,
    email,
    first_name,
    last_name,
    has_account: true,
    created_at: new Date().toISOString(),
  };
  store().customers.set(customer.id, customer);
  store().passwords.set(email, password);
  const token = randomUUID();
  store().sessions.set(token, customer.id);
  return { customer, token };
}

export function loginCustomer(email: string, password: string) {
  const existing = Array.from(store().customers.values()).find((c) => c.email === email);
  const stored = store().passwords.get(email);
  if (!existing || stored !== password) return { error: 'Invalid credentials' as const };
  const token = randomUUID();
  store().sessions.set(token, existing.id);
  return { customer: existing, token };
}

export function getCustomerByToken(token?: string | null) {
  if (!token) return null;
  const id = store().sessions.get(token);
  if (!id) return null;
  return store().customers.get(id) ?? null;
}

// ---- Site config (Hero / Homepage / Announcement) ----
export function getHeroConfig() { return store().hero; }
export function setHeroConfig(cfg: HeroConfig) { store().hero = cfg; return store().hero; }
export function getHomepageConfig() { return store().homepage; }
export function setHomepageConfig(cfg: HomepageConfig) { store().homepage = cfg; return store().homepage; }
export function getAnnouncement() { return store().announcement; }
export function setAnnouncement(cfg: AnnouncementConfig) { store().announcement = cfg; return store().announcement; }
