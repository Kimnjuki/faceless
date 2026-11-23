# Human TODO — ContentAnonymity SEO Overhaul

Items the agent cannot complete without human input, credentials, or legal/content authority. Marked `TODO(HUMAN)`.

## Verification & accounts

- [ ] TODO(HUMAN): Confirm Google Search Console Domain property for `contentanonymity.com`; submit sitemap; record Coverage/Pages counts (T8.1).
- [ ] TODO(HUMAN): Confirm Bing Webmaster Tools property; submit sitemap (T8.1).
- [ ] TODO(HUMAN): Re-run Ahrefs Site Audit with **Execute JavaScript ON** and OFF after deploy; attach new CSVs (T8.1).
- [ ] TODO(HUMAN): Enable JS rendering in Ahrefs project crawl settings (P2 from audit narrative).

## Content & editorial

- [ ] TODO(HUMAN): Approve drafted title/description rewrites after T1.2 (agent drafts; human approves).
- [ ] TODO(HUMAN): Approve cluster decisions in `docs/seo/cluster-decisions.md` — especially YouTube 2025→2026/hub redirects (4–5 URLs) and monetize pair merge (2 URLs). Do not apply >3 merges without reply.
- [ ] TODO(HUMAN): Restore full article bodies in Convex CMS — several posts (e.g. `faceless-youtube-channel-guide-2026`) store ~78 chars (`<h2>` only). Prerender cannot invent content.
- [ ] TODO(HUMAN): Supply truthful pen-name bios / expertise for `/authors/*` (no fabricated credentials) (T5.2).
- [ ] TODO(HUMAN): Lawyer review of `/privacy-policy` and `/terms` updates (T6.2) — agent does not give legal advice.
- [ ] TODO(HUMAN): Confirm affiliate relationships and which links need `rel="sponsored"` (T6.3).

## Claims & compliance

- [ ] TODO(HUMAN): Verify any earnings / CPM / timeline statistics against primary sources before publish; do not invent numbers.
- [ ] TODO(HUMAN): Confirm CMP / Funding Choices setup for EEA/UK/CH (T6.2).
- [ ] TODO(HUMAN): Confirm AdSense account health after ads limited to allowlisted routes (`/`, `/blog`, `/blog/*`, `/platform-guides*`) (T6.1).

## Infrastructure

- [ ] TODO(HUMAN): Confirm Cloudflare has **no** self-redirect on canonical `https://contentanonymity.com/` (documented CRIT-001 in `nginx.conf`); collapse www chain to **1 hop**.
- [ ] TODO(HUMAN): Coolify **Force Rebuild** on latest `main` with build-time `VITE_CONVEX_URL` (see `docs/seo/coolify-deploy.md`). Do not rely on “same SHA → skip build”.
- [ ] TODO(HUMAN): After deploy, curl article `<title>`, JSON-LD `BlogPosting`, and unknown-URL `404` (commands in coolify-deploy.md).
