# Project Status Report: Convex Integration & Coolify Deployment

**Date:** 2026-01-28  
**Convex Production URL:** `https://fabulous-roadrunner-783.convex.cloud`  
**Status:** ✅ Data imported (688 rows), ⚠️ Code migration in progress

---

## ✅ What's Working

### 1. Convex Backend
- ✅ **Schema deployed:** All 52 tables defined in `convex/schema.ts`
- ✅ **Data imported:** 688 rows across 27 tables successfully imported
- ✅ **Functions created:**
  - `convex/articles.ts` - `importArticle`, `list`, `getBySlug`, `incrementViews`
  - `convex/contentCategories.ts` - `list`, `getBySlug`
  - `convex/import.ts` - `insertDocument` (for CSV import)

### 2. Environment Variables
- ✅ **Production URL set:** `https://fabulous-roadrunner-783.convex.cloud`
- ✅ **Deploy key provided:** `prod:fabulous-roadrunner-783|...` (for CLI use)
- ⚠️ **Frontend URL needed:** `VITE_CONVEX_URL` must be set in Coolify

### 3. Code Integration
- ✅ **ConvexProvider added:** `src/main.tsx` now wraps app with ConvexProvider
- ✅ **Convex client initialized:** Uses `VITE_CONVEX_URL` from env
- ✅ **Graceful fallback:** App works without Convex (shows warning)

---

## ⚠️ What Needs Attention

### 1. Frontend Still Uses Supabase
**Status:** All hooks and components still use Supabase. Convex is set up but not used yet.

**Files still using Supabase:**
- `src/hooks/useArticles.ts` → Uses `supabase.from('articles')`
- `src/hooks/useLearningPaths.ts` → Uses Supabase
- `src/hooks/useTools.ts` → Uses Supabase
- `src/hooks/useTemplates.ts` → Uses Supabase
- `src/hooks/usePlatformGuides.ts` → Uses Supabase
- `src/hooks/useNiches.ts` → Uses Supabase
- `src/hooks/useCommunityPosts.ts` → Uses Supabase
- `src/hooks/useUser.ts` → Uses Supabase
- `src/pages/ArticleDetail.tsx` → Uses Supabase
- `src/contexts/AuthContext.tsx` → Uses Supabase Auth
- All other pages/components using the hooks above

**Impact:** App will continue using Supabase until hooks are migrated to Convex.

---

### 2. Environment Variables in Coolify

**Required in Coolify:**
```
VITE_CONVEX_URL=https://fabulous-roadrunner-783.convex.cloud
```

**Optional (if using Clerk for auth):**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

**Note:** The deploy key (`prod:fabulous-roadrunner-783|...`) is for CLI use (e.g., `npx convex deploy`), not for the frontend. The frontend only needs `VITE_CONVEX_URL`.

---

### 3. Missing Convex Queries/Mutations

**Created:**
- ✅ `articles.list` - List articles with filters
- ✅ `articles.getBySlug` - Get article by slug
- ✅ `articles.incrementViews` - Increment view count
- ✅ `contentCategories.list` - List categories
- ✅ `contentCategories.getBySlug` - Get category by slug

**Still needed (for full migration):**
- ⚠️ `learningPaths.list`, `learningPaths.getById`
- ⚠️ `tools.list`, `tools.getById`
- ⚠️ `templates.list`, `templates.getById`
- ⚠️ `platformGuides.list`, `platformGuides.getBySlug`
- ⚠️ `niches.list`, `niches.getById`
- ⚠️ `profiles.getByUserId` (for auth)
- ⚠️ And others as you migrate hooks

---

## 🔧 Immediate Fixes Needed

### Fix 1: Verify Environment Variable in Coolify

1. **In Coolify Dashboard:**
   - Go to your application → **Environment Variables**
   - Ensure `VITE_CONVEX_URL=https://fabulous-roadrunner-783.convex.cloud` is set
   - **Save** and **rebuild** the application

2. **Verify build:**
   - Check Coolify build logs
   - Ensure no errors about `VITE_CONVEX_URL` being undefined

---

### Fix 2: Test Convex Connection

After rebuilding, test in browser console:

```javascript
// Should see Convex connecting (no errors)
// Check Network tab for requests to fabulous-roadrunner-783.convex.cloud
```

---

### Fix 3: Migrate Critical Hooks (Optional - Can Do Later)

To start using Convex data, migrate hooks one by one:

1. **Start with `useArticles`:**
   - Replace `supabase.from('articles')` with `useQuery(api.articles.list)`
   - See `docs/CONVEX_NEXT_STEPS.md` Phase 5 for details

2. **Then `ArticleDetail`:**
   - Replace Supabase query with `useQuery(api.articles.getBySlug, { slug })`
   - Replace RPC with `useMutation(api.articles.incrementViews)`

---

## 📋 Deployment Checklist

### Pre-Deployment
- [x] Convex schema deployed
- [x] Data imported to Convex (688 rows)
- [x] ConvexProvider added to `src/main.tsx`
- [x] Basic Convex queries created (`articles`, `contentCategories`)
- [ ] `VITE_CONVEX_URL` set in Coolify environment variables
- [ ] Application rebuilt in Coolify with env vars

### Post-Deployment Verification
- [ ] Site loads without errors
- [ ] Browser console shows no Convex connection errors
- [ ] Convex Dashboard → Logs shows requests from production
- [ ] Data loads (if hooks migrated) or still uses Supabase (if not migrated)

---

## 🚀 Current State

**Backend (Convex):** ✅ Ready  
**Data:** ✅ Imported  
**Frontend Integration:** ⚠️ Partial (ConvexProvider added, but hooks still use Supabase)  
**Deployment:** ⚠️ Needs `VITE_CONVEX_URL` in Coolify + rebuild

---

## Next Steps

1. **Immediate:** Set `VITE_CONVEX_URL` in Coolify and rebuild
2. **Short-term:** Migrate hooks to Convex (Phase 5) - see `docs/CONVEX_NEXT_STEPS.md`
3. **Long-term:** Remove Supabase dependencies after full migration

---

## Troubleshooting

### "VITE_CONVEX_URL is undefined" in browser
- **Fix:** Ensure env var is set in Coolify **before** build
- **Verify:** Check Coolify build logs for env var injection

### Convex connection fails
- **Check:** URL is correct (no trailing slash)
- **Check:** Convex Dashboard → Deployments → Production is active
- **Check:** Browser console for specific error

### App still uses Supabase
- **Expected:** Until hooks are migrated (Phase 5)
- **To switch:** Migrate hooks to use Convex queries/mutations

---

**Run diagnostic:** `node scripts/check-convex-setup.mjs` to check your setup.
