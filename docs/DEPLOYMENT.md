# Eledante — Deploying to Hostinger VPS with CloudPanel

> **Audience:** the brand owner or a junior dev with shell access.
> **Time:** ~45 minutes end-to-end the first time.
> **What you get at the end:**
> - `https://eledante.builtbymar.net` — the public storefront.
> - `https://api.eledante.builtbymar.net` — the Medusa backend (admin at `/app`).

If you get stuck at any step, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

---

## 0. What you’ll need

| | |
|---|---|
| Hostinger VPS | KVM 2 or higher recommended (2 vCPU, 4 GB RAM, 80 GB disk). The smallest plan technically works but builds are slow. |
| OS | Ubuntu 22.04 LTS (default in Hostinger). |
| Panel | **CloudPanel** — installable from Hostinger’s VPS dashboard with one click. |
| Domain | A domain pointed at the VPS public IP. We assume `builtbymar.net` and two subdomains: `eledante.builtbymar.net`, `api.eledante.builtbymar.net`. |
| Neon | Free Postgres account at https://console.neon.tech |
| Stripe | Account at https://dashboard.stripe.com (test mode is fine to start) |
| Git access | SSH key or a GitHub Personal Access Token for `https://github.com/ammaralkraidi/eledante.git` |

---

## 1. Configure DNS

In your DNS provider (whoever manages `builtbymar.net`):

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `eledante` | `<VPS public IP>` | 300 |
| `A` | `api.eledante` | `<VPS public IP>` | 300 |

Wait 5–10 minutes and verify:

```bash
dig +short eledante.builtbymar.net
dig +short api.eledante.builtbymar.net
# Both should return the VPS IP.
```

---

## 2. Create a Postgres database (Neon free tier)

1. Sign in at https://console.neon.tech.
2. **+ New Project** → Name `eledante` → Region: the one geographically closest to your Hostinger VPS (Frankfurt for EU VPS).
3. After the project is created, open **Dashboard** → **Connection Details**.
4. Copy the **Connection string** (the *pooled* one is fine for Medusa). It looks like:
   ```
   postgresql://eledante_user:abc123@ep-blue-snow-12345.eu-central-1.aws.neon.tech/eledante?sslmode=require
   ```
5. Optional: in **Settings → Access** add the VPS public IP to the allow-list.

Keep that URL handy — it goes into `DATABASE_URL` shortly.

---

## 3. Install CloudPanel + base packages on the VPS

If CloudPanel is already installed (Hostinger does it for you on most plans), skip to 3c.

### 3a. Install CloudPanel (if needed)

SSH in as `root`:

```bash
ssh root@<vps-ip>
curl -sSL https://installer.cloudpanel.io/ce/v2/install.sh -o install.sh
sudo bash install.sh
```

The installer prints the CloudPanel URL (`https://<vps-ip>:8443`) and a one-time password. Open it in your browser and complete the wizard.

### 3b. Install Node.js 20 + Yarn + PM2 (globally)

Still as `root`:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs build-essential git
sudo npm install -g yarn@1.22.22 pm2
node -v        # → v20.x
yarn -v        # → 1.22.22
pm2 -v
```

### 3c. (Optional) Configure swap if you have <4 GB RAM

Medusa’s build is memory-hungry on first run. If `free -h` shows less than 4 GB of total memory, enable 2 GB of swap:

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 4. Create two CloudPanel sites (one per subdomain)

In the CloudPanel UI → **Sites → + Add Site → Create a Node.js Site**.

### 4a. Site 1 — the backend (Medusa)

| Field | Value |
|---|---|
| Domain Name | `api.eledante.builtbymar.net` |
| Node.js Version | `20` |
| App Port | `9000` |
| Site User | accept the default (e.g. `eledante-api`) |
| Site User Password | generate & save it |

After creation, in the site’s **SSL/TLS** tab click **Install Let’s Encrypt Certificate** → enable **Force HTTPS**.

### 4b. Site 2 — the storefront (Next.js)

| Field | Value |
|---|---|
| Domain Name | `eledante.builtbymar.net` |
| Node.js Version | `20` |
| App Port | `3100` |
| Site User | accept the default (e.g. `eledante-store`) |
| Site User Password | generate & save it |

Also install the Let’s Encrypt cert + Force HTTPS.

CloudPanel automatically configures Nginx to reverse-proxy public 443 → internal 9000 (api) and 443 → 3100 (storefront). You don’t need to edit Nginx by hand.

---

## 5. Clone the monorepo into ONE site directory

We keep the entire monorepo in the storefront site’s home directory and let PM2 run both processes from there. The backend site’s CloudPanel Node app is not used directly — it just provides the SSL + reverse-proxy.

SSH in as the storefront site user (NOT root):

```bash
ssh eledante-store@<vps-ip>     # password from CloudPanel
cd ~        # /home/eledante-store
# pick ONE of the two clone methods:

