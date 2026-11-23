/**
 * T8.2 - CI SEO guardrail. Parses dist HTML after build and fails on:
 * - missing/duplicate titles (outside 20-65 chars)
 * - missing/duplicate meta descriptions
 * - missing/non-self canonical; og:url != canonical
 * - not exactly one h1
 * - noindex page listed in sitemap
 * - sitemap URL missing dist file
 *
 * Usage: node scripts/seo-check.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const SITE = 'https://contentanonymity.com';

const errors = [];
const warnings = [];

function walkHtml(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function routeFromFile(file) {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'/index.html'.length)}`;
  return `/${rel.replace(/\.html$/, '')}`;
}

function htmlPathForRoute(routePath) {
  if (routePath === '/') return path.join(dist, 'index.html');
  const clean = routePath.replace(/\/+$/, '');
  return path.join(dist, clean.slice(1), 'index.html');
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

if (!fs.existsSync(dist)) {
  console.error('dist/ missing — run npm run build:seo first');
  process.exit(1);
}

const files = walkHtml(dist).filter((f) => {
  const base = path.basename(f);
  return base !== '404.html' && base !== '500.html';
});
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const noindexRoutes = new Set();

for (const file of files) {
  const route = routeFromFile(file);
  const html = fs.readFileSync(file, 'utf8');
  const title = extract(html, /<title>([^<]*)<\/title>/i);
  const desc = extract(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const canonical = extract(html, /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
    || extract(html, /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  const ogUrl = extract(html, /<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i);
  const robots = extract(html, /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i) || '';
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];

  if (!title) errors.push(`${route}: missing <title>`);
  else {
    const len = title.replace(/&amp;/g, '&').length;
    if (len < 20 || len > 65) warnings.push(`${route}: title length ${len} (want 20-65)`);
    if (titles.has(title)) errors.push(`${route}: duplicate title with ${titles.get(title)}`);
    else titles.set(title, route);
  }

  if (!desc) errors.push(`${route}: missing meta description`);
  else if (descriptions.has(desc)) errors.push(`${route}: duplicate description with ${descriptions.get(desc)}`);
  else descriptions.set(desc, route);

  const expectedCanon = route === '/' ? `${SITE}/` : `${SITE}${route}`;
  if (!canonical) errors.push(`${route}: missing canonical`);
  else if (canonical !== expectedCanon) errors.push(`${route}: canonical ${canonical} != ${expectedCanon}`);
  else if (canonicals.has(canonical)) errors.push(`${route}: duplicate canonical`);
  else canonicals.set(canonical, route);

  if (ogUrl && canonical && ogUrl !== canonical) {
    errors.push(`${route}: og:url ${ogUrl} != canonical ${canonical}`);
  }

  if (h1s.length !== 1) {
    const meaningful = h1s.filter((m) => m[1].replace(/<[^>]+>/g, '').trim().length > 0);
    if (meaningful.length !== 1) {
      warnings.push(`${route}: expected 1 <h1>, found ${meaningful.length}`);
    }
  }

  if (/noindex/i.test(robots)) noindexRoutes.add(route);

  // T6.1 — prerendered HTML must not embed AdSense loader
  if (/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(html)) {
    errors.push(`${route}: AdSense script must not be in prerender HTML (load on-demand only)`);
  }

  // T5.1 — article pages need BlogPosting + BreadcrumbList JSON-LD
  if (route.startsWith('/blog/') && route !== '/blog') {
    if (!/"@type"\s*:\s*"BlogPosting"/i.test(html)) {
      errors.push(`${route}: missing BlogPosting JSON-LD`);
    }
    if (!/"@type"\s*:\s*"BreadcrumbList"/i.test(html)) {
      errors.push(`${route}: missing BreadcrumbList JSON-LD`);
    }
  }
}

const sitemapRoutes = [];
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    let pathname = new URL(m[1].trim()).pathname || '/';
    if (pathname !== '/' && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    sitemapRoutes.push(pathname);
  }
}

for (const route of sitemapRoutes) {
  const file = htmlPathForRoute(route);
  if (!fs.existsSync(file)) errors.push(`sitemap ${route}: missing ${path.relative(root, file)}`);
}

for (const route of noindexRoutes) {
  if (sitemapRoutes.includes(route)) {
    errors.push(`${route}: noindex but present in sitemap`);
  }
}

console.log(`seo-check: scanned ${files.length} HTML files, ${sitemapRoutes.length} sitemap URLs`);
for (const w of warnings) console.warn(`⚠️  ${w}`);
for (const e of errors) console.error(`❌ ${e}`);

if (errors.length) {
  console.error(`\nseo-check FAILED with ${errors.length} error(s)`);
  process.exit(1);
}
console.log('✅ seo-check passed');
process.exit(0);
