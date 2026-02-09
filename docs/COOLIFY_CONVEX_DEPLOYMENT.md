# Deploy to Coolify with Convex – Environment Variables Guide

This guide shows how to get Convex environment variables and configure them in Coolify for production deployment.

---

## Step 1: Get Convex Production Environment Variables

### 1.1 Deploy Convex to Production

1. **In your terminal**, from the project root, run:
   ```bash
   npx convex deploy --prod
   ```
   
   Or if you want to use a specific project:
   ```bash
   npx convex deploy --prod --project-name your-project-name
   ```

2. **Convex will output**:
   - Production deployment URL (e.g., `https://your-project.convex.cloud`)
   - Deployment name (e.g., `fabulous-roadrunner-783`)

3. **Note these values** — you'll need them for Coolify.

### 1.2 Get Production URL from Convex Dashboard

Alternatively, get the production URL from the Convex Dashboard:

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev)
2. Select your project (e.g., `faceless-fcf5c`)
3. Go to **Settings** → **Deployments**
4. Find the **Production** deployment
5. Copy the **URL** (e.g., `https://fabulous-roadrunner-783.convex.cloud`)

**This URL is your `VITE_CONVEX_URL` for production.**

---

## Step 2: Environment Variables Needed

Your app needs these environment variables in Coolify:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_CONVEX_URL` | Production Convex deployment URL | From `npx convex deploy --prod` or Convex Dashboard |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (if using Clerk for auth) | From [dashboard.clerk.com](https://dashboard.clerk.com) → Your app → API Keys |
| `CLERK_SECRET_KEY` | Clerk secret key (backend only; optional for frontend) | From Clerk Dashboard → API Keys (backend) |
| `VITE_GA4_MEASUREMENT_ID` | Google Analytics 4 ID (optional) | From Google Analytics |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key (if using Stripe) | From Stripe Dashboard |

**Note:** `VITE_` prefix means these are exposed to the browser. Never put secrets in `VITE_` variables.

### ⚠️ Do NOT add the Convex deploy key in Coolify

The **Convex deploy key** (e.g. `prod:fabulous-roadrunner-783|eyJ...`) is for **CLI only** (`npx convex deploy`).  
**Do not add it as an environment variable in Coolify.** It contains a pipe (`|`) which breaks the build when Coolify sources the env file (shell interprets `|` as a pipe → "command not found" and deployment failure).  
For the frontend build you only need **`VITE_CONVEX_URL`** (the URL, e.g. `https://fabulous-roadrunner-783.convex.cloud`).  
If deployment failed with "command not found" on line 5 of build-time.env, see **`docs/COOLIFY_DEPLOYMENT_FAILED_FIX.md`**.

---

## Step 3: Configure Environment Variables in Coolify

### 3.1 Add Environment Variables in Coolify Dashboard

1. **Open Coolify Dashboard** (e.g., `https://your-coolify-instance.com`)

2. **Navigate to your application**:
   - Go to **Applications** → Find your `contentanonymity` app
   - Or create a new application if you haven't yet

3. **Go to Environment Variables**:
   - Click on your application
   - Go to **Environment Variables** tab (or **Settings** → **Environment Variables**)

4. **Add each variable**:

   ```
   VITE_CONVEX_URL=https://your-production-deployment.convex.cloud
   ```

   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   ```

   ```
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

   (Add any others you need)

5. **Save** the environment variables

### 3.2 Alternative: Use Coolify's `.env` File Support

If Coolify supports `.env` files in your repo:

1. **Create `.env.production`** in your project root (do not commit to git):
   ```bash
   VITE_CONVEX_URL=https://your-production-deployment.convex.cloud
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **Add to `.gitignore`**:
   ```
   .env.production
   .env.local
   ```

3. **In Coolify**, configure it to use `.env.production` during build (if supported)

---

## Step 4: Update .env.example

Update your `.env.example` file to include Convex variables:

```bash
# Convex Configuration (Production)
VITE_CONVEX_URL=https://your-production-deployment.convex.cloud

