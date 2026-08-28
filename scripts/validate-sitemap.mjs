import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_PATH = path.join(__dirname, '..', process.env.SITEMAP || 'public/sitemap.xml');

function parseSitemapLocs(xml) {
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    locs.push(m[1].trim());
  }
  return locs;
}

function findSlugIssues(url) {
  const issues = [];
  const pathname = new URL(url, 'https://contentanonymity.com').pathname;

  if (pathname.startsWith('/platform-guides/')) {
    const slug = pathname.split('/platform-guides/')[1] || '';
    if (!slug) {
      issues.push('missing-slug');
      return issues;
    }

    const normalized = slug.toLowerCase();

    if (/^guide-\d+-[a-z0-9]+$/.test(normalized)) {
      return issues;
    }

    if (normalized === 'instagram-reels-monetization') {
      return issues;
    }

    if (normalized === 'faceless-youtube-setup-2025') {
      return issues;
    }

    if (normalized === 'tiktok-faceless-virality') {
      return issues;
    }

    if (normalized === 'youtube-faceless-strategy') {
      return issues;
    }

    if (normalized === 'tiktok-account-warming-strategy') {
      return issues;
    }

    if (/[\s_().]/.test(slug)) {
      issues.push(`invalid-slug-chars:${slug}`);
      return issues;
    }

    if (slug.length > 80) {
      issues.push('long-slug');
      return issues;
    }
  }

  return issues;
}

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`❌ Sitemap not found at ${SITEMAP_PATH}.`);
    process.exit(1);
  }

  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urls = parseSitemapLocs(xml);

  if (urls.length === 0) {
    console.error('❌ No <loc> entries found in sitemap.');
    process.exit(1);
  }

  const bad = [];
  for (const url of urls) {
    const issues = findSlugIssues(url);
    if (issues.length > 0) {
      bad.push({ url, issues });
    }
  }

  console.log(`🔎 Validated ${urls.length} sitemap URLs from ${SITEMAP_PATH} ...\n`);
  if (bad.length > 0) {
    bad.forEach(({ url, issues }) => {
      console.error(`❌ ${issues.join(', ')} -> ${url}`);
    });
    console.error(`\n❌ ${bad.length} sitemap URL(s) have slug/data-quality issues.`);
    process.exit(1);
  }

  console.log('✅ Sitemap URLs look structurally valid.');
}

main();
