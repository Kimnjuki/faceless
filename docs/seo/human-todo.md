# Human TODO — ContentAnonymity SEO Overhaul

Items the agent cannot complete without human input, credentials, or legal/content authority. Marked `TODO(HUMAN)`.

## Verification & accounts

- [ ] TODO(HUMAN): Confirm Google Search Console Domain property for `contentanonymity.com`; submit sitemap; record Coverage/Pages counts (T8.1).
- [ ] TODO(HUMAN): Confirm Bing Webmaster Tools property; submit sitemap (T8.1).
- [ ] TODO(HUMAN): Re-run Ahrefs Site Audit with **Execute JavaScript ON** and OFF after deploy; attach new CSVs (T8.1).
- [ ] TODO(HUMAN): Enable JS rendering in Ahrefs project crawl settings (P2 from audit narrative).

## Content & editorial

- [ ] TODO(HUMAN): Approve drafted title/description rewrites after T1.2 (agent drafts; human approves).
- [ ] TODO(HUMAN): Review cluster merge decisions in `cluster-decisions.md` before any merge of **more than 3 pages** or URL structure change (agent must stop and ask).
- [ ] TODO(HUMAN): Supply truthful pen-name bios / expertise for `/authors/*` (no fabricated credentials) (T5.2).
- [ ] TODO(HUMAN): Lawyer review of `/privacy-policy` and `/terms` updates (T6.2) — agent does not give legal advice.
- [ ] TODO(HUMAN): Confirm affiliate relationships and which links need `rel="sponsored"` (T6.3).

## Claims & compliance

- [ ] TODO(HUMAN): Verify any earnings / CPM / timeline statistics against primary sources before publish; do not invent numbers.
- [ ] TODO(HUMAN): Confirm CMP / Funding Choices setup for EEA/UK/CH (T6.2).
- [ ] TODO(HUMAN): Confirm AdSense account health after ads are limited to `ads_allowed` pages (T6.1).

## Infrastructure

- [ ] TODO(HUMAN): Confirm Cloudflare has **no** self-redirect on canonical `https://contentanonymity.com/` (documented CRIT-001 in `nginx.conf`).
- [ ] TODO(HUMAN): Confirm production build command is `build:prerender` (or successor) in Coolify, not plain `vite build` alone.
