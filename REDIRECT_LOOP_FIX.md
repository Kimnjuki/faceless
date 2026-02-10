# Redirect Loop Fix - ERR_TOO_MANY_REDIRECTS

## 🔴 Problem Identified

**Error:** `ERR_TOO_MANY_REDIRECTS`  
**Symptoms:** Infinite 301 redirects causing site to fail loading  
**Root Cause:** Rewrite rule in vercel.json conflicting with Vercel's automatic redirects

## ✅ Fix Applied

### Issue 1: Rewrite Rule Too Broad
The original rewrite rule was matching too many paths, potentially including `index.html` itself, causing a loop.

**Before:**
```json
"rewrites": [
  {
    "source": "/((?!(?:ads\\.txt|robots\\.txt|...)).*)",
    "destination": "/index.html"
  }
]
```

**After:**
```json
"rewrites": [
  {
    "source": "/((?!assets|images|static|_next|.*\\..*|ads\\.txt|robots\\.txt|sitemap\\.xml|logo-icon\\.svg|logo\\.svg|site\\.webmanifest|favicon\\.ico|og-image\\.jpg|index\\.html).*)",
    "destination": "/index.html"
  }
]
```

**Key Changes:**
- ✅ Explicitly excludes `index.html` to prevent self-redirect
- ✅ Excludes files with extensions (`.*\\..*`)
- ✅ Better pattern matching for static assets
- ✅ Excludes Vercel internal paths (`_next`)

### Issue 2: Conflicting Redirects
Removed the `/www/` redirect that might conflict with domain-level redirects.

**Before:**
```json
"redirects": [
  {
    "source": "/www/(.*)",
    "destination": "https://contentanonymity.com/:splat",
    "permanent": true
  }
]
```

**After:**
```json
"redirects": []
```

**Reason:** Vercel handles www redirects automatically at the domain level. Having both can cause conflicts.

## 🧪 Testing

### After Deployment:
1. Clear browser cache
2. Visit https://contentanonymity.com
3. Check Network tab - should see 200 OK, not 301 redirects
4. Verify page loads correctly

### Expected Behavior:
- ✅ Single request to root domain
- ✅ 200 OK response
- ✅ Page loads with content
- ✅ No redirect loops

## 📋 Vercel Configuration Best Practices

### For SPA Routing:
1. **Use rewrites, not redirects** for SPA routing
2. **Exclude static assets** from rewrites
3. **Exclude index.html** from rewrites
4. **Let Vercel handle** www and HTTPS redirects automatically

### Correct Pattern:
```json
{
  "rewrites": [
    {
      "source": "/((?!assets|images|static|.*\\..*|index\\.html).*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🚀 Next Steps

1. **Commit and Push:**
   ```bash
   git add vercel.json
   git commit -m "fix: Resolve redirect loop by fixing rewrite rules"
   git push origin main
   ```

2. **Wait for Deployment:**
   - Vercel will automatically deploy
   - Check deployment status in dashboard

3. **Test:**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Visit https://contentanonymity.com
   - Should load without redirects

## 🔍 If Still Having Issues

### Check Vercel Domain Settings:
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Check if there are any domain-level redirects configured
3. Ensure only one domain is set as primary
4. Remove any conflicting redirect rules

### Check DNS:
- Ensure DNS points directly to Vercel
- No CNAME chains that could cause redirects
- No CDN/proxy in front causing redirects

---

**Status:** Fix applied  
**Date:** February 10, 2026  
**Expected Result:** Site should load without redirect loops
