/**
 * Verify prerendered dist HTML has self-referencing canonicals (not homepage-only shell).
 *
 * Usage:
 *   node scripts/verify-prerender.mjs
 *   SAMPLE=10 node scripts/verify-prerender.mjs
 *   MIN_OK_RATIO=0.8 node scripts/verify-prerender.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const SITE = 'https://contentanonymity.com';
const sampleLimit = Number(process.env.SAMPLE || 0);
const minOkRatio = Number(process.env.MIN_OK_RATIO || 0.8);

function htmlPathForRoute(routePath) {
  if (routePath === '/') return path.join(dist, 'index.html');
  const clean = routePath.replace(/\/+$/, '');
  const asDir = path.join(dist, clean.slice(1), 'index.html');
  const asFile = path.join(dist, `${clean.slice(1)}.html`);
  if (fs.existsSync(asDir)) return asDir;
  if (fs.existsSync(asFile)) return asFile;
  return asDir;
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!m) return null;
  const href = m[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1] : null;
}

if (!fs.existsSync(dist)) {
  console.error('❌ dist/ missing. Run vite build + react-snap first.');
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, 'utf8');
let routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  const pathname = new URL(m[1].trim()).pathname || '/';
  return pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
});

if (sampleLimit > 0) {
  routes = routes.slice(0, sampleLimit);
}

let missing = 0;
let wrongCanonical = 0;
let ok = 0;

for (const route of routes) {
  const file = htmlPathForRoute(route);
  const expected = route === '/' ? `${SITE}/` : `${SITE}${route}`;

  if (!fs.existsSync(file)) {
    console.log(`⚠️  missing HTML: ${route}`);
    missing++;
    continue;
  }

  const html = fs.readFileSync(file, 'utf8');
  const canonical = extractCanonical(html);
  const canonOk =
    canonical === expected ||
    (route === '/' && (canonical === SITE || canonical === `${SITE}/`));

  // Inner pages must not still point at the homepage canonical.
  const pointsHome =
    route !== '/' &&
    (canonical === SITE || canonical === `${SITE}/` || canonical === `${SITE}`);

  if (!canonOk || pointsHome) {
    console.log(`❌ canonical: ${route}`);
    console.log(`   got:      ${canonical}`);
    console.log(`   expected: ${expected}`);
    wrongCanonical++;
    continue;
  }

  ok++;
}

const ratio = routes.length ? ok / routes.length : 0;
console.log(`\n${ok}/${routes.length} prerendered pages have self-canonical HTML (${(ratio * 100).toFixed(1)}%).`);
console.log(`missing=${missing}, wrongCanonical=${wrongCanonical}`);

const homeHtml = path.join(dist, 'index.html');
if (!fs.existsSync(homeHtml)) {
  console.error('❌ Homepage dist/index.html missing.');
  process.exit(1);
}

if (wrongCanonical > 0) {
  console.error('❌ Failing: prerendered pages still have wrong/homepage canonicals.');
  process.exit(1);
}

if (ratio < minOkRatio) {
  console.error(`❌ Failing: ok ratio ${ratio.toFixed(2)} < required ${minOkRatio}.`);
  process.exit(1);
}

console.log('✅ Prerender verification passed.');
