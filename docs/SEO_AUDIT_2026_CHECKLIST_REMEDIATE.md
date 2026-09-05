# ContentAnonymity SEO Remediation Checklist — Ahrefs / GSC (2026-09-05)

> **Source of truth:** `Critical issues.csv`, `Non-critical issues.csv`, `Chart.csv`,
> `Metadata.csv`, `contentanonymity_05-sep-2026_pages_2026-09-05_05-01-39.csv`
> (all in repo root, mirroring the Ahrefs export names).
>
> **Stack:** React + Vite (SPA, react-helmet-async + react-snap prerender) ·
> Cloudflare (edge) → Coolify Docker (nginx) and/or Vercel (static build) · Convex backend.
>
> **Verified live 2026-09-05 02:26 UTC:** `https://contentanonymity.com/` returns
> **301 → itself (redirect loop)**. Ahrefs flagged `Redirect loop — 3 crawled`; every other
> "0" in the audit is **unverified**, not clean. Fix order below is mandatory.

---

## STATUS SUMMARY (checklist)

- [x] **CRIT-001** — Redirect loop root cause identified & repo hardened *(Cloudflare rule removal = MANUAL)*
- [x] **CRIT-005/006/008/009/010** — Fixed in repo (canonical 301s, OG image, IndexNow key, sitemap)
- [x] **CRIT-002/003/004/007** — Scaffolded in repo; needs GSC export + deploy + re-crawl
- [ ] **DEPLOY + CLOUDFLARE RULE FIX** — the only thing that unblocks everything downstream
- [ ] **GSC RESUBMIT + VALIDATE** — after deploy

---

## STEP 1 → Pick one canonical URL & kill the loop (CRIT-001)

**Canonical host = `https://contentanonymity.com`** (non-www) — matches sitemap, `SITE_URL`,
robots.txt, and most internal links.

### AI-editor prompt (paste into Cursor / Replit / Bolt / v0)
> "The site is deployed behind Cloudflare in front of a Coolify Docker nginx container
> (and/or Vercel static). The homepage https://contentanonymity.com/ currently returns
> 301 to itself, causing a redirect loop. Fix it **at the server/hosting config level**:
> 1. In the Cloudflare dashboard, delete any Redirect Rule / Page Rule that matches
>    `contentanonymity.com` and redirects it to `https://contentanonymity.com/` (self-loop).
> 2. Ensure only ONE canonicalization rule exists: `https://www.contentanonymity.com/*`
>    → `301 https://contentanonymity.com/$1` (single hop, never chained).
> 3. Never redirect the canonical host; it must serve 200.
> 4. Do not implement redirects in client-side JavaScript."

### Repo-side config already correct (verified)
- `nginx.conf` — `www.contentanonymity.com` → 301 non-www; catch-all serves canonical host = 200.
- `vercel.json` — `host=www.contentanonymity.com` → 301 `https://contentanonymity.com/:path*`, `permanent: true`.
- `scripts/verify-canonical.mjs` — CI gate; **currently fails 0/4 while the edge loop is live.**

### Verify (do BEFORE touching anything else)
```bash
node scripts/verify-canonical.mjs
# EXPECT after fix: 4/4 variants converge to https://contentanonymity.com/ (terminal 200)
```
Manual equivalent:
```
curl -sI https://contentanonymity.com/   # must be 200 (currently 301→itself)
curl -sIL https://www.contentanonymity.com/   # exactly ONE 301, then 200
```

---

## STEP 2 → Homepage title & meta (CRIT-002)

Already fixed in repo; re-crawl will confirm after STEP 1.
- `index.html` static `<title>` = "Build a Faceless Content Empire in 2026 | ContentAnonymity" (48 chars) ✅
- `src/components/SEO.tsx` enforces ≤60-char title, ≤160-char desc with CTA, self-referencing canonical ✅
- Homepage canonical now emits `https://contentanonymity.com/` (trailing slash, matches sitemap) ✅

### AI-editor prompt
> "Add a unique, descriptive title (50-60 chars) and meta description (140-160 chars)
> directly in the HTML <head> of index.html and ensure react-helmet-async overrides per route
> in src/components/SEO.tsx. Keep the canonical self-referencing and non-www."

### Verify after deploy
```bash
curl -s https://contentanonymity.com/ | findstr /i "<title>"
```

---

## STEP 3 → Clean the sitemap (CRIT-010) ✅ DONE in repo

