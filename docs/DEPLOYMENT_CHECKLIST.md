# Deployment Checklist: Convex + Coolify

**Production Convex URL:** `https://fabulous-roadrunner-783.convex.cloud`  
**Date:** 2026-01-28

---

## ✅ What Was Fixed

### 1. ConvexProvider Integration
- ✅ Added `ConvexProvider` wrapper in `src/main.tsx`
- ✅ Convex client initialized with `VITE_CONVEX_URL`
- ✅ Graceful fallback if Convex URL is not set

### 2. Convex Queries Created
- ✅ `convex/articles.ts`:
  - `list` - List articles with filters (status, categoryId, limit)
  - `getBySlug` - Get article by slug with category/author/tags
  - `incrementViews` - Increment view count
- ✅ `convex/contentCategories.ts`:
  - `list` - List all categories
  - `getBySlug` - Get category by slug

### 3. Code Quality
- ✅ No TypeScript/linter errors
- ✅ All imports correct
- ✅ Schema indexes verified (`by_slug`, `by_status`, `by_article`)

---

## 🔧 Required Actions in Coolify

### Step 1: Set Environment Variable

**In Coolify Dashboard:**
1. Navigate to your application
2. Go to **Environment Variables** section
3. Add:
   ```
   VITE_CONVEX_URL=https://fabulous-roadrunner-783.convex.cloud
   ```
   ⚠️ **Important:** No trailing slash, exact URL as shown
4. Click **Save**

### Step 2: Rebuild Application

**Why rebuild?** Vite bakes environment variables into the build at compile time. You must rebuild after setting env vars.

1. In Coolify, click **"Rebuild"** or **"Redeploy"**
2. Wait for build to complete (check logs)
3. Verify no build errors

### Step 3: Verify Deployment

**After rebuild, check:**

1. **Browser Console:**
   ```
   Open DevTools → Console
   Should see: No errors about VITE_CONVEX_URL
   ```

2. **Network Tab:**
   ```
   Should see: Requests to fabulous-roadrunner-783.convex.cloud
   ```

3. **Convex Dashboard:**
   ```
   https://dashboard.convex.dev
   → Logs → Should see requests from production site
   ```

---

## ⚠️ Current State

### Backend (Convex)
- ✅ Schema deployed (52 tables)
- ✅ Data imported (688 rows across 27 tables)
- ✅ Queries ready (`articles`, `contentCategories`)

### Frontend
- ✅ ConvexProvider added
- ⚠️ Hooks still use Supabase (expected - Phase 5 migration pending)

**What this means:**
- Convex is ready and connected
- App will continue using Supabase until hooks are migrated
- **This is safe** - both databases can coexist during migration

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
- Convex Dashboard → Deployments → Production is active
- Browser console for specific error message

### App still shows Supabase data

**Expected:** Until hooks are migrated (Phase 5)

**To switch to Convex:**
- Migrate hooks to use Convex queries (see `docs/CONVEX_NEXT_STEPS.md`)

### Build fails in Coolify

**Check:**
- Build logs for specific error
- Ensure `VITE_CONVEX_URL` is set **before** build
- Verify Dockerfile is correct (should be fine)

---

## 📋 Verification Checklist

- [ ] `VITE_CONVEX_URL` set in Coolify to `https://fabulous-roadrunner-783.convex.cloud`
- [ ] Application rebuilt in Coolify
- [ ] Build completed without errors
- [ ] Site loads without errors
- [ ] Browser console shows no Convex errors
- [ ] Network tab shows requests to Convex
- [ ] Convex Dashboard shows production requests

---

## 🚀 Next Steps (After Deployment)

1. **Verify Convex connection** (see Step 3 above)
2. **Migrate hooks** (Phase 5) - Start with `useArticles.ts`
3. **Test data loading** from Convex
4. **Remove Supabase** dependencies after full migration

---

## 📚 Related Documentation

- `docs/PROJECT_STATUS_REPORT.md` - Full status report
- `docs/QUICK_FIXES.md` - Quick reference
- `docs/CONVEX_NEXT_STEPS.md` - Phase 5 migration guide
- `docs/COOLIFY_CONVEX_DEPLOYMENT.md` - Full deployment guide

---

**Run diagnostic locally:** `node scripts/check-convex-setup.mjs`
