# CLAUDE.md — Eledante Engineering Context

This file orients AI assistants (Claude, Cursor, etc.) and new contributors to the Eledante codebase.

## What This Is

**Eledante** is a premium fine-jewelry e-commerce site for a brand based in Istanbul, Türkiye. The brand sells sapphire and diamond rings ethically sourced from Sri Lanka and Madagascar. The founders are three scientists in geology, material science, and metallurgy.

This repo replaces the previous Wix site (eledante.com). The result deploys to a Hostinger VPS via CloudPanel + PM2.

## Architecture

Monorepo with Yarn workspaces.

```
eledante/
├── apps/
│   ├── storefront/        # Next.js 15 (App Router), TypeScript, Tailwind, shadcn/ui
│   └── backend/           # Medusa.js v2 + 3 custom modules + 3 admin widgets
├── ecosystem.config.js     # PM2 process manifest (both apps)
├── package.json            # Yarn workspaces root
└── README.md               # Deployment guide
```

### Storefront (`apps/storefront`)

- **Framework:** Next.js 15, App Router, **TypeScript only**.
- **Styling:** Tailwind CSS with brand tokens defined in `tailwind.config.js` (palette + typography). shadcn/ui primitives in `components/ui/`. Custom button classes (`btn-gold`, `btn-outline`) in `app/globals.css`.
- **Fonts:** Google Fonts via `next/font` — Cormorant Garamond (display), DM Sans (body), Montserrat (labels).
- **Data layer:** `lib/medusa/client.ts` is a fetch wrapper around the Medusa v2 Store API. It reads `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` at runtime.
- **Fallback mock:** When `NEXT_PUBLIC_MEDUSA_BACKEND_URL` is **unset**, the storefront talks to an in-process mock at `app/api/[[...path]]/route.ts` that mirrors Medusa's Store API shape. Useful for local dev without spinning up the backend.
- **Cart:** `lib/cart-context.tsx` — React context, persisted to `localStorage` (cart ID only).
- **Routes:**
  - `/` homepage (Hero, New Arrivals, Category Tiles, Shop By Category, Our Gemstones, High End, About strip, Services)
  - `/shop` filter-and-grid
  - `/collections/[handle]` (8 collections)
  - `/products/[handle]` PDP with gallery, size selector, accordion, related products
  - `/cart`, `/checkout` (multi-step: Address → Payment)
  - `/account` + `/account/login` + `/account/register` + `/account/forgot-password`
  - 9 static pages: `/about-us`, `/contact`, `/ask-gemologist`, `/return-refund-policy`, `/shipping-handling-policy`, `/privacy-policy`, `/gemstone-certificate`, `/distance-sales-agreement`, `/supply-chain-ethics`

### Backend (`apps/backend`)

- **Framework:** Medusa.js v2 (`@medusajs/medusa` ^2.4).
- **Database:** PostgreSQL (Neon free tier is fine). Connection via `DATABASE_URL`.
- **Payments:** Stripe in v1 (`@medusajs/medusa/payment-stripe`). iyzico in v2.
- **Custom modules** (each in `src/modules/`):
  - `hero-config` — single-row config for the storefront hero (slideshow vs. video, slides, interval, video URL).
  - `homepage-config` — booleans for show/hide of homepage sections.
  - `announcement` — announcement bar text, colors, enabled.
  Each module exposes `getActive()` and `updateActive()` and is consumed by both storefront (`/store/config/*` GET) and admin (`/admin/config/*` GET/POST) routes.
- **Admin extensions:**
  - `src/admin/widgets/hero-manager.tsx`, `homepage-sections.tsx`, `announcement-bar.tsx` — widgets shown on `order.list.before`.
  - `src/admin/routes/site-config/page.tsx` — dedicated sidebar page “Site Config” that hosts all three editors in one screen.
