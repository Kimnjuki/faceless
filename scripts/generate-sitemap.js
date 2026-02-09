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
  
  // Legal Pages - Low Priority (but important for completeness)
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
  
  // Health Check (excluded from indexing but good to have in sitemap for monitoring)
  // Note: Health endpoint should have noindex meta tag
];

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
    const allRoutes = [...staticRoutes, ...dynamic];
    const xml = generateSitemap(allRoutes);
    fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   Location: ${SITEMAP_PATH}`);
    console.log(`   Total URLs: ${allRoutes.length}`);
    console.log(`   Static: ${staticRoutes.length}, Dynamic: ${dynamic.length}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run if executed directly
main();

export { generateSitemap, fetchDynamicRoutes };
