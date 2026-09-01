# SEO Audit 2026-09-01 — Remediation Tracking

> Source report mapping for the contentanonymity.com site audit. Each issue lists the code
> change (already merged in this repo) and the **manual / GSC-dependent action** that remains
> so an operator can complete it without code changes.

## Root cause

No canonical host redirect between `contentanonymity.com` and `www.contentanonymity.com`.
Search engines saw every page twice (`/blog` vs `www./blog`), which cascaded into the
non-canonical sitemap flag, orphan-canonical flag, and the indexing collapse (2–5 indexed).

## P0 — Critical (code now enforces single canonical host)

| ID | Title | Code status | Manual action left |
|----|-------|-------------|---------------------|
| P0-01 | Duplicate host serving | ✅ `vercel.json` host redirect (deploy A); `nginx.conf` www→non-www 301 single-hop block (deploy B / Coolify Docker). | Verify after deploy: `curl -I https://www.contentanonymity.com/blog` → 301/308 `Location: https://contentanonymity.com/blog`. |
| P0-02 | Self-referential canonical tags | ✅ `src/components/SEO.tsx` strips `www.` from every canonical/og/twitter URL; `index.html` pre-JS injection sets per-route non-www canonical. | Spot check ~10 live pages in view-source that canonical href is `https://contentanonymity.com/...` (no `www`). |
| P0-03 | Sitemap emitting duplicate/non-canonical URLs | ✅ `scripts/generate-sitemap.js` + `convex/http.ts` filter/dedupe/normalize; generator hard-fails on any `www.` or duplicate `<loc>`. | Re-run `npm run generate-sitemap`, `git add public/sitemap.xml`, commit, redeploy, resubmit in GSC. |

## P1 — High

| ID | Title | Code status | Manual action left |
|----|-------|-------------|---------------------|
| P1-01 | 14× 404 pages | ⚠️ Scaffolding in place: `redirects.config.json` (registry) + `scripts/populate-redirects.mjs` (writes `vercel.json` + `nginx-redirects.conf`). Learning-path hash URLs excluded from sitemap (`convex/http.ts`, `generate-sitemap.js`); `learning_paths.slug` schema + `getBySlug` query + `useLearningPath` slug fallback added so future URLs are stable. | Export the 14 URLs from GSC (Indexing → Pages → "Not found (404)"), classify each (moved → 301 / removed → drop or 410), fill `redirects.config.json`, run the script, deploy, then GSC "Validate Fix". |
| P1-02 | 13× server error pages | ✅ Global `ErrorBoundary`; versioned not-found branches in ArticleDetail / PlatformGuideDetail / LearningPathDetail render `noindex` soft-404 instead of throwing. | Check host function logs (Vercel Coolify) for 5xx routes; verify each of the 13 returns 200 for Googlebot user-agent; monitor 7 days. |

## P2 — Medium

| ID | Title | Code status | Manual action left |
|----|-------|-------------|---------------------|
| P2-01 | Redirect chains | ✅ `nginx.conf` collapses `http(s)://www` → `https://contentanonymity.com` in one hop; `vercel.json` host rule is single-hop. | `curl -IL http://www.contentanonymity.com/` → exactly ONE 30x hop. |
| P2-02 | Orphan canonical URL | ✅ Internal links to canonical guides added earlier (commit 7fad020); re-surface check below. | Re-run Ahrefs audit post-deploy; confirm the flagged URL now has ≥2 incoming internal links (add contextual links from topically related posts if it still shows zero). |

## P3 — Low / process

| ID | Title | Code status | Manual action left |
|----|-------|-------------|---------------------|
| P3-01 | Crawled-not-indexed (5) | ✅ Soft-404 `noindex` hardening merged. | Review content depth; add 2–3 internal links from high-authority pages; after 2–3 weeks request indexing per URL in GSC URL Inspection. |
| P3-02 | Post-deploy indexing recovery | ✅ IndexNow notification script + `indexnow.txt` present. | Submit regenerated sitemap in GSC; "Validate Fix" per Coverage group; spot-check 10–15 URLs with Request Indexing; monitor Coverage weekly 4–6 weeks. |

## Global config

- `public/robots.txt` — Sitemap points at `https://contentanonymity.com/sitemap.xml` (non-www). ✅
- `public/sitemap.xml` — regenerated canonical-only (77 URLs, no `www`, no dupes, no hash learning paths). ✅

## Verification checklist (post-deploy)

```bash
# 1. Host canonicalization (P0-01)
curl -sI https://www.contentanonymity.com/blog | findstr /i "^HTTP location"
#   expect: HTTP/1.1 301/308  +  Location: https://contentanonymity.com/blog

# 2. Single-hop chain (P2-01)
curl -sIL http://www.contentanonymity.com/ | findstr /i "^HTTP location"

# 3. Sitemap cleanliness (P0-03)
node scripts/validate-sitemap.mjs
node -e "const x=require('fs').readFileSync('public/sitemap.xml','utf8');const l=[...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);console.log('www:',l.filter(u=>u.includes('www.')).length,'dupes:',l.length-new Set(l).size,'total:',l.length);"
```

## Decisions recorded

- **Canonical host: non-www** (`https://contentanonymity.com`) — matches the majority of pre-existing internal links, the sitemap, and `SITE_URL` in `src/lib/site-url.ts`, `scripts/generate-sitemap.js`, and `convex/http.ts`.
- **Learning-path slugs:** hash URLs (`/learning-paths/<32-char-doc-id>`) are excluded from the sitemap until a stable `slug` is persisted on each row (schema + `getBySlug` ready; seed the data next).