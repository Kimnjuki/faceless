# Stack Report — ContentAnonymity SEO Overhaul

**Date:** 2026-11-23  
**Branch:** `seo/overhaul`  
**Task:** T0.1  

## Summary

Vite + React SPA (confirmed). Content lives primarily in **Convex**; build already includes a **react-snap + inject-route-seo** prerender path, but production still serves a client shell that crawlers without JS treat as duplicate homepage HTML (F01). **Do not switch frameworks** unless prerender + hub SSR HTML cannot meet acceptance criteria — preferred path is harden existing Vite prerender.

## Framework & tooling

| Layer | Choice |
|--------|--------|
| Build | Vite 5 (`vite.config.ts`), `outDir: dist` |
| UI | React 18, TypeScript, Tailwind |
| Router | `react-router-dom` v6 — `BrowserRouter` + `<Routes>` in `src/App.tsx` |
| Head / meta | `react-helmet-async` via `src/components/SEO.tsx`, `Breadcrumb.tsx` |
| Auth | Auth0 (`@auth0/auth0-react`) for `/auth/*`, `/dashboard/*` |
| Backend / CMS | **Convex** (`convex/`, `VITE_CONVEX_URL`) — articles, platform guides, niches, HTTP sitemap feed |
| Analytics | GA4 + Clarity (consent-gated); Ahrefs/ForeMedia hints in HTML |
| Ads | Google AdSense `ca-pub-9278124025449370` loaded globally from `index.html` |

## Where pages / posts / metadata live

| Content | Source |
|---------|--------|
| Blog articles | Convex `articles` table; queries in `convex/articles.ts`; UI `BlogIndex`, `ArticleDetail` |
| Platform guides | Convex + seeds (`convex/seedPlatformGuides.ts`); UI `PlatformGuides`, `PlatformGuideDetail` |
| Niches | Convex + local fallbacks (`src/config/niches/*`) |
| Case studies | Local markdown/config (`src/config/caseStudies/*`) |
| Static marketing / tools / legal | React page components under `src/pages/**` |
| Per-route SEO at build | `scripts/inject-route-seo.mjs` rewrites `dist/<route>/index.html` from sitemap + embedded meta; `react-snap` in `package.json` `reactSnap.include` |

No MDX content collection. Metadata is a mix of Helmet props in page components and build-time inject from sitemap/shell.

## Sitemap

- Generator: `scripts/generate-sitemap.js` → `public/sitemap.xml`
- Static route list + dynamic articles/guides/products/paths from Convex HTTP (`convex/http.ts`) when `CONVEX_SITE_URL` / Convex URL is available
- Referenced in `public/robots.txt` as `Sitemap: https://contentanonymity.com/sitemap.xml`
- Also linked via `<link rel="sitemap">` in `index.html`; noscript block still has `<a href="/sitemap.xml">` (equity leak candidate for T2.1)

## Hosting & deploy

| Mechanism | Role |
|-----------|------|
| **Primary (live pattern)** | Docker multi-stage (`Dockerfile`): Node build → `npm run build:prerender` → **nginx:alpine** serving `dist` |
| Orchestration | Coolify (comments in `nginx.conf` / Dockerfile); Chromium installed for react-snap |
| Nginx | `nginx.conf`: www→apex 301, `try_files $uri $uri/ /index.html`, `include redirects.inc`, custom `error_page 404` |
| Path redirects | `nginx-redirects.conf` generated from `redirects.config.json` via `scripts/populate-redirects.mjs` |
| Secondary / legacy | `vercel.json` SPA rewrite `/* → /index.html`; `public/.htaccess` www/HTTPS rules |
| Edge | Cloudflare (documented canonical-host pitfalls in `nginx.conf`) |

**Canonical origin:** `https://contentanonymity.com` (no www, no trailing slash except `/`).

## Redirect mechanism (where to put 301s)

1. **Preferred for Coolify/Docker:** add rows to redirect map → generate into `nginx-redirects.conf` / `redirects.config.json`.
2. Vercel: `vercel.json` `redirects` (only if that host is used).
3. Document every URL change in `docs/seo/redirect-map.csv` (`old_path,new_path,status,reason`) — never delete a published URL without a 301 mapping.

## Prerender / crawlability status (baseline for P1)

| Piece | Status |
|-------|--------|
| `build:prerender` | Vite build → `inject:seo` → `prepare:react-snap` → `react-snap` |
| `build:seo` | Vite + inject + `verify-prerender` (no full snap) |
| Live crawl (audit 2026-11-23) | Identical titles; hubs lack child `<a href>` in raw HTML; soft-SPA behaviour still likely for unknown routes via `try_files … /index.html` |
| Logo → `/` | Already real `<Link to="/">` in `Header.tsx` / `Footer.tsx` |
| Footer → sitemap.xml | Not in Footer component; still in `index.html` noscript |

## Decision for P1 (T1.1)

**Keep Vite + React.** Implemented `scripts/prerender-routes.mjs` (ConvexHttpClient) so every sitemap URL emits `dist/<path>/index.html` with unique head **and** semantic body/hub link lists inside `#root`. Client replaces the static shell on boot (`data-prerender-static`). Framework migration deferred unless acceptance fails after deploy.

## Related existing docs / scripts

- `docs/SEO_AUDIT_2026_*.md` — prior remediation notes
- `scripts/verify-prerender.mjs`, `scripts/spotcheck-seo.mjs`, `scripts/check-sitemap-hygiene.mjs`
- Planned (plan deliverables): `scripts/seo-check.mjs`, `scripts/link-audit.mjs`
