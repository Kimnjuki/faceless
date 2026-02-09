# Diagnose Empty Results Issue

## Problem
Tables exist but no results are showing up.

## Quick Diagnosis

Run this in Supabase SQL Editor to check:

```sql
-- Check if tables have data
SELECT 'templates' as table, COUNT(*) as count FROM public.templates
UNION ALL
SELECT 'articles (published)', COUNT(*) FROM public.articles WHERE status = 'published'
UNION ALL
SELECT 'platform_guides (published)', COUNT(*) FROM public.platform_guides WHERE published = true;
```

## Common Issues & Fixes

### Issue 1: No Data in Tables

**Solution:** Add sample data using `CHECK_AND_FIX_DATA.sql`

### Issue 2: RLS Policies Blocking Access

**Solution:** Run the RLS policy fixes in `CHECK_AND_FIX_DATA.sql`

### Issue 3: Articles Content Type Mismatch

Your schema shows `articles.content` is `jsonb`, but the code might expect `text`. The code should handle both, but let's verify.

### Issue 4: Status/Published Filters

- Articles: Only shows `status = 'published'`
- Platform Guides: Only shows `published = true`

Make sure your data has these values set correctly.

## Step-by-Step Fix

1. **Run Diagnostic:**
   ```sql
   -- Copy from CHECK_AND_FIX_DATA.sql section 1
   ```

2. **Fix RLS Policies:**
   ```sql
   -- Copy from CHECK_AND_FIX_DATA.sql section 2
   ```

3. **Add Sample Data:**
   ```sql
   -- Copy from CHECK_AND_FIX_DATA.sql section 3
   ```

4. **Verify:**
   ```sql
   -- Copy from CHECK_AND_FIX_DATA.sql section 4
   ```

5. **Refresh Schema Cache:**
   - Settings → API → Refresh Schema Cache

6. **Test in Browser:**
   - Hard refresh (Ctrl+Shift+R)
   - Check browser console for errors













