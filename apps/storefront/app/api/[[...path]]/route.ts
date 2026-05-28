import { NextRequest, NextResponse } from 'next/server';
import {
  listProducts,
  getProductByHandle,
  listCollections,
  getCollectionByHandle,
  createCart,
  getCart,
  addLineItem,
  updateLineItem,
  removeLineItem,
  setCartEmail,
  registerCustomer,
  loginCustomer,
  getHeroConfig,
  setHeroConfig,
  getHomepageConfig,
  setHomepageConfig,
  getAnnouncement,
  setAnnouncement,
} from '@/lib/medusa/store';
import { seedProducts } from '@/lib/medusa/seed';

function cors(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}
function ok(data: any, status = 200) { return cors(NextResponse.json(data, { status })); }
function notFound(msg = 'Not found') { return cors(NextResponse.json({ type: 'not_found', message: msg }, { status: 404 })); }
function badRequest(msg: string) { return cors(NextResponse.json({ type: 'invalid_data', message: msg }, { status: 400 })); }

export async function OPTIONS() { return cors(new NextResponse(null, { status: 200 })); }

async function handler(request: NextRequest, ctx: { params: { path?: string[] } }) {
  const path = ctx.params.path ?? [];
  const route = `/${path.join('/')}`;
  const method = request.method;
  const url = new URL(request.url);
  const q = url.searchParams;

  try {
    // ---------- HEALTH ----------
    if ((route === '/' || route === '/root') && method === 'GET') {
      return ok({ message: 'Eledante Mock Medusa Store API', version: 'mock-v2', endpoints: ['/store/products', '/store/collections', '/store/carts'] });
    }

    // ---------- STORE: PRODUCTS ----------
    if (route === '/store/products' && method === 'GET') {
      const result = listProducts({
        limit: q.get('limit') ? Number(q.get('limit')) : undefined,
        offset: q.get('offset') ? Number(q.get('offset')) : undefined,
        collection_id: q.get('collection_id') || undefined,
        collection_handle: q.get('collection_handle') || undefined,
        q: q.get('q') || undefined,
        is_new_arrival: q.get('is_new_arrival') ? q.get('is_new_arrival') === 'true' : undefined,
        gemstone_color: q.get('gemstone_color') || undefined,
        metal: q.get('metal') || undefined,
        min_price: q.get('min_price') ? Number(q.get('min_price')) : undefined,
        max_price: q.get('max_price') ? Number(q.get('max_price')) : undefined,
      });
      return ok(result);
    }

    if (route.startsWith('/store/products/') && method === 'GET') {
      const handle = path[2];
      const product = getProductByHandle(handle) || seedProducts.find((p) => p.id === handle);
      if (!product) return notFound('Product not found');
      return ok({ product });
    }

    // ---------- STORE: COLLECTIONS ----------
    if (route === '/store/collections' && method === 'GET') {
      return ok(listCollections());
    }
    if (route.startsWith('/store/collections/') && method === 'GET') {
      const handle = path[2];
      const collection = getCollectionByHandle(handle);
      if (!collection) return notFound('Collection not found');
      const products = listProducts({ collection_handle: handle }).products;
      return ok({ collection, products });
    }

    // ---------- STORE: CARTS ----------
    if (route === '/store/carts' && method === 'POST') {
      const cart = createCart();
      return ok({ cart });
    }

    const cartMatch = route.match(/^\/store\/carts\/(cart_[^/]+)(\/.*)?$/);
    if (cartMatch) {
      const cartId = cartMatch[1];
      const sub = cartMatch[2] || '';

      if (!sub && method === 'GET') {
        const cart = getCart(cartId);
        if (!cart) return notFound('Cart not found');
        return ok({ cart });
      }
      if (!sub && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        if (body.email) {
          const cart = setCartEmail(cartId, body.email);
          if (!cart) return notFound('Cart not found');
          return ok({ cart });
        }
        return badRequest('No supported fields in cart update');
      }
      if (sub === '/line-items' && method === 'POST') {
        const body = await request.json();
        if (!body.variant_id) return badRequest('variant_id is required');
        const cart = addLineItem(cartId, body.variant_id, Math.max(1, Number(body.quantity || 1)));
        if (!cart) return notFound('Cart or variant not found');
        return ok({ cart });
      }
      const lineMatch = sub.match(/^\/line-items\/(li_[^/]+)$/);
      if (lineMatch) {
        const lineId = lineMatch[1];
        if (method === 'POST' || method === 'PATCH') {
          const body = await request.json();
          const cart = updateLineItem(cartId, lineId, Number(body.quantity ?? 1));
          if (!cart) return notFound('Cart or line item not found');
          return ok({ cart });
        }
        if (method === 'DELETE') {
          const cart = removeLineItem(cartId, lineId);
          if (!cart) return notFound('Cart or line item not found');
          return ok({ cart });
        }
      }
      if (sub === '/complete' && method === 'POST') {
        const cart = getCart(cartId);
        if (!cart) return notFound('Cart not found');
        const order = { id: `order_${cart.id.slice(5, 13)}`, display_id: Math.floor(10000 + Math.random() * 90000), email: cart.email || 'guest@eledante.com' };
        return ok({ type: 'order', order });
      }
    }

    // ---------- STORE: CUSTOMERS / AUTH ----------
    if (route === '/store/customers' && method === 'POST') {
      const body = await request.json();
      const res = registerCustomer(body.email, body.password, body.first_name || '', body.last_name || '');
      if ('error' in res) return badRequest(res.error);
      return ok(res);
    }
    if (route === '/store/auth/login' && method === 'POST') {
      const body = await request.json();
      const res = loginCustomer(body.email, body.password);
      if ('error' in res) return badRequest(res.error);
      return ok(res);
    }

    // ---------- STORE: CONFIG (Hero / Homepage / Announcement) ----------
    if (route === '/store/config/hero' && method === 'GET') return ok({ config: getHeroConfig() });
    if (route === '/store/config/hero' && method === 'POST') {
      const body = await request.json();
      return ok({ config: setHeroConfig(body) });
    }
    if (route === '/store/config/homepage' && method === 'GET') return ok({ config: getHomepageConfig() });
    if (route === '/store/config/homepage' && method === 'POST') {
      const body = await request.json();
      return ok({ config: setHomepageConfig(body) });
    }
    if (route === '/store/config/announcement' && method === 'GET') return ok({ config: getAnnouncement() });
    if (route === '/store/config/announcement' && method === 'POST') {
      const body = await request.json();
      return ok({ config: setAnnouncement(body) });
    }

    return notFound(`Route ${method} ${route} not found`);
  } catch (err: any) {
    console.error('API Error', err);
    return cors(NextResponse.json({ type: 'server_error', message: err?.message || 'Internal server error' }, { status: 500 }));
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
