# Quick Fixes for Convex + Coolify Deployment

## ✅ Fixed Issues

1. **ConvexProvider Added** - `src/main.tsx` now wraps app with ConvexProvider
2. **Convex Queries Created** - Basic queries for articles and categories
3. **Environment Variable Setup** - Dockerfile configured for `VITE_CONVEX_URL`

---

## 🔧 Required Actions in Coolify

### Step 1: Set Environment Variable

1. Go to **Coolify Dashboard** → Your Application → **Environment Variables**
2. Add:
   ```
   VITE_CONVEX_URL=https://fabulous-roadrunner-783.convex.cloud
   ```
3. **Save** the environment variables

### Step 2: Rebuild Application

1. In Coolify, click **"Rebuild"** or **"Redeploy"**
2. Wait for build to complete
3. Check build logs for any errors

### Step 3: Verify Deployment

After rebuild, check:

1. **Browser Console:**
   - Open your site
   - Open DevTools → Console
   - Should see no errors about `VITE_CONVEX_URL`
   - Should see Convex connecting (check Network tab)

2. **Convex Dashboard:**
   - Go to https://dashboard.convex.dev
   - Check **Logs** → Should see requests from your production site

---

## ⚠️ Current Status

**Backend:** ✅ Ready (688 rows imported)  
**Frontend:** ⚠️ Still uses Supabase (hooks not migrated yet)

**What this means:**
- Convex is set up and ready
- App will continue using Supabase until hooks are migrated
- This is **safe** - both databases can coexist during migration

---

## 🐛 Troubleshooting

### Error: "VITE_CONVEX_URL is not set"

**Cause:** Environment variable not set in Coolify before build

**Fix:**
1. Set `VITE_CONVEX_URL` in Coolify environment variables
2. **Rebuild** the application (env vars are baked into build)

### Error: "Convex connection failed"

**Check:**
- URL is correct: `https://fabulous-roadrunner-783.convex.cloud` (no trailing slash)
- Convex Dashboard → fabulous-roadrunner-783 is active (do NOT use wandering-dove-865)
- Browser console for specific error message

### App still shows Supabase data

**Expected:** Until hooks are migrated (Phase 5)

**To switch to Convex:**
- Migrate hooks to use Convex queries (see `docs/CONVEX_NEXT_STEPS.md`)

---

## 📋 Verification Checklist

- [ ] `VITE_CONVEX_URL` set in Coolify
- [ ] Application rebuilt in Coolify
- [ ] Site loads without errors
- [ ] Browser console shows no Convex errors
- [ ] Convex Dashboard shows production requests

---

**Run diagnostic:** `node scripts/check-convex-setup.mjs`
