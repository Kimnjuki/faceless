# Cluster Decisions

**Status:** Recommendations drafted 2026-11-23 — **awaiting human approval before applying >3 redirects/merges.**  
**Rule:** Do not delete a published URL without a 301 in `redirect-map.csv`.

## Summary recommendations

| Cluster | Decision | Canonical keep | Redirect / differentiate |
|---------|----------|----------------|--------------------------|
| youtube-faceless-getting-started | **ASK** (7 URLs) | `/faceless-content/youtube` hub + `/blog/faceless-youtube-channel-guide-2026` as primary spoke | Prefer 301: `faceless-youtube-blueprint-2025`, `faceless-youtube-setup-2025`, `faceless-strategy-playbook-2025`, `youtube-automation-strategy-2025` → evergreen guide or hub. Differentiate AI-voiceover post. |
| monetize-without-adsense | **MERGE (2)** after approval | `/blog/monetize-faceless-channel-without-ads-2026` | 301 `how-to-monetize-faceless-channel-without-adsense` → 2026 guide. Keep policy post differentiated. |
| ai-tools-reviews | **DIFFERENTIATE** | Both stay | Retarget: tools *stack* review vs video-generator roundup (titles/H1/intros). |
| tiktok | **KEEP + link** | Hub `/platform-guides` | Cross-link; no merge until content read confirms overlap. |
| instagram | **KEEP + link** | Hub `/platform-guides` | Same. |
| niche-selection | **KEEP + link** | Hub `/resources/niches` | Case studies stay; niches guide is pillar. |

## Detail: youtube-faceless-getting-started

**Hub:** `/faceless-content/youtube`  
**Candidates:** 7 URLs (slug-overlap only; bodies must be re-read at merge time).

| URL | Draft call | Reason |
|-----|------------|--------|
| `/blog/faceless-youtube-channel-guide-2026` | **KEEP** (primary) | Newest full guide; live title already ranking target |
| `/faceless-content/youtube` | **KEEP** (hub) | Cluster hub |
| `/blog/how-to-start-faceless-youtube-ai-voiceover-2026` | **DIFFERENTIATE** | Narrow AI-voiceover intent |
| `/platform-guides/youtube-faceless-strategy` | **KEEP or merge into hub** | Platform guide format; link heavily from hub |
| `/blog/faceless-youtube-blueprint-2025` | **MERGE → 2026 guide** | Stale year slug |
| `/platform-guides/faceless-youtube-setup-2025` | **MERGE → hub or 2026 guide** | Stale year slug |
| `/blog/faceless-strategy-playbook-2025` | **MERGE → hub** | Overlaps “strategy/playbook” |
| `/blog/youtube-automation-strategy-2025` | **MERGE → 2026 guide or hub** | Stale year slug |

**Human approval required** before issuing these 301s (4–5 redirects).

## Detail: monetize-without-adsense

| URL | Draft call |
|-----|------------|
| `/blog/monetize-faceless-channel-without-ads-2026` | **KEEP** |
| `/blog/how-to-monetize-faceless-channel-without-adsense` | **301 → 2026** (same intent) |
| `/blog/youtube-monetization-ai-faceless-policy-2026` | **KEEP** (policy/compliance angle) |

## Content quality flag

TODO(HUMAN): Several Convex articles (e.g. `faceless-youtube-channel-guide-2026`) currently store **~78 characters** of HTML (`<h2>…</h2>` only). Prerender can only emit what exists in Convex — restore full article bodies in CMS before expecting rich SERP snippets.

## Next step

Reply with approval for:
1. Monetize pair merge (2 URLs — within auto-apply threshold), and/or  
2. YouTube 2025→2026/hub redirects (4–5 URLs — **explicit approval required**).
