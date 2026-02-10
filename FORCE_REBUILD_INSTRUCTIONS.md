# Force Rebuild Instructions - Coolify

## 🔴 Current Issue

Coolify is using a **cached Docker image** with the old nginx.conf that has redirect rules causing loops.

**Deployment Log Shows:**
```
No configuration changed & image found (...) with the same Git Commit SHA. Build step skipped.
```

## ✅ Solution: Force Rebuild

The nginx.conf has been fixed, but you need to trigger a new build. Here are your options:

### Option 1: Commit and Push (Recommended)

The Dockerfile has been updated with a comment. Commit and push:

```bash
git add Dockerfile nginx.conf COOLIFY_DEPLOYMENT_STATUS.md FORCE_REBUILD_INSTRUCTIONS.md
git commit -m "fix: Remove redirect rules from nginx.conf to prevent loops"
git push origin main
```

This will trigger a new build in Coolify.

### Option 2: Force Rebuild in Coolify Dashboard

1. Go to Coolify Dashboard
2. Navigate to your application
3. Click **Settings** or **Edit**
4. Look for **"Force Rebuild"** or **"Clear Build Cache"** button
5. Click it to trigger a new deployment

### Option 3: Make a Small Code Change

If the above don't work, make a small change:

```bash
# Add a comment to any file
echo "# Rebuild trigger $(date)" >> src/App.tsx
git add .
git commit -m "chore: Trigger rebuild"
git push origin main
```

## 🔍 What Was Fixed

### nginx.conf Changes:
1. ✅ **Removed www redirect block** - Let Coolify handle it
2. ✅ **Removed trailing slash redirect** - Prevents loops
3. ✅ **Simplified to single server block** - No conflicts

### Files Deleted:
1. ✅ **public/_redirects** - Netlify file causing conflicts

## 📋 After Rebuild

1. **Watch Deployment Logs:**
   - Should see "Building Docker image..." (not "Build step skipped")
   - Verify nginx.conf is copied correctly
   - Check health check passes

2. **Test Site:**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Visit https://contentanonymity.com
   - Check Network tab - should see 200 OK (not 301)
   - Should load without redirect loops

3. **Verify:**
   - Page loads correctly
   - All routes work
   - No console errors

## 🎯 Expected Result

After rebuild:
- ✅ Single request to domain
- ✅ 200 OK response
- ✅ Page loads correctly
- ✅ No redirect loops
- ✅ All React Router routes work

---

**Action Required:** Commit and push changes, or force rebuild in Coolify  
**Status:** Fixes ready, waiting for rebuild
