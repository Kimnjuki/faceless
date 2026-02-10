# ContentAnonymity v2.0 - Deployment Diagnostic Checklist

## 🔴 CRITICAL ISSUES (Fix Immediately)

### Issue 1: Site Not Loading
**Symptoms:** contentanonymity.com returns error or doesn't load

**Diagnosis Steps:**
- [ ] Run: `curl -I https://contentanonymity.com`
  - **Expected:** HTTP 200 response
  - **If 404/500:** Check Vercel deployment logs
  - **If timeout:** Check DNS settings

- [ ] Check Vercel Dashboard
  - URL: https://vercel.com/dashboard
  - [ ] Find "faceless" project
  - [ ] Check latest deployment status (should be green ✓)
  - [ ] If red ✗, click on deployment to see error logs

**Common Causes & Fixes:**

1. **Missing vercel.json**
   - **Fix:** Ensure `vercel.json` exists in project root with builds configuration
   - **Commit:** `git add vercel.json && git commit -m "fix: Add Vercel config"`
   - **Push:** `git push origin main`

2. **Build Failing**
   - **Test locally:** `npm run build`
   - **If errors:** Fix TypeScript/build errors
   - **Common error:** Output directory mismatch
   - **Fix:** Ensure `vite.config.ts` has `outDir: 'dist'` (default)

3. **Wrong Build Settings**
   - **Location:** Vercel Dashboard > Project Settings > Build & Development
   - **Framework:** Should be "Vite"
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

---

## 🟡 HIGH PRIORITY (Fix Soon)

### Issue 2: Routes Not Working (404 on Refresh)
**Symptoms:** Direct URLs like `/start-here` show 404

**Fix:**
- [ ] Ensure `vercel.json` exists with rewrite rules
- [ ] Verify React Router uses `BrowserRouter` (not `HashRouter`)
- [ ] Redeploy after adding vercel.json

### Issue 3: Assets Not Loading
**Symptoms:** Images/CSS/JS files return 404

**Diagnosis:**
- [ ] Check browser console for 404 errors
- [ ] Verify build output: `ls dist/assets/` or `dir dist\assets`
- [ ] Check if assets are in git: `git ls-files | grep assets`

**Fix:**
- [ ] Ensure assets are not in `.gitignore`
- [ ] Verify `vite.config.ts` has correct `assetsDir` setting
- [ ] Check `base` path in Vite config (should be `/`)

---

## 🟢 MEDIUM PRIORITY (Monitor)

### Issue 4: Environment Variables Missing
**Symptoms:** API features not working (script generator, voice studio, etc.)

**Fix:**
- [ ] Go to Vercel Dashboard > Project Settings > Environment Variables
- [ ] Add:
  - `VITE_OPENAI_API_KEY` = your_openai_key
  - `VITE_ELEVENLABS_API_KEY` = your_elevenlabs_key
  - `VITE_REPLICATE_API_KEY` = your_replicate_key
- [ ] Redeploy after adding variables

### Issue 5: Slow Build Times
**Symptoms:** Builds take >5 minutes or timeout

**Fix:**
- [ ] Clear Vercel build cache: Project Settings > General > Clear Build Cache
- [ ] Optimize dependencies in package.json
- [ ] Consider upgrading Vercel plan if on free tier

---

## 📋 DEPLOYMENT VERIFICATION CHECKLIST

### Pre-Deployment Checks (Local)
- [ ] `npm install` completes without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run preview` loads site at localhost:4173
- [ ] All pages accessible in preview:
  - [ ] `/` (home)
  - [ ] `/start-here`
  - [ ] `/learning-paths`
  - [ ] `/creator-studio`
- [ ] No console errors in browser dev tools
- [ ] All images load correctly

### Git Checks
- [ ] All files committed: `git status` shows clean
- [ ] Pushed to GitHub: `git push origin main`
- [ ] Latest commit visible on GitHub repo

### Vercel Checks
- [ ] Deployment triggered (check Vercel dashboard)
- [ ] Build logs show no errors
- [ ] Deployment shows green checkmark
- [ ] Production URL assigned

### Post-Deployment Checks (Production)
- [ ] https://contentanonymity.com loads
- [ ] https://contentanonymity.com/start-here loads
- [ ] https://contentanonymity.com/learning-paths loads
- [ ] https://contentanonymity.com/creator-studio loads
- [ ] SSL certificate valid (padlock icon in browser)
- [ ] No console errors in production
- [ ] All images/assets load
- [ ] Quiz functionality works
- [ ] Navigation between pages works
- [ ] Mobile responsive (test on phone)

---

## 🔧 QUICK FIX COMMANDS

### Force Redeploy
```bash
# Method 1: Empty commit
git commit --allow-empty -m "Force redeploy"
git push origin main

