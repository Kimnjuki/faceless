# Deploy Convex to fabulous-roadrunner-783 (Primary Production)

**Primary Convex URL:** `https://fabulous-roadrunner-783.convex.cloud`

All data and content is stored in **fabulous-roadrunner-783**. The deployment **wandering-dove-865** is deprecated and must not be used.

---

## One-Time Setup: Make fabulous-roadrunner-783 the Production Target

By default, `npx convex deploy` deploys to **wandering-dove-865** (the project's current prod). To deploy to **fabulous-roadrunner-783** instead:

### Option A: Promote fabulous-roadrunner-783 to Production (Recommended)

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select project **faceless-fcf5c** (team: kimathi-njuki)
3. Use the **deployment dropdown** (top-left) → switch to **fabulous-roadrunner-783**
4. Go to **Settings** → **Deployments** (or **URL and Deploy Key**)
5. **Promote fabulous-roadrunner-783 to production** — this makes it the target of `npx convex deploy`
6. Optionally archive or remove **wandering-dove-865**

After this, `npm run deploy:convex` will deploy to fabulous-roadrunner-783.

### Option B: Use Deploy Key for fabulous-roadrunner-783

1. In Convex Dashboard, switch to **fabulous-roadrunner-783** (dropdown)
2. Go to **Settings** → **URL and Deploy Key**
3. Copy the deploy key (e.g. `dev:fabulous-roadrunner-783|eyJ...` or `prod:...`)
4. Add to `.env.local`:
   ```
   CONVEX_DEPLOY_KEY=dev:fabulous-roadrunner-783|your-key-here
   ```
5. Run deploy — it will target fabulous-roadrunner-783:
   ```powershell
   npm run deploy:convex
   ```

---

## Deploy Command

```powershell
npm run deploy:convex
```

Or:

```powershell
npx convex deploy --yes
```

---

## Environment Variables

| Variable | Value | Where |
|----------|-------|-------|
| `VITE_CONVEX_URL` | `https://fabulous-roadrunner-783.convex.cloud` | .env, .env.local, Coolify |
| `CONVEX_DEPLOYMENT` | `dev:fabulous-roadrunner-783` | .env.local (for `npx convex dev`) |
| `CONVEX_DEPLOY_KEY` | (from dashboard) | .env.local (optional, for deploy to fabulous-roadrunner-783) |

**Do NOT use:** `https://wandering-dove-865.convex.cloud`
