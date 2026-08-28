/**
 * Central site URL constant.
 *
 * Single source of truth so canonical tags, Open Graph URLs, breadcrumbs,
 * sitemap entries, and internal links all use the SAME domain convention
 * (https://contentanonymity.com — no "www", no trailing slash on the host).
 * Keep in sync with `SITE_URL` in scripts/generate-sitemap.js and convex/http.ts.
 */
export const SITE_URL = "https://contentanonymity.com";

/** Canonical homepage URL (trailing slash is the canonical form for the root). */
export const HOME_URL = `${SITE_URL}/`;