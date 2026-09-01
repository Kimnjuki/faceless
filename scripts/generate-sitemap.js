/**
 * Dynamic Sitemap Generator
 *
 * Fetches dynamic routes from Convex HTTP API when CONVEX_SITE_URL is set.
 * Otherwise uses static routes only.
 *
 * Usage:
 *   node scripts/generate-sitemap.js
 *
 * Env: CONVEX_SITE_URL (e.g. https://your-deployment.convex.site) or
 *      derive from VITE_CONVEX_URL by replacing .convex.cloud with .convex.site
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const SITE_URL = 'https://contentanonymity.com';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

const staticRoutes = [
  // Homepage - Highest Priority
  { path: '/', priority: '1.0', changefreq: 'daily' },
  
  // Core Pages - High Priority
  { path: '/getting-started', priority: '0.9', changefreq: 'weekly' },
  { path: '/blog', priority: '0.9', changefreq: 'daily' },
  { path: '/news', priority: '0.8', changefreq: 'daily' },
  
  // Tools - High Priority
  { path: '/tools/all', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/calculator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/niche-quiz', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/seo-audit', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/keyword-research', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/backlink-checker', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/performance', priority: '0.7', changefreq: 'monthly' },
  
  // Learning Resources - High Priority
  { path: '/learning-paths', priority: '0.8', changefreq: 'monthly' },
  { path: '/platform-guides', priority: '0.8', changefreq: 'monthly' },
  { path: '/learning/case-studies', priority: '0.8', changefreq: 'weekly' },
  { path: '/learning/workshops', priority: '0.7', changefreq: 'monthly' },
  { path: '/learning/resources', priority: '0.7', changefreq: 'monthly' },
  
  // Resources - Medium Priority
  { path: '/resources/templates', priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/niches', priority: '0.7', changefreq: 'monthly' },
  
  // Products - Medium Priority
  { path: '/products/all', priority: '0.8', changefreq: 'weekly' },
  
  // Community - Medium Priority
  { path: '/community/members', priority: '0.6', changefreq: 'weekly' },
  { path: '/community/events', priority: '0.6', changefreq: 'weekly' },
  { path: '/community/challenges', priority: '0.6', changefreq: 'weekly' },
  
  // Legal & trust (AdSense / E-E-A-T)
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  // Note: /terms-of-service is intentionally excluded — the page canonicalizes to /terms.
  
  // Health Check (excluded from indexing but good to have in sitemap for monitoring)
  // Note: Health endpoint should have noindex meta tag
];

/**
 * Canonical URL hygiene — the sitemap must only publish URLs that are indexable,
 * return HTTP 200, and self-canonicalize. In particular:
 *  - No query strings / hashes / tracking params.
 *  - No URL-unsafe or malformed slugs (spaces, apostrophes, stars, trailing dots).
 *  - No auto-generated CSV-import placeholder rows (guide-<ts>-<rand>).
 *  - No placeholder/category-mislabeled article slugs that canonicalize elsewhere.
 *  - No duplicate URLs (repeated CSV rows for the same slug).
 */
const VALID_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AUTO_GUIDE_SLUG_RE = /^guide-\d+-[a-z0-9]+$/;
const EXCLUDED_ARTICLE_SLUGS = new Set(['workflows', 'anonymity']);

function isSitemapEligibleRoute(path) {
  if (typeof path !== 'string' || path.length === 0) return false;
  if (path === '/') return true; // homepage (static route)
  if (path.includes('?') || path.includes('#')) return false;
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return false;
  // Every path segment must be a URL-safe slug (no spaces / punctuation / encodings).
  for (const segment of segments) {
    if (!VALID_SLUG_RE.test(segment)) return false;
  }
  const last = segments[segments.length - 1];
  if (segments[0] === 'platform-guides' && AUTO_GUIDE_SLUG_RE.test(last)) return false;
  if (segments[0] === 'blog' && EXCLUDED_ARTICLE_SLUGS.has(last)) return false;
  return true;
}