# Method A — with a GitHub Personal Access Token (HTTPS)
git clone https://<token>@github.com/ammaralkraidi/eledante.git

# Method B — with an SSH key already added to GitHub
git clone git@github.com:ammaralkraidi/eledante.git

cd eledante
yarn install     # installs both workspaces; takes 2–4 min
```

---

## 6. Configure environment variables

Backend:

```bash
cp apps/backend/.env.example apps/backend/.env
nano apps/backend/.env
```

Fill these:

```ini
DATABASE_URL=postgresql://eledante_user:...@ep-...neon.tech/eledante?sslmode=require

STORE_CORS=https://eledante.builtbymar.net
ADMIN_CORS=https://api.eledante.builtbymar.net
AUTH_CORS=https://eledante.builtbymar.net,https://api.eledante.builtbymar.net

JWT_SECRET=<paste output of: openssl rand -base64 48>
COOKIE_SECRET=<paste another: openssl rand -base64 48>

MEDUSA_BACKEND_URL=https://api.eledante.builtbymar.net

STRIPE_API_KEY=sk_test_...          # later: sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...     # filled in step 10
```

Storefront:

```bash
cp apps/storefront/.env.example apps/storefront/.env
nano apps/storefront/.env
```

```ini
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.eledante.builtbymar.net
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_     # filled in step 11
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=https://eledante.builtbymar.net
```

---

## 7. Initialise the database

```bash
cd ~/eledante
yarn workspace @eledante/backend db:setup
```

This runs all Medusa migrations + the three custom-module migrations (`hero_config`, `homepage_config`, `announcement`). On success you’ll see `[info] Migrations completed`.

---

## 8. Seed the catalog (8 collections + 8 products)

```bash
yarn workspace @eledante/backend seed
```

Expected output ends with:

```
[info] Seed complete — 8 collections, 8 products, default region.
```

This seeds the real Eledante catalog with full gemstone metadata (origin, TCW, color, metal, etc.).

---

## 9. Create the Medusa admin user

```bash
yarn workspace @eledante/backend user --email you@eledante.com --password "<choose-one>"
```

Make the password strong — the admin can edit prices and refund orders.

---

## 10. Build both apps

```bash
yarn workspace @eledante/backend build
yarn workspace @eledante/storefront build
```

- Backend build outputs to `apps/backend/.medusa/server` and bundles the admin SPA into `apps/backend/.medusa/admin`.
- Storefront build outputs `apps/storefront/.next` (with `output: 'standalone'`).

---

## 11. Boot both processes with PM2

```bash
sudo mkdir -p /var/log/eledante && sudo chown -R $USER:$USER /var/log/eledante
cd ~/eledante
pm2 start ecosystem.config.js
pm2 save
pm2 startup     # copy-paste the command PM2 prints to enable auto-restart on reboot
pm2 status      # both apps should be “online”
```

Logs:

```bash
pm2 logs eledante-backend
pm2 logs eledante-storefront
```

Verify endpoints (from any computer):

```bash
curl -I https://api.eledante.builtbymar.net/health        # → 200 OK
curl -I https://api.eledante.builtbymar.net/store/products  # → 200 (with publishable key) or 400 (without)
curl -I https://eledante.builtbymar.net/                     # → 200 OK
```

Open the admin: `https://api.eledante.builtbymar.net/app` → sign in with the email/password from step 9.

---

## 12. Stripe webhook

In Stripe Dashboard → **Developers → Webhooks → + Add endpoint**:

| | |
|---|---|
| Endpoint URL | `https://api.eledante.builtbymar.net/hooks/payment/stripe` |
| Events | `payment_intent.succeeded`, `payment_intent.payment_failed` |