- Regenerated `public/sitemap.xml`: **72 canonical, non-www, de-duplicated URLs** (was 77+ incl. stale).
- Hash learning-path URLs excluded (`convex/http.ts` + `scripts/generate-sitemap.js`).
- `scripts/check-sitemap-hygiene.mjs` + `scripts/validate-sitemap.mjs` pass (exit 0).
- Lastmod refreshed to 2026-09-05.

### Verify / actions
```bash
npm run check:sitemap && node scripts/validate-sitemap.mjs
```
After deploy → **GSC > Sitemaps > resubmit https://contentanonymity.com/sitemap.xml**.

---

## STEP 4 → Fix / redirect 404s & 5xx (CRIT-003 / CRIT-004)

GSC exports required (manual, after STEP 1 so numbers are trustworthy):
- **14 × Not found (404)** and **13 × Server error (5xx)**.

### AI-editor prompt (populate the registry)
> "Open `redirects.config.json`. For each URL in the GSC exports, classify:
> (a) content moved → add {source, destination, permanent:true, reason}
> (b) permanently removed → do NOT add; ensure it's absent from sitemap and internal nav (optionally 410).
> Then run `node scripts/populate-redirects.mjs` (writes vercel.json + nginx-redirects.conf), redeploy, and Validate Fix in GSC."

### Already in repo
- `/terms-of-service` → `/terms` 301 (duplicate-canonical fix, CRIT-005) ✅
- `/index.html` → `/` 301 ✅
- `redirects.config.json` → `populate-redirects.mjs` writes single-hop 301s ✅
- `ErrorBoundary` (main.tsx) + versioned noindex soft-404 branches for Article/PlatformGuide/LearningPath ✅

### Verify per route
```bash
npm run check:routes          # every sitemap URL must 200 or single-hop 301
node scripts/audit-internal-links.mjs
```

---

## STEP 5 → Resolve duplicate-canonical conflicts (CRIT-005) ✅ in repo

- `SEO.tsx` always emits a self-referencing canonical + strips any `www.` host ✅
- `/terms-of-service` now 301s to canonical `/terms` ✅
- Homepage `og:url` / `twitter:url` / canonical all resolve to `https://contentanonymity.com/` ✅

### After deploy
Request indexing for the 2 flagged URLs via GSC URL Inspection.
---

## STEP 6 → Image issues (CRIT-008) ✅ in repo

The old `og-image.jpg` / `twitter-image.jpg` were **404** (files never existed).
- Generated `public/og-image.png` (1200×630 branded, pure-Node) via `npm run generate:og-image`.
- `index.html` + `SEO.tsx` references now point to `og-image.png`.
- PNG validated: correct signature, IHDR 1200×630, IDAT inflates to exact RGB size.

### Verify
```bash
curl -sI https://contentanonymity.com/og-image.png   # expect 200 image/png
```
Then re-test with Facebook Sharing Debugger / LinkedIn Post Inspector.

---

## STEP 7 → IndexNow (CRIT-009) ✅ in repo

- Added `public/contentanonymity-indexnow-2026-secure-random-key-abc123def456.txt`
  (spec-compliant `<key>.txt` location).
- `scripts/generate-sitemap.js` pings IndexNow after each regeneration.

### Verify after deploy
```bash
curl -sI https://contentanonymity.com/contentanonymity-indexnow-2026-secure-random-key-abc123def456.txt  # 200 text/plain
```

---

## STEP 8 → Non-critical / unverified items (Non-critical issues.csv)

All Ahrefs zeros are **unverified** until STEP 1 lands. After deploy, re-run the Ahrefs Site
Audit (24–48h) and use `node scripts/check-routes.mjs` + `node scripts/audit-internal-links.mjs`
to get real numbers for: broken links, orphan pages, alt text, JS errors, H1/meta coverage,
load speed. Then close out each row in `Non-critical issues.csv`.

---

## STEP 9 → Monitor recovery (GSC index chart)

- Watch **Indexed vs Not-indexed** daily for 2 weeks (was 2 indexed / 36 not-indexed; pre-collapse 17–19).
- Expect indexed pages to climb back toward pre-June-13 levels after STEP 1.
- `Chart.csv` baseline is embedded for tracking.

---

## FINAL VERIFICATION BUNDLE (run from repo root)

```bash
npm run build:quick                       # exit 0
npx tsc --noEmit --skipLibCheck           # exit 0
npm run check:sitemap                     # exit 0
node scripts/validate-sitemap.mjs         # exit 0
npm run generate:og-image                 # exit 0
node scripts/populate-redirects.mjs       # writes vercel.json + nginx-redirects.conf
node scripts/verify-canonical.mjs         # 4/4 OK ONLY after the Cloudflare rule fix
```