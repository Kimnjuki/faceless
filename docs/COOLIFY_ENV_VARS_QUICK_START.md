# Quick Start: Get Convex Environment Variables for Coolify

**Goal:** Get your Convex production URL and add it to Coolify environment variables.

---

## Step 1: Get Convex Production URL (Choose One Method)

### Method A: Deploy to Production (Recommended)

```bash
npx convex deploy --prod
```

**Output:**
```
✔ Deployed to production
  URL: https://fabulous-roadrunner-783.convex.cloud
```

**Copy the URL** → This is your `VITE_CONVEX_URL`

---

### Method B: From Convex Dashboard

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev)
2. Select your project (`faceless-fcf5c`)
3. **Settings** → **Deployments**
4. Find **Production** deployment
5. Copy the **URL**

---

## Step 2: Add to Coolify

1. **Open Coolify Dashboard**
2. Go to your application → **Environment Variables**
3. **Add:**
   ```
   VITE_CONVEX_URL=https://your-production-deployment.convex.cloud
   ```
   (Replace with your actual URL from Step 1)
4. **Save**

---

## Step 3: Rebuild

- **Trigger a rebuild** in Coolify (or push to git if auto-deploy is enabled)
- Vite embeds `VITE_CONVEX_URL` at build time, so rebuild is required

---

## Optional: Other Variables

If you're using Clerk for auth:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

Get from: [dashboard.clerk.com](https://dashboard.clerk.com) → Your app → API Keys

---

## Verify

After deployment:
1. Open your site
2. DevTools → Console
3. Should see Convex connecting (no errors)

---

**Full guide:** See `docs/COOLIFY_CONVEX_DEPLOYMENT.md` for detailed instructions.
