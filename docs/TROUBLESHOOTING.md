# Eledante — Troubleshooting

Quick fixes for the most common deploy errors.

---

## Build & start

### “Medusa server failed to start — missing DATABASE_URL”
- Check `apps/backend/.env` exists and contains `DATABASE_URL`.
- `pm2 logs eledante-backend --lines 200` will show the exact missing variable.

### “Connection refused to Postgres / SSL required”
- Neon **requires** `sslmode=require` in the connection string.
- Confirm `databaseDriverOptions: { ssl: { rejectUnauthorized: false } }` is present in `medusa-config.ts` (it is by default).

### “medusa: command not found”
You ran `yarn medusa ...` outside the workspace. Always use:
```bash
yarn workspace @eledante/backend <script>
```

### “next: command not found”
Same reason — use `yarn workspace @eledante/storefront <script>`.

### Out-of-memory during build
First Medusa build needs ~1.5 GB. Either upgrade the VPS or enable swap (see Deployment guide §3c).

---

## Storefront

### Homepage loads but products are empty
1. Open DevTools → Network → reload → inspect `/store/products` request.
2. **401 Unauthorized** → missing/wrong `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`. Re-issue from Admin → Settings → Publishable API Keys → paste → rebuild storefront → `pm2 restart eledante-storefront`.
3. **400 Bad Request** → publishable key not assigned to the **Eledante Storefront** sales channel. Open the key in Admin and assign it.
4. **CORS error** → add `https://eledante.builtbymar.net` to `STORE_CORS` in `apps/backend/.env`, then `pm2 restart eledante-backend`.

### Images broken (404 on Unsplash/Pexels)
Those are placeholder URLs from the seed. Once the brand uploads real photos in the admin, replace each product’s thumbnail in **Products → … → Edit → Media**.

### Hero is blank / TypeError reading “title”
The hero now defensively renders a fallback slide. If you still see a blank hero, it means `mode: 'video'` is set with no `video_url`. Go to Admin → **Site Config → Hero Section** → set mode back to *Slideshow* and click **Save**.

### “Add to Bag” does nothing
Check the DevTools Network tab. Likely causes:
- The variant ID being POSTed doesn’t exist on the real backend (only on the mock). Re-seed: `yarn workspace @eledante/backend seed`.
- The publishable key isn’t attached to the sales channel (see above).

---

## Admin

### `/app` returns 404
You need to **build** the backend after first install — the admin SPA is bundled by `medusa build`:
```bash
yarn workspace @eledante/backend build
pm2 restart eledante-backend
```

### “Invalid email or password”
Use the user you created in step 9 of the Deployment guide. To reset:
```bash
yarn workspace @eledante/backend user --email you@eledante.com --password "<new>"
```
If you already have that user, this command will print an error — use the Admin UI’s “Forgot password” flow (requires SMTP) or delete & recreate with:
```bash
psql "$DATABASE_URL" -c "DELETE FROM \"user\" WHERE email='you@eledante.com';"
yarn workspace @eledante/backend user --email you@eledante.com --password "<new>"
```

### Custom “Site Config” page is missing from sidebar
The admin SPA is bundled at build time. After editing `src/admin/...` you must:
```bash
yarn workspace @eledante/backend build
pm2 restart eledante-backend
```

---

## Payments

### Stripe webhook keeps failing
- Endpoint URL must be `https://api.eledante.builtbymar.net/hooks/payment/stripe` (note the `/hooks/payment/stripe` path — not `/api/...`).
- `STRIPE_WEBHOOK_SECRET` in `.env` must exactly match the signing secret from the Stripe dashboard’s endpoint detail page.
- After updating: `pm2 restart eledante-backend`.

### Test card declined
Use Stripe test card `4242 4242 4242 4242` with any future expiry and any 3-digit CVC. Other test cards: https://docs.stripe.com/testing.

---

## Nginx / SSL (CloudPanel)

### `502 Bad Gateway`
CloudPanel’s Nginx is up but the upstream Node app is down. Run `pm2 status`. If the app shows `errored`, run `pm2 logs <name> --lines 200` to see why.

### SSL cert expired
CloudPanel auto-renews Let’s Encrypt certs. If it failed (cron stopped), in CloudPanel UI → Site → SSL/TLS → click **Renew**.

### Mixed-content warning in the browser
Means the storefront is still hitting `http://api...` somewhere. Confirm `NEXT_PUBLIC_MEDUSA_BACKEND_URL` starts with `https://` and rebuild.

---

## Database

### “Too many connections” on Neon free tier
Free tier has a 100-connection cap. If you see this, switch the connection string to the **pooled** endpoint (Neon dashboard → Connection Details → toggle *Pooled*).

### Migration fails halfway
```bash
yarn workspace @eledante/backend db:migrate --revert    # rollback the failed migration
# then fix the cause and re-run db:migrate
```

### Re-seed without losing orders
The seed script is idempotent for collections (handle is the unique key). For products it will throw on duplicate handles. If you need a clean re-seed:
```bash
psql "$DATABASE_URL" -c "TRUNCATE product, product_collection RESTART IDENTITY CASCADE;"
yarn workspace @eledante/backend seed
```

---

## When all else fails

1. `pm2 logs --lines 500 > /tmp/eledante.log`
2. `cat apps/backend/.env apps/storefront/.env | sed 's/=.*/=***/'`  (redacts values, keeps the keys)
3. Open an issue in the GitHub repo with both outputs attached.
