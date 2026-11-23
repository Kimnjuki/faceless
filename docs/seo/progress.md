# SEO Overhaul Progress

**Site:** https://contentanonymity.com  
**Branch:** `seo/overhaul`  
**Started:** 2026-11-23  

## Phase status

| Phase | Name | Status |
|-------|------|--------|
| P0 | Discovery and baseline | Done |
| P1 | Unique crawlable HTML | Done (T1.1–T1.3) |
| P2 | Internal linking | Done (T2.1–T2.5; breadcrumbs in prerender + SPA) |
| P3 | Indexation hygiene | Done (thin noindex; auth noindex; host hop = human) |
| P4 | Content consolidate | Blocked on human approval (`cluster-decisions.md`) |
| P5 | Structured data / E-E-A-T | Partial (T5.1 BlogPosting + BreadcrumbList; T5.2 authors = human) |
| P6 | Monetization / privacy | Partial (T6.1 AdSense scoped; T6.2–6.3 = human/legal) |
| P7 | Performance | Partial (AdSense off critical path; LH re-measure after deploy) |
| P8 | Measurement / CI | Partial (T8.2 seo:check/links done; GSC/Bing/Ahrefs = human) |

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

### Coolify gap fix (2026-11-23)

- Live Coolify was on `main` `44da266` with `Dockerfile` → `build:quick` only; rebuild skipped via SHA cache.
- Dockerfile now runs `build:seo` (vite + Convex prerender, no Chromium). See `docs/seo/coolify-deploy.md`.

### T2.3–T2.5 / T3 / T8.2 (2026-11-23)

- Topic clusters in `src/config/seoClusters.ts` + prerender related links + outbound platform docs.
- Thin routes: `noindex,follow` in prerender; removed from sitemap (68 indexable URLs).
- `npm run seo:check` + `npm run seo:links` (0 broken; orphans reduced vs audit 61).

### T2.1 — Rebuild global navigation and footer (2026-11-23)

- Header: ~7 crawlable links (Getting Started, Blog, Platform Guides, Faceless Content dropdown, Tools, Case Studies); logo → `/`.
- Footer brand year + linked brand name; legal/hub links already present; no sitemap.xml anchor.

### T2.2 — Hub pages list children as crawlable links (2026-11-23)

- Prerender already emits full hub `<a href>` lists (T1.1).
- BlogIndex + PlatformGuides cards converted from `onClick`/`navigate` to real `<Link href>`.

### T1.2 — Per-route head hygiene (2026-11-23)

- Removed redundant `meta name="title"`, keywords, revisit-after from shell/SEO path.
- `SEO.tsx`: brand-safe title truncation; robots contract; `og:url`/`twitter:url` = canonical.
- Duplicate title/description CI fail deferred to T8.2 `seo-check.mjs`.

### T1.3 — Real HTTP 404 (2026-11-23)

- nginx: public `try_files` no longer falls back to `/index.html`; SPA fallback limited to `/auth/`, `/dashboard/`, `/creator-studio`, `/checkout`.
- Build emits `dist/404.html` with `noindex,follow` + hub links.
- vercel.json: removed blanket SPA rewrite for all paths.
- **Note:** Live 404 status requires deploy of nginx.conf; local dist verification via `404.html` presence.

### T5.1 / HTML body fix (2026-11-23)

- Prerender: `looksLikeHtml` + entity decode; hydrate short bodies via `articles.getBySlug`.
- Inject `BreadcrumbList` + `BlogPosting` JSON-LD on article routes.
- `seo:check` asserts BlogPosting/BreadcrumbList on `/blog/*` and forbids AdSense script in dist HTML.

### T4.1 — Cluster decisions (2026-11-23)

- Drafted `docs/seo/cluster-decisions.md`. **No merges applied** — awaiting human approval for YouTube (4–5) and monetize (2) redirects.

### T6.1 — AdSense scoping (2026-11-23)

- Removed global AdSense from `index.html`.
- Allowlist in `src/config/adsAllowed.ts`; `AdSense.tsx` loads script on-demand only on allowed routes.
- Prerender strips any residual adsbygoogle script from shell.

## Build / seo:check after each phase

| After | `npm run build` | `npm run seo:check` | Notes |
|-------|-----------------|---------------------|-------|
| P0 | — | — (script not yet) | Discovery + baseline only |
| P1 T1.1–T1.3 | `npm run build:seo` | — (script in T8.2) | Prerender + head + 404.html |
| T5.1 / T6.1 | `npm run build:seo` | required | JSON-LD + no AdSense in HTML |
