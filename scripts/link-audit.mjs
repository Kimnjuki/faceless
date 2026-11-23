/**
 * T2.5 - Parse dist HTML for internal link graph.
 * Reports inlink counts, orphans (indexable with under 3 inlinks), broken local targets.
 *
 * Usage: node scripts/link-audit.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isOpaqueNichePath } from './niche-slug.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const outDir = path.join(root, 'docs', 'seo');

function walkHtml(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function routeFromFile(file) {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'/index.html'.length)}`;
  return `/${rel.replace(/\.html$/, '')}`;
}

function normalizeHref(href, fromRoute) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
  if (href.startsWith('http')) {
    try {
      const u = new URL(href);
      if (!u.hostname.includes('contentanonymity.com')) return null;
      let p = u.pathname || '/';
      if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
      return p;
    } catch {
      return null;
    }
  }
  if (href.startsWith('//')) return null;
  let p = href.split('?')[0].split('#')[0];
  if (!p.startsWith('/')) {
    const base = fromRoute === '/' ? '' : fromRoute;
    p = path.posix.normalize(`${base}/${p}`);
  }
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

function htmlExists(route) {
  if (route === '/sitemap.xml' || route === '/robots.txt' || route === '/ads.txt') {
    return fs.existsSync(path.join(root, 'public', path.basename(route)))
      || fs.existsSync(path.join(dist, path.basename(route)));
  }
  if (route === '/') return fs.existsSync(path.join(dist, 'index.html'));
  if (fs.existsSync(path.join(dist, route.slice(1), 'index.html'))) return true;
  if (fs.existsSync(path.join(dist, `${route.slice(1)}.html`))) return true;
  return false;
}

if (!fs.existsSync(dist)) {
  console.error('dist/ missing — run npm run build:seo first');
  process.exit(1);
}

const files = walkHtml(dist).filter((f) => {
  const base = path.basename(f);
  return base !== '404.html' && base !== '500.html';
});
const inlinks = new Map();
const broken = [];
const pages = [];
const noindexRoutes = new Set();

for (const file of files) {
  const route = routeFromFile(file);
  pages.push(route);
  if (!inlinks.has(route)) inlinks.set(route, 0);
  const html = fs.readFileSync(file, 'utf8');
  const robots = (html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i) || [])[1] || '';
  if (/noindex/i.test(robots)) noindexRoutes.add(route);

  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const target = normalizeHref(m[1], route);
    if (!target) continue;
    if (target === route) continue;
    if (isOpaqueNichePath(target)) {
      broken.push({ from: route, to: target, reason: 'opaque-niche-id' });
      continue;
    }
    if (!htmlExists(target) && !target.startsWith('/auth/') && !target.startsWith('/dashboard/')) {
      broken.push({ from: route, to: target });
      continue;
    }
    inlinks.set(target, (inlinks.get(target) || 0) + 1);
  }
}

const orphans = pages
  .filter((p) => {
    if (noindexRoutes.has(p)) return false;
    return (inlinks.get(p) || 0) < 3;
  })
  .map((p) => ({ path: p, inlinks: inlinks.get(p) || 0 }));

fs.mkdirSync(outDir, { recursive: true });
const report = {
  pages: pages.length,
  orphans: orphans.length,
  brokenInternal: broken.length,
  orphanList: orphans,
  brokenSample: broken.slice(0, 50),
  topInlinks: [...inlinks.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
};
fs.writeFileSync(path.join(outDir, 'link-audit-report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, 'orphans.json'), JSON.stringify(orphans, null, 2));

console.log(`link-audit: ${pages.length} pages, ${orphans.length} orphans (<3 inlinks), ${broken.length} broken`);
console.log(`Wrote docs/seo/link-audit-report.json and docs/seo/orphans.json`);

if (broken.length > 0) {
  console.error('Broken internal links (sample):');
  for (const b of broken.slice(0, 15)) console.error(`  ${b.from} -> ${b.to}`);
}

const opaqueNicheLinks = broken.filter((b) => b.reason === 'opaque-niche-id');
if (opaqueNicheLinks.length) {
  console.error(`Opaque niche ID links forbidden (${opaqueNicheLinks.length}):`);
  for (const b of opaqueNicheLinks.slice(0, 15)) console.error(`  ${b.from} -> ${b.to}`);
  process.exit(1);
}

// Soft fail orphans for now; hard-fail excessive broken among prerendered paths
const hardBroken = broken.filter((b) => htmlExists(b.from));
if (hardBroken.length > 40) {
  console.error(`Too many broken links (${hardBroken.length})`);
  process.exit(1);
}
console.log('✅ link-audit complete');
process.exit(0);
