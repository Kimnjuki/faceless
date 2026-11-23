# Ahrefs Health Score Playbook — 37 → 90+

**Crawl source:** Ahrefs Site Audit exports, 2026-11-23  
**Inputs analyzed:** `issues_overview_report.csv`, `internal_all.csv` (95 URLs), pages exports, dashboard layout JSON  
**Machine summary:** `docs/seo/ahrefs-crawl-analysis.json`  
**Target:** Health score **≥ 90** and materially denser internal linking among indexable money pages.

---

## Executive verdict

Health is low because Ahrefs is scoring a crawl that still has:

1. **19 internal 404s** (~19% of internal URLs) — almost all `/niches/{opaque-id}`
2. **10 noindex stubs** that still get **~77 sitewide inlinks** (footer/mega-menu) — wasted equity + High “Directives: Noindex”
3. **Thin HTML bodies** on hubs/tools/legal (30–100 words in raw HTML) + many blog posts still under ~200 crawlable words
4. **Titles truncated by pixel width** on ~21 pages
5. **Security headers missing** (HSTS / Referrer-Policy / X-Content-Type-Options)
6. **Blog posts underlinked** (~2–7 unique inlinks typical) while thin/noindex URLs are overlinked

Fix order below is scored for **health-score impact first**, then **link-equity**, then polish.

**Re-crawl rule:** After each phase, re-run Ahrefs with **JavaScript rendering ON** and Chrome UA. Your pages export shows `Is rendered page = false` for sampled URLs — HTML-only crawls under-count SPA content and inflate “Low Content.”

---

## Score model (how to get to 90)

Ahrefs Health weights **Issues** far more than Opportunities. Approximate contribution of this crawl:

| Bucket | Current | Effect on score | Path to 90 |
|--------|---------|-----------------|------------|
| High Issues (4xx) | 19 URLs | Dominant drag | Drive to **0** |
| High Warnings (noindex) | 10 URLs | Large drag if unexpected | Either **stop linking** or **make indexable** |
| Medium (thin + long titles) | ~40 URL-hits | Moderate | Cut thin indexables; shorten titles |
| Low (H2 dupes, readability, security) | many | Small each, additive | Headers + template H2 cleanup |
| Internal redirects / www | 1 | Small | 1-hop apex |

**Do not chase readability (41 URLs) or duplicate H2 (45) first.** They will not move 37→90 alone.

---

## Phase 0 — Crawl hygiene (same day)

1. Ahrefs project → **Enable JS rendering**.
2. Exclude from crawl (or robots) if linked by mistake:
   - `/assets/*`, hashed JS/CSS
   - `/og-image.png` as a “page”
3. Confirm start URL is `https://contentanonymity.com/` (apex), not `www`.
4. After deploy of Phase 1–2, force Coolify rebuild, then re-audit.

**Done when:** Crawl no longer treats static assets as indexable HTML pages; JS render ON.

---

## Phase 1 — Kill all internal 4xx (highest ROI)

### Finding

All **19** client errors are niche detail URLs like:

- `/niches/f1f14ad2-49ba-490a-bebc-10492cbe0e52` (UUID)
- `/niches/m97dfww2ac1a206kmkdxrdrqhd837f18` (Convex-like id)

Root cause in code:

- `src/pages/resources/NicheDatabase.tsx` links `to={/niches/${niche.id}}`
- Comment in `useNiches.ts` already says public links must use **slugs**, not IDs
- `NicheDetail` resolves slug via fallback OR `getById` — IDs that are not valid / deleted → soft UI “not found” but nginx may still 404 for prerender-missing paths, or SPA returns non-indexable not-found that Ahrefs records as 404 depending on host config

### Fix checklist

