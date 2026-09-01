/**
 * Sitemap hygiene checker (P0-03 verification).
 *
 * Asserts the generated public/sitemap.xml emits ONLY canonical, non-www, de-duplicated,
 * hash-free URLs. Fails (exit 1) on any violation so it can gate CI / deploy.
 *
 * Usage: node scripts/check-sitemap-hygiene.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

const CANONICAL_HOST = 'https://contentanonymity.com';

function parseLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`❌ Sitemap not found at ${SITEMAP_PATH}. Run 'npm run generate-sitemap' first.`);
    process.exit(1);
  }
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const locs = parseLocs(xml);
  const problems = [];

  if (locs.length === 0) {
    problems.push('sitemap has no <loc> entries');
  }

  for (const url of locs) {
    if (!url.startsWith(CANONICAL_HOST)) {
      problems.push(`non-canonical host: ${url}`);
    }
    if (url.includes('www.')) {
      problems.push(`www host leaked: ${url}`);
    }
    // Random Convex doc-id hash learning paths are fragile + orphanned -> 404.
    if (/\/learning-paths\/[a-z0-9]{32}$/.test(url)) {
      problems.push(`fragile hash learning-path URL: ${url}`);
    }
  }

  const dupes = locs.length - new Set(locs).size;
  if (dupes > 0) {
    problems.push(`${dupes} duplicate <loc> entries`);
  }

  console.log(`🔎 Validated ${locs.length} sitemap URLs ...`);
  if (problems.length > 0) {
    problems.forEach((p) => console.error(`  ❌ ${p}`));
    console.error(`\n❌ ${problems.length} hygiene violation(s) found.`);
    process.exit(1);
  }
  console.log('✅ Sitemap hygiene OK: single canonical host, no www, no dupes, no hash learning paths.');
}

main();