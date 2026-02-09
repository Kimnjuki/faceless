# How to Get Convex Environment Variables

Quick reference for getting Convex production environment variables for Coolify or any deployment platform.

---

## Method 1: Deploy to Production and Get URL

### Step 1: Deploy Convex to Production

```bash
npx convex deploy --prod
```

**Output example:**
```
✔ Deployed to production
  URL: https://fabulous-roadrunner-783.convex.cloud
  Deployment: fabulous-roadrunner-783
```

**Copy the URL** — this is your `VITE_CONVEX_URL` for production.

---

## Method 2: Get from Convex Dashboard

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev)
2. Sign in and select your project (e.g., `faceless-fcf5c`)
3. Navigate to **Settings** → **Deployments**
4. Find the **Production** deployment (or create one if it doesn't exist)
5. Copy the **URL** (e.g., `https://fabulous-roadrunner-783.convex.cloud`)

---

## Method 3: Check Your Local .env.local

Your local `.env.local` file (created by `npx convex dev`) has:

```
VITE_CONVEX_URL=https://your-dev-deployment.convex.cloud
CONVEX_DEPLOYMENT=your-dev-deployment-name
```

**Important:** The dev URL is different from production. You need to:
1. Deploy to production: `npx convex deploy --prod`
2. Use the production URL (not the dev one) in Coolify

---

## Environment Variables Summary

| Variable | Value | Where Used |
|----------|-------|------------|
| `VITE_CONVEX_URL` | `https://your-production-deployment.convex.cloud` | Frontend (browser) - connects React app to Convex |
| `CONVEX_DEPLOYMENT` | `your-production-deployment-name` | Optional - for CLI commands |

**Note:** Only `VITE_CONVEX_URL` is needed for the frontend app. `CONVEX_DEPLOYMENT` is for CLI use.

---

## For Coolify Specifically

1. **Get production URL** using Method 1 or 2 above
2. **In Coolify Dashboard**:
   - Go to your application → **Environment Variables**
   - Add: `VITE_CONVEX_URL=https://your-production-deployment.convex.cloud`
   - Save
3. **Rebuild** your application (Vite embeds env vars at build time)

---

## Verify It Works

After setting `VITE_CONVEX_URL` in Coolify and deploying:

1. Open your production site
2. Open browser DevTools → Console
3. You should see Convex connecting (no errors)
4. Check Convex Dashboard → Logs to see requests from production

---

## Troubleshooting

**"VITE_CONVEX_URL is undefined"**
- Ensure the variable is set in Coolify **before** building
- Rebuild the app (env vars are embedded at build time)
- Check Coolify build logs to confirm env vars are injected

**"Convex connection failed"**
- Verify the URL is correct (no trailing slash)
- Check Convex Dashboard → Deployments → Production is active
- Ensure your domain is allowed (usually allowed by default)
