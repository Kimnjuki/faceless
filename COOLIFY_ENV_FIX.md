# Coolify Environment Variables Fix
# This file explains how to properly configure environment variables for Coolify deployment

## Problem Identified:
Vite environment variables (VITE_*) need to be available at **build time**, not runtime.
Coolify sets environment variables at runtime by default, but Vite bakes them into the build output.

## Solution Options:

### Option 1: Update Coolify Build Settings (Recommended)
In Coolify Dashboard → Project Settings → Build & Development Settings:

**Build Arguments:**
```
VITE_CONVEX_URL=https://fabulous-roadrunner-783.convex.cloud
VITE_CLARITY_PROJECT_ID=vd7rgy7tu7
VITE_AUTH0_DOMAIN=https://dev-6czrkia48iopnpdg.us.auth0.com/api/v2/
VITE_AUTH0_CLIENT_ID=SejXeQ4JOXCfLOvqPxLREf205dJ3pUxt
```

**Environment Variables (Runtime):**
```
CONVEX_DEPLOYMENT=dev:fabulous-roadrunner-783
CONVEX_DEPLOY_KEY=dev:fabulous-roadrunner-783|eyJ2MiI6ImJhNDlmNWQ3NGM4ZTRlNmFiMDhmZmUxYWM2NzFhYTkwIn0=
```

### Option 2: Use BuildKit Secrets (More Secure)
Update Dockerfile to use BuildKit secrets for sensitive data.

### Option 3: Hardcode Values (Quick Fix)
Temporarily hardcode values in vite.config.ts for testing.

## Current Status:
- ✅ Dockerfile expects ARG variables for build
- ❌ Coolify only provides ENV variables at runtime  
- ❌ VITE_CONVEX_URL not available during build
- ❌ Console shows "VITE_CONVEX_URL is not set"

## Next Steps:
1. Configure Coolify Build Arguments with VITE_ variables
2. Keep CONVEX_ variables as runtime environment variables
3. Redeploy application
4. Test Convex connection

## Verification:
After fix, console should show:
```
✅ Convex client initialized
✅ React app rendered successfully
```
Instead of:
```
⚠️ VITE_CONVEX_URL is not set. Convex features will not work.
```
