# Eledante — Fine Jewelry E-commerce

A premium ethically-sourced sapphire & diamond ring storefront for **Eledante** (Istanbul, Türkiye).

> **Brand site:** https://eledante.builtbymar.net (after deploy)
> **Admin:** https://api.eledante.builtbymar.net/app

---

## Tech stack

| Layer | Choice |
|---|---|
| Storefront | **Next.js 15**, App Router, TypeScript, Tailwind, shadcn/ui |
| Backend | **Medusa.js v2** with 3 custom modules + 3 admin widgets |
| Database | **PostgreSQL** (Neon free tier) |
| Payments | **Stripe** (v1). iyzico in v2. |
| Process manager | **PM2** |
| Hosting | **Hostinger VPS** + CloudPanel + Let’s Encrypt |

---

## Documentation

| | |
|---|---|
| [**docs/DEPLOYMENT.md**](./docs/DEPLOYMENT.md) | Step-by-step Hostinger VPS + CloudPanel + Neon + PM2 deploy guide. **Start here.** |
| [**docs/TROUBLESHOOTING.md**](./docs/TROUBLESHOOTING.md) | Common errors and fixes. |
| [**CLAUDE.md**](./CLAUDE.md) | Engineering context for the codebase (read before editing). |

---

## Repository layout

```
eledante/
├── apps/
│   ├── storefront/          # Next.js 15  →  port 3100
│   └── backend/             # Medusa.js v2 →  port 9000  (admin at /app)
├── docs/
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
├── ecosystem.config.js       # PM2 manifest (both apps)
├── package.json              # Yarn workspaces root
├── CLAUDE.md
└── .gitignore
```

---

## Local development

```bash
# 1. Install
yarn install

# 2. Copy env templates
cp apps/storefront/.env.example apps/storefront/.env
cp apps/backend/.env.example   apps/backend/.env
# Edit them — see docs/DEPLOYMENT.md for which values go where

# 3. (Backend) DB setup + seed
yarn workspace @eledante/backend db:setup
yarn workspace @eledante/backend seed
yarn workspace @eledante/backend user --email you@eledante.com --password "<choose>"

# 4. Run both apps (two terminals)
yarn dev:backend       # → http://localhost:9000  (admin at /app)
yarn dev:storefront    # → http://localhost:3100
```

Want to demo the storefront UI **without** spinning up Medusa? Leave `NEXT_PUBLIC_MEDUSA_BACKEND_URL` blank in `apps/storefront/.env`. The storefront will use its built-in `/api/store/*` mock that ships with the 8 seed products.

Pre-seeded demo account for the mock storefront: `demo@eledante.com` / `demo123`.

---

## Production deploy

See [**docs/DEPLOYMENT.md**](./docs/DEPLOYMENT.md) — the complete walkthrough.

Short version:

```bash
ssh eledante-store@<vps-ip>
git clone https://github.com/ammaralkraidi/eledante.git
cd eledante
yarn install
cp apps/backend/.env.example apps/backend/.env       # fill in DATABASE_URL, secrets, Stripe
cp apps/storefront/.env.example apps/storefront/.env # fill in NEXT_PUBLIC_*
yarn workspace @eledante/backend db:setup
yarn workspace @eledante/backend seed
yarn workspace @eledante/backend user --email you@eledante.com --password "..."
yarn workspace @eledante/backend build
yarn workspace @eledante/storefront build
pm2 start ecosystem.config.js && pm2 save && pm2 startup
```

---

## Updating after deploy

```bash
cd ~/eledante
git pull origin main
yarn install
yarn workspace @eledante/backend db:migrate    # only if migrations changed
yarn workspace @eledante/backend build
yarn workspace @eledante/storefront build
pm2 restart all
```

---

## How the CMS works

The **Medusa admin** at `https://api.eledante.builtbymar.net/app` is the store owner’s control panel.

Standard Medusa features (no setup needed):
- Products, collections, orders, customers, discounts, shipping, regions, API keys.

Custom *Site Config* page (left sidebar):
- **Announcement Bar** — toggle, text, colors.
- **Hero Section** — slideshow vs. video; add/remove slides; per-slide title, subtitle, CTA.
- **Homepage Sections** — show/hide New Arrivals, Category Tiles, High End Collection, Services row.

Changes go live on the storefront immediately on next page load — no rebuild required.

---

## Roadmap

- **v1 (this release)** — Storefront, Medusa backend, Stripe, 3 admin widgets, 8 seeded products.
- **v2** — iyzico (TR-local payments), Turkish translation, wishlist, transactional emails, sitemap & JSON-LD SEO.

## License

Proprietary — Eledante. All rights reserved.