After saving, Stripe shows a **Signing secret** (`whsec_...`). Paste it into `apps/backend/.env` as `STRIPE_WEBHOOK_SECRET`, then:

```bash
pm2 restart eledante-backend
```

---

## 13. Create a publishable API key for the storefront

1. Admin → **Settings → Publishable API Keys → Create**.
2. Name: `Storefront`.
3. Once created, click it and **Assign sales channel** → `Eledante Storefront` (created by the seed).
4. Copy the key (`pk_...`) into `apps/storefront/.env` as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.

Rebuild + restart the storefront:

```bash
yarn workspace @eledante/storefront build
pm2 restart eledante-storefront
```

---

## 14. Smoke-test from the browser

1. https://eledante.builtbymar.net/ → hero loads, 8 products visible in New Arrivals.
2. Click a product → PDP loads with gallery, size selector, metadata.
3. Add to bag → cart drawer opens.
4. Checkout → fill any address → use Stripe test card `4242 4242 4242 4242`, exp `12/34`, CVC `123` → “Place Order” → land on `/account?order=...`.
5. Admin → **Orders** → the order is listed.
6. Admin → **Site Config** (left sidebar) → toggle the announcement bar off → refresh storefront → the bar disappears immediately.

---

## 15. Updating after the initial deploy

After you push new commits to `main`:

```bash
ssh eledante-store@<vps-ip>
cd ~/eledante
git pull origin main
yarn install                                          # only if package.json changed
yarn workspace @eledante/backend db:migrate           # only if new migrations
yarn workspace @eledante/backend build
yarn workspace @eledante/storefront build
pm2 restart all
```

To roll back to a previous commit:

```bash
git log --oneline -n 10
git reset --hard <previous-commit-sha>
yarn install
yarn workspace @eledante/backend build
yarn workspace @eledante/storefront build
pm2 restart all
```

---

## 16. Backups

- **Database:** Neon takes automatic point-in-time backups (7-day retention on free tier). For belt-and-braces, run a nightly `pg_dump`:
  ```bash
  # /etc/cron.daily/eledante-pgdump
  pg_dump "$DATABASE_URL" | gzip > /var/backups/eledante-$(date +\%F).sql.gz
  ```
- **Uploaded media:** if you store product images in S3/MinIO, the bucket itself has versioning. If you use the default local file uploads, back up `~/eledante/apps/backend/static/`.

---

## 17. Monitoring & health

Quick health checks:

```bash
pm2 status                                  # both apps must show “online”
pm2 monit                                   # live CPU/memory dashboard
tail -f /var/log/eledante/backend.err.log   # follow backend errors
tail -f /var/log/eledante/storefront.err.log
```

Optional add-ons:

- **UptimeRobot** → add `https://eledante.builtbymar.net` and `https://api.eledante.builtbymar.net/health` as free checks (every 5 min).
- **Sentry** → install `@sentry/nextjs` in the storefront and `@sentry/node` in the backend if you want runtime error tracking. (Not done by default.)

---

## Appendix A — Switching the storefront preview off the real backend

If you ever want the storefront to use the in-process mock (e.g. for a feature demo without touching live data), edit `apps/storefront/.env`:

```ini
# NEXT_PUBLIC_MEDUSA_BACKEND_URL=     # comment out / leave blank
```

Rebuild + restart and the storefront talks to its built-in `/api/store/*` mock with the 8 seed products.

## Appendix B — Adding iyzico (v2)

iyzico is deferred to v2 because the community Medusa-v2 plugin is still maturing. To add it:

1. `yarn workspace @eledante/backend add medusa-payment-iyzico` (or whichever package is current at the time).
2. Add a second provider under `modules → payment.options.providers` in `apps/backend/medusa-config.ts`:
   ```ts
   {
     resolve: 'medusa-payment-iyzico',
     id: 'iyzico',
     options: {
       apiKey: process.env.IYZICO_API_KEY,
       secretKey: process.env.IYZICO_SECRET_KEY,
       baseUrl: process.env.IYZICO_BASE_URL,
     },
   }
   ```
3. Add `IYZICO_*` vars to `apps/backend/.env`.
4. Rebuild + restart the backend.
5. In Admin → **Settings → Regions** → add iyzico to the Turkish region’s payment providers.
