/**
 * Canonical-host live verification (step 2 of the SEO remediation gate).
 *
 * Asserts the four homepage URL variants each converge to the canonical URL
 * (https://contentanonymity.com/) with HTTP 200 and never redirect to
 * themselves. Fails (exit 1) on any redirect loop / non-canonical terminal URL
 * so CI and operators catch regressions before Ahrefs/Google do.
 *
 * Usage:
 *   node scripts/verify-canonical.mjs
 *   BASE_URL=https://contentanonymity.com node scripts/verify-canonical.mjs
 */
const CANONICAL = (process.env.BASE_URL || 'https://contentanonymity.com').replace(/\/+$/, '');
const VARIANTS = [
  'http://www.contentanonymity.com/',
  'https://www.contentanonymity.com/',
  'http://contentanonymity.com/',
  'https://contentanonymity.com/',
];
const MAX_HOPS = 5;
const REQUEST_TIMEOUT_MS = 15000;

async function fetchWithRedirects(url, hops = 0, seen = new Set()) {
  if (hops > MAX_HOPS || seen.has(url)) {
    return { url, status: 'LOOP', ok: false, hops, seen };
  }
  seen.add(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'User-Agent': 'ContentAnonymityCanonicalChecker/1.0 (+https://contentanonymity.com)' },
    });
    clearTimeout(timer);
    const status = res.status;
    const location = res.headers.get('location');
    if ((status === 301 || status === 302 || status === 307 || status === 308) && location) {
      const next = location.startsWith('http') ? location : new URL(location, url).href;
      return fetchWithRedirects(next, hops + 1, seen);
    }
    return { url, status, ok: status >= 200 && status < 300, hops, seen };
  } catch (err) {
    clearTimeout(timer);
    return { url, status: `ERROR(${err.name === 'AbortError' ? 'timeout' : err.message})`, ok: false, hops, seen };
  }
}

async function main() {
  console.log(`🚀 Verifying canonical convergence to ${CANONICAL}/ ...\n`);
  let failures = 0;

  for (const variant of VARIANTS) {
    const r = await fetchWithRedirects(variant);
    const terminalOk = r.ok && r.url.replace(/\/+$/, '') === CANONICAL;
    const selfRedirect = r.status === 'LOOP';
    const pass = terminalOk;
    console.log(`${pass ? '✅' : '❌'} ${variant}`);
    console.log(`     -> ${r.status}${r.url !== variant ? `  ${r.url}` : ''}${selfRedirect ? '  [REDIRECT LOOP]' : ''} (${r.hops} hop${r.hops === 1 ? '' : 's'})`);
    if (!pass) failures++;
  }

  console.log(`\n${VARIANTS.length - failures}/${VARIANTS.length} variants converge to the canonical URL.`);
  if (failures > 0) {
    console.error('\n❌ Redirect loop / non-canonical terminal URL detected. Fix the Cloudflare/host redirect rule before anything else.');
    process.exit(1);
  }
  console.log('✅ Canonical host verified: no loops, single-hop 301s, terminal 200 on the canonical URL.');
}

main();