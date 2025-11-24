# Environment Variables Setup Guide

## 🔐 Local Development Setup

### Step 1: Create .env File

In your project root, create a `.env` file:

```bash
# Navigate to project root
cd /path/to/faceless

# Create .env file
touch .env
```

### Step 2: Add Your Supabase Credentials

Open `.env` in your editor and add:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://fvvpfueoaacijowkpdsf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dnBmdWVvYWFjaWpvd2twZHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzYwODIsImV4cCI6MjA3OTAxMjA4Mn0.4PMgaMn33jJ36tN7UISTBbsCKTczhAlquQTkqAq7ApI

# Optional: Analytics (Add later)
# VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Stripe (Add when ready for payments)
# VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

### Step 3: Verify .env is Ignored by Git

Check that `.env` is in your `.gitignore`:

```bash
# Check if .env is ignored
git status

# .env should NOT appear in the list
# If it does, add to .gitignore:
echo ".env" >> .gitignore
```

### Step 4: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Start again to load new environment variables
npm run dev
```

---

## 🚀 Production Setup (Vercel)

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste your URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your key when prompted

# Deploy
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

| Name | Value | Environments |
|------|-------|--------------|
| `VITE_SUPABASE_URL` | Your Supabase URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your anon key | Production, Preview, Development |

5. **Redeploy** your project for changes to take effect

---

## 🚀 Production Setup (Netlify)

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Add environment variables
netlify env:set VITE_SUPABASE_URL "your-url-here"
netlify env:set VITE_SUPABASE_ANON_KEY "your-key-here"

# Deploy
netlify deploy --prod
```

### Option 2: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add each variable:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. **Trigger a new deploy** from Deploys tab

---

## 🔄 Using Environment Variables in Code

### Current Implementation

Your app already uses environment variables correctly:

```typescript
// Example from components (already implemented)
const response = await fetch(
  'https://fvvpfueoaacijowkpdsf.supabase.co/rest/v1/leads',
  {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  }
);
```

### Recommended Update (For Better Security)

Create a config file to centralize environment variables:

**src/config/supabase.ts:**
```typescript
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://fvvpfueoaacijowkpdsf.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

Then use in components:
```typescript
import { supabaseConfig } from '@/config/supabase';

const response = await fetch(
  `${supabaseConfig.url}/rest/v1/leads`,
  {
    headers: {
      'apikey': supabaseConfig.anonKey
    }
  }
);
```

---

## 🧪 Testing Environment Variables

### Check if Variables are Loaded

Add this to any component temporarily:

```typescript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### Test in Browser

1. Open your app
2. Open DevTools Console (F12)
3. You should see your environment variables logged
4. **Remove console.logs before deploying!**

---

## 🔐 Security Best Practices

### ✅ DO:
- Use `VITE_` prefix for all frontend variables
- Keep `.env` in `.gitignore`
- Use different keys for development/production
- Store sensitive keys in hosting platform
- Rotate keys periodically

### ❌ DON'T:
- Commit `.env` to Git
- Share keys in public channels
- Use service_role key in frontend
- Hardcode credentials in components

---

## 📝 Environment Variable Reference

### Required Variables

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `VITE_SUPABASE_URL` | Supabase API endpoint | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Public API key | Supabase Dashboard → Settings → API |

### Optional Variables

| Variable | Purpose | When to Add |
|----------|---------|-------------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics tracking | When setting up analytics |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe payments | When adding real payments |
| `VITE_SENTRY_DSN` | Error tracking | For production monitoring |

---

## 🆘 Troubleshooting

### Issue: "import.meta.env.VITE_XXX is undefined"

**Solutions:**
1. Ensure variable name starts with `VITE_`
2. Restart dev server after adding variables
3. Check `.env` file is in project root
4. Verify no typos in variable names

### Issue: Variables work locally but not in production

**Solutions:**
1. Add variables to hosting platform (Vercel/Netlify)
2. Redeploy after adding variables
3. Check variable names match exactly
4. Verify variables are set for production environment

### Issue: "Failed to fetch" errors

**Solutions:**
1. Verify Supabase URL is correct
2. Check anon key is valid
3. Ensure RLS policies allow public access
4. Test Supabase connection in dashboard

---

## ✅ Verification Checklist

### Local Development:
- [ ] `.env` file created
- [ ] Supabase credentials added
- [ ] `.env` in `.gitignore`
- [ ] Dev server restarted
- [ ] Email capture works
- [ ] No console errors

### Production:
- [ ] Environment variables added to hosting platform
- [ ] Project redeployed
- [ ] Live site loads correctly
- [ ] Email capture works on live site
- [ ] Database receives data

---

## 🎯 Quick Reference

```bash
# Local setup
touch .env
# Add credentials to .env
npm run dev

# Vercel
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod

# Netlify
netlify env:set VITE_SUPABASE_URL "url"
netlify env:set VITE_SUPABASE_ANON_KEY "key"
netlify deploy --prod
```

---

**All set?** Your environment variables are now configured! Test the email capture forms to verify everything works.
