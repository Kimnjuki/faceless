# SEO Overhaul Progress

**Site:** https://contentanonymity.com  
**Branch:** `seo/overhaul`  
**Started:** 2026-11-23  

## Phase status

| Phase | Name | Status |
|-------|------|--------|
| P0 | Discovery and baseline | Done |
| P1 | Unique crawlable HTML | Done (T1.1–T1.3) |
| P2 | Internal linking | Pending |
| P3 | Indexation hygiene | Pending |
| P4 | Content consolidate | Pending |
| P5 | Structured data / E-E-A-T | Pending |
| P6 | Monetization / privacy | Pending |
| P7 | Performance | Pending |
| P8 | Measurement / CI | Pending |

## Task log

### T0.1 — Detect stack and hosting (2026-11-23)

- **Done.** Wrote `docs/seo/stack-report.md`.
- Stack: Vite 5 + React 18 SPA, react-router-dom v6, react-helmet-async, Convex content, Coolify/Docker/nginx primary host; vercel.json secondary.
- Sitemap: `scripts/generate-sitemap.js` + Convex HTTP.
- Redirects: `nginx-redirects.conf` / `redirects.config.json`.
- Decision: keep Vite; harden prerender (no framework switch yet).
- **Build / seo:check:** N/A for discovery-only task (no code change to app).

### T0.2 — Capture baseline (2026-11-23)

- **Done.** Saved `docs/seo/baseline-before.txt` and `docs/seo/lighthouse-before/{home,blog-post,calculator}.json`.
- Live Googlebot curl: 6/6 URLs share title `Privacy-First Faceless Content Platform | ContentAnonymity`; `og:url` = homepage; no route-specific H1 (noscript shows homepage H1).
- Soft-404: `/this-does-not-exist-xyz` → **HTTP 200**.
- Host chain: `http://www` → `https://www` → `https://contentanonymity.com/` = **2 hops** (target: 1).
- Lighthouse mobile: LCP home ~10s, blog ~8.9s, calculator ~4.5s; CLS 0 (category scores empty in LH 12.8.2 JSON — raw audits retained).
- **Build / seo:check:** N/A (baseline capture only).

### T1.1 — Pre-render / SSG all routes (2026-11-23)

- **Done.** Added `scripts/prerender-routes.mjs` (ConvexHttpClient → articles/guides/niches).
- Writes `dist/<route>/index.html` with unique head + semantic `#root` body (hub link lists, article HTML, breadcrumbs).
- `main.tsx`: static `data-prerender-static` shells are cleared then client-rendered (no hydrate mismatch).
- `build:seo` / `build:prerender` now call `prerender:routes` instead of meta-only inject.
- Removed XML Sitemap anchor from `index.html` noscript.
- **Verify:** `npm run build:seo` → 81/81 self-canonical; blog hub has crawlable `/blog/...` links; sample article has own title/H1/article body (not homepage H1).

### T1.2 — Per-route head hygiene (2026-11-23)

- Removed redundant `meta name="title"`, keywords, revisit-after from shell/SEO path.
- `SEO.tsx`: brand-safe title truncation; robots contract; `og:url`/`twitter:url` = canonical.
- Duplicate title/description CI fail deferred to T8.2 `seo-check.mjs`.

### T1.3 — Real HTTP 404 (2026-11-23)

- nginx: public `try_files` no longer falls back to `/index.html`; SPA fallback limited to `/auth/`, `/dashboard/`, `/creator-studio`, `/checkout`.
- Build emits `dist/404.html` with `noindex,follow` + hub links.
- vercel.json: removed blanket SPA rewrite for all paths.
- **Note:** Live 404 status requires deploy of nginx.conf; local dist verification via `404.html` presence.

## Build / seo:check after each phase

| After | `npm run build` | `npm run seo:check` | Notes |
|-------|-----------------|---------------------|-------|
| P0 | — | — (script not yet) | Discovery + baseline only |
| P1 T1.1–T1.3 | `npm run build:seo` | — (script in T8.2) | Prerender + head + 404.html |