| # | Action | Owner | Files / systems |
|---|--------|-------|-----------------|
| 1.1 | Link **only** `/niches/{slug}` from Niche Database, hubs, related modules | Eng | `NicheDatabase.tsx`, any `Link to={`/niches/${...}`}` |
| 1.2 | Ensure list data exposes `slug` (bundle + Convex); never put `_id` in `href` | Eng | `useNiches.ts`, Convex `niches` |
| 1.3 | For every historical ID URL: **301 → slug** (or 301 → `/resources/niches` if unknown) | Eng | `nginx-redirects.conf` / `redirects.config.json` / `docs/seo/redirect-map.csv` |
| 1.4 | Prerender `/niches/{slug}` for all canonical niches so Googlebot gets 200 HTML | Eng | `scripts/prerender-routes.mjs` + sitemap |
| 1.5 | Add `seo:check` / link-audit rule: fail build if any crawlable `href` matches `/niches/[uuid]` or raw Convex id pattern | Eng | `scripts/link-audit.mjs` |

**Done when:** Ahrefs “Internal Client Error (4xx)” = **0**. Expected health jump: large (often +20–35 pts depending on weighting).

---

## Phase 2 — Stop pouring PageRank into noindex stubs

### Finding

These are `noindex` (intentional thin placeholders) but still receive **~77 inlinks** each from global chrome:

- `/products/all`
- `/news`
- `/learning-paths`
- `/learning/resources`
- `/learning/workshops`
- `/resources/templates`
- `/tools/backlink-checker`, `/tools/seo-audit`, `/tools/keyword-research`, `/tools/performance`

Sources: `Footer.tsx`, `MegaMenu.tsx`, `ExploreSection.tsx`, `ToolsShowcase.tsx`, `DashboardLayout.tsx`.

Ahrefs flags **Directives: Noindex (High, 10 URLs)** because they are discoverable and heavily linked.

### Decision tree (pick per URL)

**A — Keep noindex (stub):** Remove from Header/Footer/MegaMenu/Explore; link only from a “Labs” page that is itself noindex, or from logged-in dashboard only.

**B — Make indexable:** Ship ≥400–800 words of unique useful content + unique title/H1/meta + H2 sections + 5–10 contextual outlinks to pillars; remove noindex; add to sitemap.

**Recommended defaults**

| URL | Recommendation |
|-----|----------------|
| `/learning-paths` | **B** — real hub listing paths with crawlable links |
| `/resources/templates` | **B** — template index with descriptions |
| `/news` | **A** until editorial cadence exists, or **B** with last 10 posts |
| `/products/all` | **A** or redirect → `/tools/all` / starter kit |
| `/learning/workshops`, `/learning/resources` | **A** or merge into learning hub |
| Thin tool stubs (`seo-audit`, etc.) | **B** if tool works; else **A** and unlink |

### Fix checklist

| # | Action |
|---|--------|
| 2.1 | Audit Footer + MegaMenu + Explore: replace stub hrefs with indexable hubs (`/blog`, `/platform-guides`, `/faceless-content`, `/tools/all`, `/resources/niches`, `/getting-started`) |
| 2.2 | Cap any remaining stub to ≤1 discovery link sitewide |
| 2.3 | Re-run Ahrefs: Noindex warning should shrink or become “expected” only on auth/dashboard |

**Done when:** No noindex URL has >5 unique inlinks from public templates. Health: High noindex warning mitigated.

---

## Phase 3 — Internal linking program (raise equity + crawl depth)

### Current pattern (from crawl)

| Surface | Unique inlinks (approx) | Unique outlinks | Problem |
|---------|-------------------------|-----------------|---------|
| Home / hubs | ~72 | 20–60 | OK discovery, thin text |
| Blog posts | often **2–7** | ~27–28 | Underlinked; outlinks exist but inlinks don’t |
| Noindex stubs | **~77** | — | Wrong winners |
| Depth 3 | 69 URLs | — | Too many pages only reachable deep |

### Target KPIs

- Every **indexable** URL: **≥5 unique internal inlinks** from distinct templates/pages
- Every blog post: linked from (1) `/blog` hub, (2) ≥1 topic hub, (3) ≥2 related posts, (4) ≥1 contextual mention from a pillar
- Homepage unique outlinks: **25–40** crawlable `<a href>` to indexable URLs only
- Max crawl depth for money pages: **≤2** from home

