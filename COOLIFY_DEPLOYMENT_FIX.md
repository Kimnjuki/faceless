# Coolify Deployment Fix - GitHub Token Error

**Error:** `Failed to get installation token for coolify-kimnjuki with error: no error message found`

**Status:** GitHub Authentication Issue  
**Fix Required:** Coolify Configuration

---

## 🔍 Problem Diagnosis

This error indicates that Coolify cannot authenticate with GitHub to access your repository. This is a **configuration issue**, not a code issue.

---

## ✅ Solution Steps

### Step 1: Check GitHub App Installation

1. **Go to Coolify Dashboard**
   - Navigate to your Coolify instance
   - Go to **Settings** → **GitHub**

2. **Verify GitHub App Status**
   - Check if GitHub App is installed
   - Verify it has access to repository: `Kimnjuki/faceless`

3. **Re-install GitHub App (if needed)**
   - Click "Install GitHub App" or "Re-authorize"
   - Select organization/user: `Kimnjuki`
   - Grant access to repository: `faceless`
   - Ensure permissions include:
     - ✅ Repository access
     - ✅ Contents (read)
     - ✅ Metadata (read)

---

### Step 2: Check Repository Access

1. **Verify Repository Exists**
   - Go to: https://github.com/Kimnjuki/faceless
   - Ensure repository is **public** or Coolify has access

2. **Check Repository Visibility**
   - If repository is **private**, ensure:
     - GitHub App has access to private repos
     - Coolify has proper permissions

---

### Step 3: Update Coolify Application Settings

1. **Go to Application Settings**
   - Navigate to your application in Coolify
   - Click **Settings** or **Edit**

2. **Check Source Configuration**
   - **Source Type:** Should be "GitHub"
   - **Repository:** `Kimnjuki/faceless`
   - **Branch:** `main`
   - **Dockerfile:** `Dockerfile` (or leave empty for auto-detect)

3. **Re-save Configuration**
   - Click **Save** or **Update**
   - This will trigger a new deployment attempt

---

### Step 4: Use Personal Access Token (Alternative)

If GitHub App doesn't work, use a Personal Access Token:

1. **Create GitHub Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Click **Generate new token** → **Generate new token (classic)**
   - Name: `Coolify Deployment`
   - Expiration: Set appropriate expiration
   - Scopes:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `read:org` (if using organization)

2. **Copy Token**
   - Save token immediately (you won't see it again)

3. **Add to Coolify**
   - Go to Coolify → **Settings** → **GitHub**
   - Use **Personal Access Token** option
   - Paste token
   - Save

4. **Retry Deployment**
   - Go back to your application
   - Click **Redeploy** or trigger new deployment

---

### Step 5: Check Coolify Logs

1. **View Detailed Logs**
   - In Coolify dashboard
   - Go to your application
   - Click **Logs** tab
   - Look for more detailed error messages

2. **Check System Logs**
   - Coolify → **Settings** → **System Logs**
   - Look for GitHub-related errors

---

## 🔧 Quick Fix Checklist

- [ ] Verify GitHub App is installed in Coolify
- [ ] Check repository exists: https://github.com/Kimnjuki/faceless
- [ ] Verify repository visibility (public/private)
- [ ] Re-save application configuration in Coolify
- [ ] Try Personal Access Token method
- [ ] Check Coolify system logs for details
- [ ] Restart Coolify service (if self-hosted)

---

## 🚀 Alternative: Manual Deployment

If Coolify continues to fail, deploy manually:

### Option 1: Build and Push Docker Image

```bash
# Build Docker image
docker build -t faceless-app .

# Tag for your registry
docker tag faceless-app your-registry/faceless-app:latest

# Push to registry
docker push your-registry/faceless-app:latest
```

### Option 2: Use Vercel/Netlify (Easier)

Since you have `vercel.json` configured:

1. **Vercel Deployment:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify Deployment:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

---

## 📝 Environment Variables for Coolify

Make sure these are set in Coolify application settings:

### Required Variables:
```
VITE_CONVEX_URL=https://fabulous-roadrunner-783.convex.cloud
VITE_CLARITY_PROJECT_ID=vd7rgy7tu7
```

### Optional Variables:
```
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Note:** These should be set in Coolify's **Environment Variables** section, not in `.env` file.

---

## 🐛 Common Issues

### Issue 1: "Repository not found"
**Solution:** 
- Verify repository URL is correct
- Check repository exists and is accessible
- Ensure GitHub App has access

### Issue 2: "Permission denied"
**Solution:**
- Re-install GitHub App
- Use Personal Access Token instead
- Check repository permissions

### Issue 3: "Token expired"
**Solution:**
- Generate new Personal Access Token
- Update in Coolify settings
- Re-deploy

---

## 📞 Getting Help

### Coolify Resources:
- **Documentation:** https://coolify.io/docs
- **Discord:** https://discord.gg/coolify
- **GitHub Issues:** https://github.com/coollabsio/coolify/issues

### Check These:
1. Coolify version (update if outdated)
2. GitHub API rate limits
3. Network connectivity
4. Coolify service status

---

## ✅ Verification

After fixing, verify deployment:

1. **Check Build Logs**
   - Should see: "Cloning repository..."
   - Should see: "Building Docker image..."
   - Should see: "Deployment successful"

2. **Test Application**
   - Visit your deployed URL
   - Check if application loads
   - Verify environment variables are working

---

## 🎯 Next Steps After Fix

1. **Monitor First Deployment**
   - Watch logs carefully
   - Verify all steps complete

2. **Set Up Auto-Deploy**
   - Enable webhook in Coolify
   - Test by pushing to `main` branch

3. **Configure Domain**
   - Add custom domain in Coolify
   - Set up SSL certificate

4. **Set Environment Variables**
   - Add all required env vars
   - Verify they're loaded correctly

---

**Last Updated:** February 6, 2026  
**Status:** Troubleshooting Guide