# Method 2: Vercel CLI
npm install -g vercel
vercel --prod --force
```

### Clear Everything and Rebuild
```bash
# Remove all build artifacts
rm -rf node_modules dist .vercel package-lock.json
# Windows PowerShell:
Remove-Item -Recurse -Force node_modules,dist,.vercel,package-lock.json -ErrorAction SilentlyContinue

# Fresh install
npm install

# Test build
npm run build

# If successful, commit and push
git add .
git commit -m "fix: Clean rebuild"
git push origin main
```

### Test DNS Resolution
```bash
# Check if domain resolves
dig contentanonymity.com
# Windows:
nslookup contentanonymity.com

# Check HTTP response
curl -I https://contentanonymity.com
# Windows PowerShell:
Invoke-WebRequest -Uri https://contentanonymity.com -Method Head

# Check full response
curl https://contentanonymity.com
# Windows PowerShell:
Invoke-WebRequest -Uri https://contentanonymity.com
```

---

## 🆘 EMERGENCY ROLLBACK

If everything fails and you need to restore service immediately:

### Step 1: Find Last Working Commit
```bash
git log --oneline
# Look for a commit before the issues started
```

### Step 2: Create Rollback
```bash
# Replace COMMIT_HASH with the working commit
git checkout -b emergency-rollback
git reset --hard COMMIT_HASH
git push origin emergency-rollback --force
```

### Step 3: Update Vercel
1. Go to Vercel Dashboard
2. Project Settings > Git
3. Change "Production Branch" to `emergency-rollback`
4. Wait for deployment

---

## 📞 SUPPORT RESOURCES

- **Vercel Support:** https://vercel.com/support
- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev/guide/
- **GitHub Status:** https://www.githubstatus.com
- **DNS Checker:** https://dnschecker.org

---

## 📊 MONITORING SETUP (After Restoration)

### Recommended Tools:
1. **Uptime Monitoring:** UptimeRobot or Pingdom
2. **Error Tracking:** Sentry
3. **Analytics:** Google Analytics or Plausible
4. **Performance:** Vercel Analytics (built-in)

### Alerts to Set Up:
- [ ] Email alert if site goes down
- [ ] Slack notification on failed deployments
- [ ] Weekly performance report

---

## 🎯 MOST LIKELY FIXES (In Order)

1. **Add/Update vercel.json** (85% of cases)
   - Ensure it has `builds` configuration with `distDir: "dist"`
   - Ensure rewrites are configured for SPA routing

2. **Fix build command/output dir** (75% of cases)
   - Verify Vercel build settings match Vite config
   - Ensure output directory is `dist`

3. **Clear build cache and redeploy** (60% of cases)
   - Clear cache in Vercel dashboard
   - Force redeploy

4. **Fix TypeScript errors** (50% of cases)
   - Run `npm run build` locally
   - Fix any compilation errors

5. **DNS propagation wait** (30% of cases)
   - Check DNS settings
   - Wait for propagation (can take up to 48 hours)

---

## 🚀 USING THE RESTORATION SCRIPT

### Windows (PowerShell):
```powershell
.\restore-deployment.ps1
```

### Linux/Mac (Bash):
```bash
chmod +x restore-deployment.sh
./restore-deployment.sh
```

The script will:
1. Verify project directory
2. Check Node.js version
3. Clean and reinstall dependencies
4. Verify/create vercel.json
5. Test build locally
6. Verify index.html
7. Test preview server
8. Show git status
9. Provide deployment recommendations

---

**Last Updated:** February 10, 2026  
**Status:** Diagnostic Tool - Use to identify and fix deployment issues