### Implementation blueprint

1. **Global nav (indexable only)**  
   Keep ~7–9 links: Getting Started, Blog, Platform Guides, Faceless Content, YouTube hub, Monetization hub, Tools, Niches, Case Studies.  
   Remove Products/News/Templates/Learning-paths until Phase 2B.

2. **Footer clusters (not duplicate mega-menu)**  
   Three columns of **indexable** destinations only:
   - Learn: getting-started, blog, platform-guides, case-studies  
   - Faceless: /faceless-content, youtube, monetization  
   - Tools: /tools/all, calculator, niche-quiz, niches  

3. **Hub pages must list children as `<Link>` / `<a href>`** (already partly done)  
   Expand prerender + React lists so each hub emits **all** child URLs (paginated hubs still need page-1 full list or sitemap + HTML index).

4. **Article ↔ article**  
   Enforce `relatedPathsFor()` (seo-clusters) in prerender **and** `ArticleDetail` UI (min 4 related).  
   Add “Start here” strip on each cluster hub linking the canonical 2026 guides.

5. **Niche database**  
   From `/resources/niches`, link top 20 niches by slug; from each niche, link 3 related niches + 2 blog guides in-category.

6. **Breadcrumbs** on all inner pages (schema + visible) — already partial; finish tools/legal/guides.

7. **CI guard**  
   `npm run seo:links` fails if any sitemap URL has `< 3` inbound links from prerendered HTML corpus.

**Done when:** Median blog unique inlinks ≥8; zero indexable orphans; depth-3 share drops.

---

## Phase 4 — Content thickness (Low Content + E-E-A-T)

### Finding

Ahrefs “Low Content Pages” = **19** (word count &lt; 200 on configured content area). Crawl HTML shows many hubs at 30–100 words because:

- Prerender shell is thin, and/or
- Crawl ran **without** JS render
- Convex article bodies still truncated (~78–150 words) for some guides

### Fix checklist

| # | Action |
|---|--------|
| 4.1 | Restore full article HTML in Convex for thin posts (human CMS) — prerender cannot invent body |
| 4.2 | Expand prerender `STATIC_PAGE_META` bodies: each hub gets 150–250 words of unique intro + full child link list + FAQ block |
| 4.3 | Tools pages: 200+ words explaining inputs/outputs/assumptions + links to related guides |
| 4.4 | Legal pages: keep concise but add clear H2 structure (Privacy / Terms already indexable) |
| 4.5 | Platform guides: ensure full content in Convex + prerender markdown/HTML path |
| 4.6 | Re-crawl with JS ON; re-measure Low Content |

**Target:** Indexable HTML word count ≥300 for hubs, ≥800 for guides/posts (visible main content).

---

## Phase 5 — Titles, meta, headings

| Issue | Count | Fix |
|-------|-------|-----|
| Titles over 561px | 21 | Enforce `brandTitle()` ≤ ~55–60 chars **and** pixel-safe (avoid long `&quot;` phrases); prefer keyword-front titles |
| Titles below 30 chars | 2 | Lengthen with primary intent + brand |
| Meta desc &lt; 70 or &gt; 155 | 4+3 | Normalize 120–155 chars in prerender + SEO.tsx |
| H1 over 70 chars | 13 | Shorten H1; keep long form in lead paragraph |
| H2 duplicate (sitewide) | 45 | Find shared component H2 (nav/sections); rename to unique section titles or demote chrome to `<p>`/`<span>` |
| H2 missing | 15 | Add 2–4 descriptive H2s on hubs/tools |
| Title same as H1 | 1 | Differentiate title (SERP) vs H1 (on-page) |

**Done when:** Medium title/pixel opportunities &lt; 5 URLs; duplicate H2 no longer on every template.

---

