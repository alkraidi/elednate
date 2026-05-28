# Eledante — Fine Jewelry E-commerce

A premium ethically-sourced sapphire & diamond ring storefront for **Eledante** (Istanbul, Türkiye).

- **Storefront** — Next.js 15, App Router, TypeScript, Tailwind, shadcn/ui.
- **Backend** — Medusa.js v2, PostgreSQL (Neon), Stripe payments, 3 custom admin widgets.
- **Deployment** — Hostinger VPS via CloudPanel + PM2.

---

## Repository layout

```
eledante/
├── apps/
│   ├── storefront/          # Next.js 15  →  port 3100
│   └── backend/             # Medusa.js v2 →  port 9000
├── ecosystem.config.js       # PM2 manifest (both apps)
├── package.json              # Yarn workspaces root
├── CLAUDE.md                 # Engineering context
└── .gitignore
```

---

## Quick start (local development)

```bash
# 1. Install dependencies (both apps)
yarn install

# 2. Set up env files
cp apps/storefront/.env.example apps/storefront/.env
cp apps/backend/.env.example   apps/backend/.env
# Edit the .env files with your real values—see "Environment variables" below

# 3. (Backend only) Create database + run migrations + seed 8 products
yarn workspace @eledante/backend db:setup
yarn workspace @eledante/backend seed

# 4. (Backend only) Create an admin user
yarn workspace @eledante/backend user --email you@eledante.com --password choose-one

# 5. Run dev servers (in two terminals)
yarn dev:backend       # → http://localhost:9000  (admin at /app)
yarn dev:storefront    # → http://localhost:3100
```

If you just want to demo the storefront UI without spinning up Medusa, leave `NEXT_PUBLIC_MEDUSA_BACKEND_URL` **unset** in `apps/storefront/.env` — the storefront will use its built-in `/api/store` mock and ship with the 8 seed products.

---

## Environment variables

Full annotated examples live in `apps/storefront/.env.example` and `apps/backend/.env.example`. Required values:

### `apps/storefront/.env`

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Public URL of your Medusa backend. Leave unset to use the local mock. |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Publishable API key (Medusa Admin → Settings → Publishable API Keys). |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe **publishable** key. |
| `NEXT_PUBLIC_BASE_URL` | Canonical storefront URL (for OG tags). |

### `apps/backend/.env`

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (`postgresql://…?sslmode=require`). |
| `STORE_CORS` / `ADMIN_CORS` / `AUTH_CORS` | Comma-separated allow-lists. |
| `JWT_SECRET` / `COOKIE_SECRET` | Generate with `openssl rand -base64 48`. |
| `MEDUSA_BACKEND_URL` | Public URL of this backend. |
| `STRIPE_API_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe **secret** keys. |

---

## How the custom CMS works

In the Medusa admin (`https://api.eledante.builtbymar.net/app`), open **Site Config** in the left sidebar. You’ll see three editors:

1. **Announcement Bar** — toggle, edit the gold strip text & colors.
2. **Hero Section** — switch between slideshow and video; add/remove slides; set seconds per slide.
3. **Homepage Sections** — show/hide New Arrivals, Category Tiles, High End Collection, Services row.

Products, collections, orders, customers, discounts, shipping, and API keys are managed in their standard Medusa admin sections.

The storefront polls `/store/config/hero|homepage|announcement` on each page load, so changes go live immediately (no rebuild).

---

## Production deployment (Hostinger VPS + CloudPanel + PM2)

This is the path the brand uses. Total time end-to-end: ~30 minutes.

### 0. Prerequisites

- A Hostinger VPS with CloudPanel installed (Node.js application stack).
- DNS records pointing at the VPS:
  - `eledante.builtbymar.net` → VPS IP (A record)
  - `api.eledante.builtbymar.net` → VPS IP (A record)
- A Neon Postgres project (free tier): https://console.neon.tech
- A Stripe account in live mode (or test mode for staging).

### 1. Create the Postgres database (Neon)

1. Create a project in Neon (region nearest your VPS).
2. Copy the **direct** connection string (`postgresql://…/?sslmode=require`). You’ll paste it into `apps/backend/.env` as `DATABASE_URL`.
3. Optional: enable IP allow-list for your VPS public IP.

### 2. Create the two CloudPanel sites

In CloudPanel → **+ Add Site** → *Node.js*:

| Site | Domain | App port |
|---|---|---|
| `eledante-storefront` | `eledante.builtbymar.net` | `3100` |
| `eledante-backend` | `api.eledante.builtbymar.net` | `9000` |

For each site, enable **Let’s Encrypt** SSL. CloudPanel auto-generates an nginx reverse proxy from the public 443 port to the internal app port.

### 3. Clone the repo onto the VPS

```bash
# SSH into the VPS as the site user (CloudPanel created one per site).
cd /home/your-cp-user/htdocs
sudo apt install -y git
git clone git@github.com:ammaralkraidi/eledante.git eledante
cd eledante

# Install Node 20 + Yarn classic
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
sudo npm install -g yarn@1.22.22 pm2

yarn install
```

### 4. Configure env files

```bash
cp apps/backend/.env.example   apps/backend/.env
cp apps/storefront/.env.example apps/storefront/.env

# Fill in the real values (see "Environment variables" above).
nano apps/backend/.env
nano apps/storefront/.env
```

### 5. Run database setup + seed

```bash
yarn workspace @eledante/backend db:setup     # create schema + run migrations
yarn workspace @eledante/backend seed         # seed 8 collections + 8 products
yarn workspace @eledante/backend user --email you@eledante.com --password "<choose-one>"
```

### 6. Build the two apps

```bash
yarn workspace @eledante/backend build
yarn workspace @eledante/storefront build
```

### 7. Boot with PM2

```bash
sudo mkdir -p /var/log/eledante && sudo chown -R $USER /var/log/eledante
pm2 start ecosystem.config.js
pm2 save
pm2 startup     # follow the printed command to enable auto-start on reboot
pm2 status
```

### 8. Configure the Stripe webhook

In Stripe → Developers → Webhooks:

- Endpoint URL: `https://api.eledante.builtbymar.net/hooks/payment/stripe`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copy the signing secret → paste into `apps/backend/.env` as `STRIPE_WEBHOOK_SECRET` → `pm2 restart eledante-backend`.

### 9. Create a storefront publishable API key

1. Open `https://api.eledante.builtbymar.net/app`, log in.
2. **Settings → Publishable API Keys → Create**.
3. Assign it to the **Eledante Storefront** sales channel (created by the seed).
4. Copy the key into `apps/storefront/.env` as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` → rebuild storefront → `pm2 restart eledante-storefront`.

---

## Updating the site after deployment

```bash
ssh you@vps
cd /home/your-cp-user/htdocs/eledante
git pull
yarn install
yarn workspace @eledante/backend db:migrate    # only if backend migrations changed
yarn workspace @eledante/backend build
yarn workspace @eledante/storefront build
pm2 restart all
```

## Roadmap

- **v1 (this release):** Storefront + Medusa backend + Stripe + 3 admin widgets.
- **v2:** Add iyzico (community plugin) for TR-local payments. Add Turkish translation. Wishlist. Email transactional templates.

## License

Proprietary — Eledante. All rights reserved.