# Auth (Clerk - recommended for Convex)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...

# Optional: Analytics
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Other Services
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx

# Legacy Supabase (remove after full migration)
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Step 5: Verify Convex Provider in Code (Before Deployment)

**Important:** Before deploying, ensure your app uses Convex. If you haven't done Phase 5 yet:

1. **Add ConvexProvider** to `src/main.tsx`:
   ```tsx
   import { ConvexProvider, ConvexReactClient } from "convex/react";
   
   const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
   
   ReactDOM.createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <HelmetProvider>
         <ConvexProvider client={convex}>
           <ErrorBoundary>
             <App />
           </ErrorBoundary>
         </ConvexProvider>
       </HelmetProvider>
     </StrictMode>,
   )
   ```

2. **If you're still using Supabase**, you can keep both temporarily (use a feature flag) or complete the migration first.

---

## Step 6: Coolify Build Configuration

### 6.1 Dockerfile (if using Docker)

Your existing `Dockerfile` should work. Ensure it:

1. Builds the Vite app: `npm run build`
2. Serves from `dist/` (e.g., with nginx or a static server)

### 6.2 Build Command in Coolify

In Coolify, set:

- **Build Command:** `npm run build`
- **Start Command:** (depends on your setup — e.g., `npm run preview` or nginx serving `dist/`)
- **Output Directory:** `dist`

### 6.3 Environment Variables During Build

Coolify should inject `VITE_*` variables during the build. Verify:

- Environment variables are set **before** the build runs
- `VITE_CONVEX_URL` is available during `npm run build` (Vite embeds it at build time)

---

## Step 7: Deploy and Verify

1. **Trigger deployment** in Coolify (push to git or manual deploy)

2. **After deployment**, verify:
   - Open your site (e.g., `https://contentanonymity.com`)
   - Open browser DevTools → Console
   - Check for Convex connection errors
   - Verify data loads from Convex (not Supabase)

3. **Check Convex Dashboard**:
   - Go to [dashboard.convex.dev](https://dashboard.convex.dev)
   - Select your project → **Logs**
   - Verify queries/mutations are being called from production

---

## Troubleshooting

### Issue: "VITE_CONVEX_URL is undefined"

**Fix:**
- Ensure `VITE_CONVEX_URL` is set in Coolify environment variables
- Rebuild the application (Vite embeds env vars at build time)
- Check Coolify logs to confirm env vars are injected

### Issue: Convex connection fails

**Fix:**
- Verify the production URL is correct (no trailing slash)
- Check Convex Dashboard → Deployments → Production is active
- Ensure your Convex project allows requests from your domain (usually allowed by default)

### Issue: Build fails

**Fix:**
- Check Coolify build logs for errors
- Ensure `npm install` runs successfully
- Verify Node.js version matches your project (check `package.json` engines if specified)

---

## Quick Reference: Getting Convex Production URL

**Method 1: From terminal**
```bash
npx convex deploy --prod
# Output: Production URL: https://your-deployment.convex.cloud
```

**Method 2: From Dashboard**
1. [dashboard.convex.dev](https://dashboard.convex.dev) → Your project
2. Settings → Deployments → Production
3. Copy the URL

**Method 3: From .env.local (dev)**
- Your `.env.local` has `VITE_CONVEX_URL` for dev
- Production URL will be different (usually same project, different deployment name)
- Use the production deployment URL, not the dev one

---

## Next Steps After Deployment

1. **Monitor Convex usage** in the Dashboard
2. **Set up Convex backups** (if not already enabled)
3. **Complete Phase 5** of migration (replace Supabase code with Convex queries/mutations)
4. **Remove Supabase** from production once fully migrated

---

**Note:** If you're still using Supabase in production, keep both `VITE_SUPABASE_URL` and `VITE_CONVEX_URL` set until you complete the code migration (Phase 5). Then remove Supabase env vars and switch fully to Convex.
