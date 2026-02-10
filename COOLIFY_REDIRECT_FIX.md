# Coolify Redirect Loop Fix

## 🔴 Problem Identified

**Issue:** Redirect loop on Coolify deployment  
**Root Cause:** Nginx redirect rules conflicting with Coolify's proxy configuration

## ✅ Fixes Applied

### 1. Removed www Redirect Block
**Problem:** The nginx config had a server block redirecting www to non-www with HTTPS, but:
- Container only serves HTTP (port 80)
- Coolify handles SSL/TLS externally
- Coolify handles www redirects at proxy level

**Fix:** Removed the www redirect server block - let Coolify handle it

**Before:**
```nginx
server {
    listen 80;
    server_name www.contentanonymity.com;
    return 301 https://contentanonymity.com$request_uri;
}
```

**After:**
```nginx
# Note: Coolify handles www redirects and SSL externally
# This container only serves HTTP on port 80
```

### 2. Removed Trailing Slash Redirect
**Problem:** The trailing slash redirect (`/*/` → `/*`) was causing conflicts with React Router and could create loops

**Fix:** Removed trailing slash redirect - React Router handles routing, trailing slashes are fine

**Before:**
```nginx
location ~ ^/(.+)/$ {
    return 301 /$1$is_args$args;
}
```

**After:**
```nginx
# Note: Trailing slash redirect removed to prevent redirect loops
# React Router handles routing, so trailing slashes are fine
```

## 📋 Updated nginx.conf Structure

The nginx configuration now:
- ✅ Only listens on port 80 (HTTP)
- ✅ Accepts any hostname (`server_name _`)
- ✅ Serves static files with proper caching
- ✅ Handles SPA routing with `try_files`
- ✅ No redirect rules (Coolify handles these)
- ✅ Includes health check endpoint

## 🚀 Deployment Steps

1. **Commit Changes:**
   ```bash
   git add nginx.conf COOLIFY_REDIRECT_FIX.md
   git commit -m "fix: Remove redirect rules from nginx.conf to prevent loops"
   git push origin main
   ```

2. **Wait for Coolify Deployment:**
   - Coolify will automatically rebuild
   - Check deployment logs
   - Verify health check passes

3. **Test:**
   - Visit your Coolify domain
   - Should load without redirect loops
   - Check Network tab - should see 200 OK

## 🔍 How Coolify Works

1. **SSL/TLS:** Coolify's reverse proxy handles SSL certificates
2. **www Redirects:** Coolify can handle www → non-www at proxy level
3. **HTTP Only:** Container only needs to serve HTTP on port 80
4. **Routing:** Coolify routes traffic to your container

## ✅ Expected Behavior

After deployment:
- ✅ Single request to domain
- ✅ 200 OK response
- ✅ Page loads correctly
- ✅ No redirect loops
- ✅ All routes work

## 📝 Configuration Best Practices for Coolify

### Do:
- ✅ Serve HTTP only (port 80)
- ✅ Use `server_name _` to accept any hostname
- ✅ Let Coolify handle SSL/TLS
- ✅ Let Coolify handle www redirects
- ✅ Use `try_files` for SPA routing

### Don't:
- ❌ Don't configure SSL in nginx
- ❌ Don't add www redirects in nginx
- ❌ Don't add trailing slash redirects (can cause loops)
- ❌ Don't hardcode domain names in nginx

## 🐛 If Still Having Issues

1. **Check Coolify Proxy Settings:**
   - Go to Coolify → Application → Settings
   - Check if there are proxy-level redirects configured
   - Disable any conflicting redirects

2. **Check Domain Configuration:**
   - Verify domain is correctly configured in Coolify
   - Check if www redirect is enabled at Coolify level
   - Ensure only one domain is primary

3. **Check Container Logs:**
   - View nginx access logs
   - Check for redirect patterns
   - Verify nginx config is loaded correctly

---

**Status:** ✅ Fixed  
**Date:** February 10, 2026  
**Expected Result:** Site should load without redirect loops on Coolify
