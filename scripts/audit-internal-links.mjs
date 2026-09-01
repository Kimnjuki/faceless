/**
 * Internal Linking Audit
 *
 * Cross-references sitemap URLs against internal links found in either:
 *  - a live site (BASE_URL env var), or
 *  - the local dist/index.html
 *
 * Reports orphan pages (sitemap URLs with zero incoming internal links).
 *
 * Usage:
 *   node scripts/audit-internal-links.mjs
 *   BASE_URL=https://contentanonymity.com node scripts/audit-internal-links.mjs
 *   SITEMAP=public/sitemap.xml node scripts/audit-internal-links.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_PATH = path.join(__dirname, "..", process.env.SITEMAP || "public/sitemap.xml");
const BASE_URL = process.env.BASE_URL || null;
const DIST_INDEX = path.join(__dirname, "..", "dist", "index.html");

function parseSitemapLocs(xml) {
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    locs.push(m[1].trim());
  }
  return locs;
}

function extractInternalLinks(html, base) {
  const links = new Set();
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let href = m[1].trim();
    if (!href || href.startsWith("http") || href.startsWith("//") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("/")) {
      links.add(href);
    } else if (!href.startsWith(".")) {
      links.add("/" + href);
    }
  }
  return links;
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": "ContentAnonymityLinkBot/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`❌ Sitemap not found at ${SITEMAP_PATH}.`);
    process.exit(1);
  }
  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  const urls = parseSitemapLocs(xml);
  if (urls.length === 0) {
    console.error("❌ No <loc> entries found in sitemap.");
    process.exit(1);
  }

  let internalLinks = new Set();
  if (BASE_URL) {
    console.log(`🌐 Crawling ${BASE_URL} for internal links...`);
    try {
      const html = await fetchHtml(BASE_URL);
      internalLinks = extractInternalLinks(html, BASE_URL);
    } catch (err) {
      console.error(`❌ Failed to crawl ${BASE_URL}: ${err.message}`);
      process.exit(1);
    }
  } else if (fs.existsSync(DIST_INDEX)) {
    console.log(`📄 Reading ${DIST_INDEX} for internal links...`);
    const html = fs.readFileSync(DIST_INDEX, "utf8");
    internalLinks = extractInternalLinks(html, "");
  } else {
    console.warn("⚠️  No BASE_URL set and dist/index.html not found. Cannot audit internal links.");
    process.exit(1);
  }

  console.log(`   Found ${internalLinks.size} internal link targets.\n`);

  const orphans = [];
  for (const url of urls) {
    const pathname = new URL(url, "https://contentanonymity.com").pathname;
    const normalized = pathname.replace(/\/+$/, "") || "/";
    const found = internalLinks.has(normalized) || internalLinks.has(normalized + "/");
    if (!found) {
      orphans.push(url);
    }
  }

  console.log(`🔎 Audited ${urls.length} sitemap URLs against ${internalLinks.size} internal links.\n`);
  if (orphans.length === 0) {
    console.log("✅ No orphan pages found. Every sitemap URL has at least one internal link.");
  } else {
    console.log(`❌ ${orphans.length} orphan page(s) with zero incoming internal links:\n`);
    orphans.forEach((u) => console.error(`   - ${u}`));
    console.error(`\n❌ Fix: add internal links from nav, footer, category pages, or RelatedContent modules.`);
    process.exit(1);
  }
}

main();
