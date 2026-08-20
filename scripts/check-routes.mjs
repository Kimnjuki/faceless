/**
 * Route health check (P0-3 / T0-3)
 *
 * Fetches every URL declared in public/sitemap.xml and reports any response
 * that is not a successful 200 or a single-hop 301/308 redirect chain.
 * Fails CI (exit 1) when any route returns 4xx/5xx or redirects through
 * more than one hop, so indexation regressions are caught before Google does.
 *
 * Usage:
 *   node scripts/check-routes.mjs                 # uses sitemap host
 *   BASE_URL=https://contentanonymity.com node scripts/check-routes.mjs
 *   SITEMAP=public/sitemap.xml MAX_REDIRECTS=1 node scripts/check-routes.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_PATH = path.join(__dirname, '..', process.env.SITEMAP || 'public/sitemap.xml');
const BASE_URL = process.env.BASE_URL || null;
const MAX_REDIRECTS = Number(process.env.MAX_REDIRECTS ?? 1);
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS ?? 15000);
const USER_AGENT = 'ContentAnonymityRouteHealthBot/1.0 (+https://contentanonymity.com)';

function parseSitemapLocs(xml) {
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    locs.push(m[1].trim());
  }
  return locs;
}

async function fetchWithRedirects(url, redirectsSeen = 0) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    });
    const status = res.status;
    const location = res.headers.get('location');

    if ((status === 301 || status === 302 || status === 308) && location) {
      if (redirectsSeen >= MAX_REDIRECTS) {
        return { url, status: `CHAIN(${status}->${location})`, ok: false, depth: redirectsSeen + 1 };
      }
      const next = location.startsWith('http') ? location : new URL(location, url).href;
      return fetchWithRedirects(next, redirectsSeen + 1);
    }

    return { url, status, ok: status >= 200 && status < 300, depth: redirectsSeen };
  } catch (err) {
    return { url, status: `ERROR(${err.name === 'AbortError' ? 'timeout' : err.message})`, ok: false, depth: redirectsSeen };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`❌ Sitemap not found at ${SITEMAP_PATH}. Run "npm run generate-sitemap" first.`);
    process.exit(1);
  }
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  let urls = parseSitemapLocs(xml);
  if (BASE_URL) {
    const base = BASE_URL.replace(/\/$/, '');
    urls = urls.map((u) => (u.startsWith('http') ? u : `${base}${u.startsWith('/') ? '' : '/'}${u}`));
  }
  if (urls.length === 0) {
    console.error('❌ No <loc> entries found in sitemap.');
    process.exit(1);
  }

  console.log(`🚀 Checking ${urls.length} routes from ${SITEMAP_PATH} ...\n`);

  const results = [];
  for (const url of urls) {
    const r = await fetchWithRedirects(url);
    results.push(r);
    const mark = r.ok ? '✅' : '❌';
    console.log(`${mark} ${r.status}  ${url}`);
  }

  const failures = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failures.length}/${results.length} routes healthy.`);
  if (failures.length > 0) {
    console.error(`\n❌ ${failures.length} route(s) failed health check:`);
    failures.forEach((f) => console.error(`   - ${f.status}  ${f.url}`));
    process.exit(1);
  }
  console.log('✅ All routes returned 200 (or a single-hop redirect).');
}

main();
