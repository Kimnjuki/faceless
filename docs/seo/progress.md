# SEO Overhaul Progress

**Site:** https://contentanonymity.com  
**Branch:** `seo/overhaul`  
**Started:** 2026-11-23  

## Phase status

| Phase | Name | Status |
|-------|------|--------|
| P0 | Discovery and baseline | In progress |
| P1 | Unique crawlable HTML | Pending |
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

### T0.2 — Capture baseline

- Pending.

## Build / seo:check after each phase

| After | `npm run build` | `npm run seo:check` | Notes |
|-------|-----------------|---------------------|-------|
| P0 | — | — (script not yet) | Discovery only |