function generateSitemap(routes) {
  const currentDate = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;
  routes.forEach((route) => {
    xml += `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod || currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
  });
  xml += `</urlset>`;
  return xml;
}

/**
 * Fetch dynamic routes from Convex HTTP API (/api/sitemap-data)
 */
async function fetchDynamicRoutes() {
  let baseUrl = process.env.CONVEX_SITE_URL;
  if (!baseUrl && process.env.VITE_CONVEX_URL) {
    baseUrl = process.env.VITE_CONVEX_URL.replace('.convex.cloud', '.convex.site');
  }
  if (!baseUrl) {
    console.warn('⚠️  Convex URL not found. Skipping dynamic routes.');
    console.warn('   Set CONVEX_SITE_URL or VITE_CONVEX_URL in .env.local');
    return [];
  }
  const url = baseUrl.replace(/\/$/, '') + '/api/sitemap-data';
  const dynamicRoutes = [];
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.articles && data.articles.length) {
      data.articles.forEach((a) => {
        dynamicRoutes.push({
          path: a.path.replace(SITE_URL, ''),
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: a.lastmod,
        });
      });
      console.log(`   ✅ Fetched ${data.articles.length} blog articles`);
    }
    if (data.guides && data.guides.length) {
      data.guides.forEach((g) => {
        dynamicRoutes.push({
          path: g.path.replace(SITE_URL, ''),
          priority: '0.7',
          changefreq: 'monthly',
          lastmod: g.lastmod,
        });
      });
      console.log(`   ✅ Fetched ${data.guides.length} platform guides`);
    }
    if (data.paths && data.paths.length) {
      data.paths.forEach((p) => {
        dynamicRoutes.push({
          path: p.path.replace(SITE_URL, ''),
          priority: '0.7',
          changefreq: 'monthly',
          lastmod: p.lastmod,
        });
      });
      console.log(`   ✅ Fetched ${data.paths.length} learning paths`);
    }
  } catch (err) {
    console.warn('   ⚠️  Could not fetch Convex sitemap data:', err.message);
  }
  return dynamicRoutes;
}

async function main() {
  try {
    console.log('🚀 Generating sitemap...');
    const dynamic = await fetchDynamicRoutes();
    // Keep only canonical, indexable, self-canonicalizing routes.
    const before = [...staticRoutes, ...dynamic];
    const seen = new Set();
    const allRoutes = before.filter((r) => {
      const path = typeof r.path === 'string' && r.path.startsWith('/') ? r.path : `/${r.path || ''}`;
      if (!isSitemapEligibleRoute(path)) return false;
      const url = SITE_URL + path;
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
    const removed = before.length - allRoutes.length;
    if (removed > 0) {
      console.log(`   ⚠️  Filtered ${removed} non-canonical / duplicate / malformed URL(s) from the sitemap.`);
    }
    const xml = generateSitemap(allRoutes);
    fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   Location: ${SITEMAP_PATH}`);
    console.log(`   Total URLs: ${allRoutes.length}`);
    console.log(`   Static: ${staticRoutes.length}, Dynamic: ${dynamic.length}`);

    // Notify IndexNow that the sitemap has been updated
    const INDEXNOW_KEY = "contentanonymity-indexnow-2026-secure-random-key-abc123def456";
    try {
      const indexnowRes = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: `${SITE_URL}/sitemap.xml`, key: INDEXNOW_KEY }),
      });
      if (indexnowRes.ok) {
        console.log(`   ✅ IndexNow notified of sitemap update`);
      } else {
        console.warn(`   ⚠️  IndexNow notification returned ${indexnowRes.status}`);
      }
    } catch (err) {
      console.warn(`   ⚠️  IndexNow notification failed: ${err.message}`);
    }
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run if executed directly
main();

export { generateSitemap, fetchDynamicRoutes };