- **Seed:** `src/scripts/seed.ts` creates the default region, sales channel, stock location, 8 collections, and the 8 real Eledante products with full metadata (gemstone_type, gemstone_color, total_carat_weight, metal, origin, is_new_arrival, certificate, collection_handles).

## Brand Guidelines (read carefully before designing)

- **Mood:** Tiffany / Pandora editorial. Clean, white, airy. **Never** dark backgrounds, gradients, heavy shadows.
- **Palette:** Hardcoded in `apps/storefront/tailwind.config.js` under `theme.extend.colors.brand`. Gold `#B8973A` for primary CTAs; sapphire `#2C5F9E` for gemstone accents.
- **Typography:**
  - `font-display` (Cormorant Garamond) — all H1/H2/H3.
  - `font-sans` (DM Sans) — body, paragraphs, prices.
  - `font-label` (Montserrat, uppercase, `letter-spacing: 0.15em`) — tiny labels, badges, button text.
- **Border-radius:** Hardly any. Buttons are `rounded-btn` = `2px`. Cards are square or `rounded-md` at most.
- **Buttons:** Use `.btn-gold` (primary) and `.btn-outline` (secondary) from `globals.css`.

## 8 Real Eledante Products (in seed)

Do not invent product names. The catalog ships with these 8 products (and grows from the Medusa admin):

1. Blue Sapphire and Diamond Pave Ring – 1.17 TCW (Sri Lanka)
2. Teal Sapphire and Diamond Halo Ring – 1.17 TCW (Madagascar)
3. Royal Blue Sapphire and Diamond Ring – 1.95 TCW (Sri Lanka)
4. Yellow Sapphire and Diamond Ring – 1.69 TCW (Sri Lanka)
5. Natural Blue Sapphire Halo Ring – 1.58 TCW (Sri Lanka)
6. Peach Sapphire and Diamond Halo Ring – 2.08 TCW (Madagascar)
7. Cornflower Blue Sapphire and Diamond Pave Ring – 1.53 TCW (Sri Lanka)
8. Pink Sapphire and Diamond Petite Ring – 0.46 TCW (Madagascar)

Each has the metadata schema:
```ts
{
  gemstone_type: string;          // e.g. "Blue Sapphire"
  gemstone_color: string;         // e.g. "Royal Blue"
  total_carat_weight: string;     // e.g. "1.17"
  metal: string;                  // e.g. "18K White Gold"
  origin: "Sri Lanka" | "Madagascar";
  is_new_arrival: boolean;
  certificate?: string;           // e.g. "GIA Certified"
  collection_handles?: string[];  // many-to-many sim, used by storefront filtering
}
```

## Conventions

- **No `.js`** in storefront or backend source code — only `.ts` / `.tsx`. (The mock API route stays as a single `.ts` file.)
- **No Mongo.** PostgreSQL only. The original Emergent template's Mongo dependencies have been removed.
- **No hardcoded URLs** — the storefront uses `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, the backend uses `DATABASE_URL`. See `.env.example` in each app.
- **All backend API routes** in `apps/backend/src/api/store/...` (public) and `apps/backend/src/api/admin/...` (protected by Medusa admin auth).
- **Sales-channel-aware:** the storefront must always send `x-publishable-api-key` (the client handles this when `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` is set).

## Common Tasks

- **Add a new product:** Medusa Admin → Products. Don't edit code.
- **Add a new collection:** Medusa Admin → Collections. Make sure the handle matches one of the 8 if the storefront links to it explicitly.
- **Change hero / sections / announcement:** Medusa Admin → Site Config (left sidebar).
- **Add iyzico (v2):** Look up the latest community Medusa v2 iyzico plugin; add a second provider under `modules → payment.options.providers` in `medusa-config.ts`.

## DON'T

- Don't reintroduce MongoDB. Postgres only.
- Don't change `--color-gold` / brand palette without owner approval.
- Don't add rounded-xl / 2xl shadows; the brand UI is square-edged and shadow-free.
- Don't ship `.env` files. Use `.env.example` and document them in README.