## Phase 6 — Security & host headers (easy Low warnings)

Add to nginx (Coolify) on all HTML responses:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Also:

- Collapse `http://www` → `https://contentanonymity.com` to **one hop**
- Never link internally to `www.` or to redirecting URLs

**Done when:** Ahrefs security header warnings = 0; redirect hops = 1.

---

## Phase 7 — Indexation & sitemap alignment

1. Sitemap = indexable 200s only (already ~68); never list noindex/stubs/404s.
2. After niche slug fix, add all `/niches/{slug}` that are indexable.
3. `seo:check` already blocks noindex∩sitemap — keep in Coolify `build:seo`.
4. GSC: request indexing for fixed niche slugs + top hubs after deploy.

---

## Phase 8 — Measurement cadence

| When | Action | Pass criteria |
|------|--------|---------------|
| After Phase 1 deploy | Ahrefs re-crawl (JS ON) | 4xx = 0 |
| After Phase 2–3 | Re-crawl | Health ≥ 70; noindex stubs ≤5 inlinks |
| After Phase 4–6 | Re-crawl | Health ≥ 90; Low Content &lt; 5 indexable URLs |
| Weekly | `npm run build:seo && npm run seo:links` | CI green |
| Biweekly | Spot-check 10 random blog inlink counts | ≥5 unique inlinks |

Export and archive: Issues overview + Internal all + Pages — drop into `docs/seo/crawls/YYYY-MM-DD/`.

---

## Workstream map (owners)

| Stream | Moves score | Moves links | Depends on |
|--------|-------------|-------------|------------|
| Niche slug URLs + 301s | Critical | High | Code + nginx |
| Unlink / fill stubs | High | High | Nav/footer |
| Hub & article interlinking | Medium | Critical | Clusters + prerender |
| CMS full bodies | Medium | Low | Human editorial |
| Title/meta/H2 cleanup | Medium | Low | Prerender + components |
| Security headers + www | Low | None | Coolify/Cloudflare |
| JS-rendered re-audit | Validates all | Validates all | Ahrefs config |

---

## Explicit non-goals (for now)

- Chasing Flesch “Readability Difficult” across 41 URLs before 4xx/noindex/linking are fixed
- Merging YouTube cluster URLs without approval (`docs/seo/cluster-decisions.md`)
- Fabricating author bios (T5.2 remains human)

---

## Quick-start engineering order (this week)

1. Fix `NicheDatabase` (+ all niche links) to **slug**; add redirects for ID URLs; prerender niche slugs.  
2. Strip Footer/MegaMenu/Explore links to noindex stubs; point to real hubs.  
3. Nginx security headers + www single hop.  
4. Enrich hub prerender copy; restore thin Convex articles.  
5. Related-posts block + hub child lists; raise blog inlinks.  
6. Title pixel clamp + shared H2 dedupe.  
7. Ahrefs re-crawl JS ON → confirm Health ≥ 90.

---

## Appendix — Issue → fix crosswalk (this crawl)

| Ahrefs issue | Priority | URLs | Playbook phase |
|--------------|----------|------|----------------|
| Internal Client Error (4xx) | High | 19 | Phase 1 |
| Directives: Noindex | High | 10 | Phase 2 |
| Page Titles: Over 561 Pixels | Medium | 21 | Phase 5 |
| Content: Low Content Pages | Medium | 19 | Phase 4 |
| Page Titles: Below 30 Characters | Medium | 2 | Phase 5 |
| H2: Duplicate | Low | 45 | Phase 5 |
| Content: Readability Difficult | Low | 41 | Defer |
| H2: Missing | Low | 15 | Phase 5 |
| H1: Over 70 Characters | Low | 13 | Phase 5 |
| Security: Missing HSTS / Referrer / XCTO | Low | 3 each | Phase 6 |
| Meta description length | Low | few | Phase 5 |
| External 4xx | Low | 1 | Fix or remove outbound |
| Internal redirection (www) | Low | 1 | Phase 6 |
