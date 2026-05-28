// Browser-side client for the (mock) Medusa Store API. Endpoints mirror the real
// Medusa v2 Store API so this layer can be pointed at a real Medusa backend
// later by swapping the base URL.

import type {
  MedusaCart,
  MedusaProduct,
  MedusaCollection,
  HeroConfig,
  HomepageConfig,
  AnnouncementConfig,
} from './types';

// In production point NEXT_PUBLIC_MEDUSA_BACKEND_URL at the real Medusa server
// (e.g. https://api.eledante.builtbymar.net) and set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY.
// When unset, the storefront falls back to the in-process /api/store mock for local dev.
const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const BASE = BACKEND ? `${BACKEND.replace(/\/$/, '')}/store` : '/api/store';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(init?.headers as any || {}) };
  if (PUBLISHABLE_KEY) headers['x-publishable-api-key'] = PUBLISHABLE_KEY;
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
    credentials: BACKEND ? 'include' : 'same-origin',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const medusa = {
  products: {
    list(params: Record<string, string | number | boolean | undefined> = {}) {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => v !== undefined && qs.append(k, String(v)));
      return fetchJSON<{ products: MedusaProduct[]; count: number; limit: number; offset: number }>(
        `/products${qs.toString() ? `?${qs}` : ''}`
      );
    },
    retrieve(handle: string) {
      return fetchJSON<{ product: MedusaProduct }>(`/products/${handle}`);
    },
  },
  collections: {
    list() {
      return fetchJSON<{ collections: MedusaCollection[]; count: number }>(`/collections`);
    },
    retrieve(handle: string) {
      return fetchJSON<{ collection: MedusaCollection; products: MedusaProduct[] }>(`/collections/${handle}`);
    },
  },
  carts: {
    create() {
      return fetchJSON<{ cart: MedusaCart }>(`/carts`, { method: 'POST', body: JSON.stringify({}) });
    },
    retrieve(id: string) {
      return fetchJSON<{ cart: MedusaCart }>(`/carts/${id}`);
    },
    addLineItem(id: string, variant_id: string, quantity: number) {
      return fetchJSON<{ cart: MedusaCart }>(`/carts/${id}/line-items`, {
        method: 'POST',
        body: JSON.stringify({ variant_id, quantity }),
      });
    },
    updateLineItem(id: string, lineId: string, quantity: number) {
      return fetchJSON<{ cart: MedusaCart }>(`/carts/${id}/line-items/${lineId}`, {
        method: 'POST',
        body: JSON.stringify({ quantity }),
      });
    },
    removeLineItem(id: string, lineId: string) {
      return fetchJSON<{ cart: MedusaCart }>(`/carts/${id}/line-items/${lineId}`, { method: 'DELETE' });
    },
    setEmail(id: string, email: string) {
      return fetchJSON<{ cart: MedusaCart }>(`/carts/${id}`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    complete(id: string) {
      return fetchJSON<{ type: 'order'; order: { id: string; display_id: number; email: string } }>(
        `/carts/${id}/complete`,
        { method: 'POST', body: JSON.stringify({}) }
      );
    },
  },
  customers: {
    register(input: { email: string; password: string; first_name: string; last_name: string }) {
      return fetchJSON<{ customer: { id: string; email: string }; token: string }>(`/customers`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },
    login(email: string, password: string) {
      return fetchJSON<{ customer: { id: string; email: string }; token: string }>(`/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
  },
  config: {
    hero() { return fetchJSON<{ config: HeroConfig }>(`/config/hero`); },
    homepage() { return fetchJSON<{ config: HomepageConfig }>(`/config/homepage`); },
    announcement() { return fetchJSON<{ config: AnnouncementConfig }>(`/config/announcement`); },
  },
};
