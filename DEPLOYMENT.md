# Faceless Solopreneur Hub (FSH) - Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)
**Best for:** Zero-config React deployments with automatic HTTPS

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow prompts:**
   - Link to your GitHub repo
   - Vercel auto-detects Vite settings
   - Deploy completes in ~2 minutes

**Or use Vercel Dashboard:**
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Connect your GitHub: `https://github.com/Sugow-dot/faceless.git`
- Click "Deploy" (no configuration needed!)

---

### Option 2: Netlify
**Best for:** Simple drag-and-drop or Git-based deployments

1. **Build your project:**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

**Or use Netlify Dashboard:**
- Go to [netlify.com](https://netlify.com)
- Click "Add new site" → "Import from Git"
- Connect GitHub and select your repo
- Build settings are auto-detected

---

## 📋 Environment Variables

Create a `.env` file for your Supabase credentials:

```env
VITE_SUPABASE_URL=https://fvvpfueoaacijowkpdsf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Add to Vercel:**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

**Add to Netlify:**
- Dashboard → Site Settings → Environment Variables
- Add each variable

---

## 🔧 Build Configuration

### Vercel (vercel.json) - Auto-detected
No configuration needed! Vercel detects Vite automatically.

### Netlify (netlify.toml) - Auto-detected
No configuration needed! Netlify detects Vite automatically.

---

## 🗄️ Database Setup (Supabase)

### Required Tables:

**1. leads table:**
```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table leads enable row level security;

create policy "Anyone can insert leads"
  on leads for insert
  with check (true);
```

**2. users table:**
```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  niche text,
  goal text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table users enable row level security;

create policy "Users can read own data"
  on users for select
  using (auth.uid() = id);

create policy "Anyone can insert users"
  on users for insert
  with check (true);
```

---

## 🌐 Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `facelesshub.com`)
3. Update DNS records as shown
4. SSL certificate auto-generated

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records
4. SSL certificate auto-generated

---

## 🔍 SEO Configuration

Add to `index.html` (already in your project):
```html
<meta name="description" content="Build profitable faceless content businesses with AI automation">
<meta property="og:title" content="Faceless Solopreneur Hub">
<meta property="og:description" content="The definitive platform for anonymous digital entrepreneurship">
<meta property="og:image" content="/og-image.jpg">
```

---

## 📊 Analytics Setup

### Google Analytics:
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## ⚡ Performance Optimization

Your app is already optimized with:
- ✅ Code splitting (React Router)
- ✅ Lazy loading images
- ✅ Minified production build
- ✅ Tree shaking (Vite)

**Additional optimizations:**
- Add image compression
- Enable CDN (automatic on Vercel/Netlify)
- Use Cloudflare for additional caching

---

## 🐛 Troubleshooting

### Build fails:
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routes not working (404):
Both Vercel and Netlify handle SPA routing automatically.

### Environment variables not working:
- Ensure variables start with `VITE_`
- Restart dev server after adding variables
- Redeploy after adding to hosting platform

---

## 📱 Testing Before Deploy

```bash
# Build locally
npm run build

# Preview production build
npm run preview
```

---

## 🎯 Post-Deployment Checklist

- [ ] Test all routes work
- [ ] Verify email capture saves to Supabase
- [ ] Check mobile responsiveness
- [ ] Test signup/login flows
- [ ] Verify exit intent modal works
- [ ] Test calculator and quiz tools
- [ ] Check all links in navigation
- [ ] Verify custom domain (if added)
- [ ] Set up analytics tracking
- [ ] Test checkout flow

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** (already in .gitignore)
2. **Use environment variables** for API keys
3. **Enable RLS** on Supabase tables (shown above)
4. **Use HTTPS only** (automatic on Vercel/Netlify)

---

## 📞 Support Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)

---

**Need help?** Let me know if you encounter any issues during deployment!
