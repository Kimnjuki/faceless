/**
 * T1.1 — Build-time prerender for crawlable HTML.
 *
 * Fetches published articles, platform guides, and niches from Convex via
 * ConvexHttpClient, then writes dist/<route>/index.html with:
 *   - route-specific <title>, meta description, canonical, OG/Twitter
 *   - semantic body inside #root (h1, copy, crawlable <a href> links)
 *
 * React then client-renders over the static shell (see main.tsx data-prerender-static).
 *
 * Usage (after vite build):
 *   node scripts/prerender-routes.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import { relatedPathsFor } from './seo-clusters.mjs';
import { nichePublicSlug, isOpaqueNicheParam, VALID_NICHE_SLUG_RE } from './niche-slug.mjs';
import { linkOpportunitiesForText } from './internal-link-opps.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
dotenv.config({ path: path.join(root, '.env.local') });
dotenv.config({ path: path.join(root, '.env') });

const SITE = 'https://contentanonymity.com';
const dist = path.join(root, 'dist');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');

const VALID_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AUTO_GUIDE_SLUG_RE = /^guide-\d+-[a-z0-9]+$/;
const EXCLUDED_ARTICLE_SLUGS = new Set(['workflows', 'anonymity']);

/** Placeholder / thin routes — noindex until populated (T4.3).
 * Growth tools (seo-audit, keyword-research, backlink-checker, performance) are now indexable.
 *
 * 2026-11-26 GSC remediation: /news and /learning-paths were removed from this set.
 * Both now render substantial content (LearningPaths renders 11 curated paths with FAQ
 * schema; News renders the LiveWire Convex-backed feed) and both are linked from the
 * header/footer nav, so they are no longer thin. Keeping them noindexed was the direct
 * cause of the GSC "Page with redirect" / "Crawled - currently not indexed" reports. */
const THIN_NOINDEX = new Set([
  '/products/all',
  '/community/challenges',
  '/community/events',
  '/community/members',
  '/learning/workshops',
  '/learning/resources',
  '/resources/templates',
]);

const TOOL_DEFS = [
  {
    path: '/tools/calculator',
    title: 'Profitability Calculator',
    description:
      'Estimate faceless channel revenue with CPM, upload cadence, and monetization mix assumptions you can audit.',
    longCopy:
      'Model best/base/worst cases before you invest in production. Pair results with a niche from the database and a platform playbook so forecasts stay grounded.',
    faqs: [
      ['Is this CPM data guaranteed?', 'No — inputs are illustrative. Replace defaults with your niche research.'],
      ['Who should use it?', 'Creators choosing between niches or deciding whether ads + affiliates can cover costs.'],
    ],
  },
  {
    path: '/tools/niche-quiz',
    title: 'Niche Finder Quiz',
    description:
      'Answer short questions about skills, risk, and goals to surface faceless niches that fit your constraints.',
    longCopy:
      'Use the quiz as a filter, then open matching niche detail pages for formats, tools, and monetization notes. Re-run after you gain production experience.',
    faqs: [
      ['How accurate is the quiz?', 'It ranks fit signals — validate with the niche database and a small content test.'],
      ['Can I change answers later?', 'Yes. Treat it as a planning helper, not a permanent lock-in.'],
    ],
  },
  {
    path: '/tools/seo-audit',
    title: 'SEO Audit Tool',
    description:
      'Free on-page SEO audit for titles, H1s, meta descriptions, alt text, and internal links on faceless creator pages.',
    longCopy:
      'Run an audit before publishing guides or niche landing pages. Fix missing titles, thin copy, and weak internal links first — then re-check Core Web Vitals with the performance monitor.',
    faqs: [
      ['Does this replace Ahrefs Site Audit?', 'No. It is a lightweight on-page checker for your own pages, not a full crawl suite.'],
      ['What should I fix first?', 'One H1, unique title/meta, crawlable internal links, and images with alt text.'],
    ],
  },
  {
    path: '/tools/keyword-research',
    title: 'Keyword Research',
    description:
      'Generate keyword and question ideas for faceless YouTube, blogs, and short-form content without a paid suite.',
    longCopy:
      'Start from a seed topic (niche + platform), expand into questions and modifiers, then map winners to scripts and blog outlines. Cross-check intent with platform guides before filming.',
    faqs: [
      ['Are volumes exact?', 'Treat lists as ideation. Validate demand with Search Console and platform analytics.'],
      ['Best workflow?', 'Seed → cluster → outline → internal links from related guides.'],
    ],
  },
  {
    path: '/tools/backlink-checker',
    title: 'Backlink Checker',
    description:
      'Inspect referring domains and link patterns so you can prioritize outreach and cleanup for creator sites.',
    longCopy:
      'Use this when auditing a channel site or affiliate landing page. Focus on relevant referring domains, then earn links from niche roundups, tools directories, and original research posts.',
    faqs: [
      ['Is this a full backlink index?', 'No — it is a practical checker for planning, not a replacement for enterprise link databases.'],
      ['What links matter most?', 'Topically relevant pages with real traffic beat raw link counts.'],
    ],
  },
  {
    path: '/tools/performance',
    title: 'Performance Monitor',
    description:
      'Track Core Web Vitals and page-speed signals that affect rankings and ad viewability on creator sites.',
    longCopy:
      'After SEO fixes, measure LCP/CLS/INP style issues. Defer third-party scripts (ads load on-demand), compress hero media, and keep prerendered HTML lean for crawlers.',
    faqs: [
      ['Why performance for SEO?', 'Speed and stability improve UX signals and protect crawl efficiency.'],
      ['Quick wins?', 'Defer ads, compress images, avoid layout shifts, keep critical CSS small.'],
    ],
  },
  {
    path: '/tools/all',
    title: 'All Creator Tools',
    description:
      'Free faceless creator tools: profitability calculator, niche quiz, SEO audit, keyword research, backlinks, and performance.',
    longCopy:
      'Start with niche + calculator, then SEO/keyword tools before publishing. Use performance checks before scaling traffic campaigns.',
    faqs: [
      ['Which tool first?', 'Niche quiz → calculator → keyword research → SEO audit.'],
      ['Are tools free?', 'Yes — built for anonymous creators planning faceless channels.'],
    ],
  },
];

function toolFaqJsonLd(tool) {
  if (!tool?.faqs?.length) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function toolAppJsonLd(tool) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: `${SITE}${tool.path}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: tool.description,
    provider: { '@type': 'Organization', name: 'ContentAnonymity', url: SITE },
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

const STATIC_PAGE_META = {
  '/': {
    title: 'Build a Privacy-First Faceless Content Business | ContentAnonymity',
    description:
      'Build a profitable faceless content business with AI automation. Guides, monetization strategies, and free tools for anonymous creators.',
    h1: 'Build a Privacy-First Faceless Content Business',
  },
  '/blog': {
    title: 'Faceless Content Blog & Guides | ContentAnonymity',
    description:
      'Practical guides on faceless YouTube, TikTok, Instagram, monetization, AI workflows, and niche selection for anonymous creators.',
    h1: 'Faceless Content Blog & Guides',
  },
  '/platform-guides': {
    title: 'Platform Guides for Faceless Creators | ContentAnonymity',
    description:
      'Step-by-step platform guides for faceless YouTube, TikTok, and Instagram strategies without showing your face.',
    h1: 'Platform Guides for Faceless Creators',
  },
  '/tools/all': {
    title: 'Free Creator Tools | ContentAnonymity',
    description:
      'Free faceless creator tools: profitability calculator, niche quiz, SEO audit, keyword research, and performance checks.',
    h1: 'Free Creator Tools',
  },
  '/resources/niches': {
    title: 'Faceless Niche Database | ContentAnonymity',
    description:
      'Browse faceless content niches with difficulty, monetization notes, and startup considerations for anonymous creators.',
    h1: 'Faceless Niche Database',
  },
  '/learning/case-studies': {
    title: 'Faceless Creator Case Studies | ContentAnonymity',
    description:
      'Case studies and breakdowns of faceless content strategies across YouTube, TikTok, and Instagram.',
    h1: 'Faceless Creator Case Studies',
  },
  '/faceless-content': {
    title: 'Faceless Content Hub | ContentAnonymity',
    description:
      'Start here for faceless YouTube, monetization, AI workflows, and quality control for anonymous creators.',
    h1: 'Faceless Content Hub',
  },
  '/faceless-content/youtube': {
    title: 'Faceless YouTube Hub | ContentAnonymity',
    description:
      'Hub for faceless YouTube setup, automation strategy, niches, and monetization without showing your face.',
    h1: 'Faceless YouTube',
  },
  '/faceless-content/monetization': {
    title: 'Faceless Monetization Hub | ContentAnonymity',
    description:
      'Monetize faceless channels with ads alternatives, affiliates, digital products, and platform programs.',
    h1: 'Faceless Monetization',
  },
  '/getting-started': {
    title: 'Getting Started with Faceless Content | ContentAnonymity',
    description:
      'A practical onboarding path to launch your first faceless content channel with tools and guides.',
    h1: 'Getting Started',
  },
  '/about': {
    title: 'About ContentAnonymity',
    description: 'Mission and methodology behind ContentAnonymity — privacy-first faceless content education.',
    h1: 'About ContentAnonymity',
  },
  '/contact': {
    title: 'Contact ContentAnonymity',
    description: 'Contact ContentAnonymity for support, partnerships, and editorial questions.',
    h1: 'Contact',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | ContentAnonymity',
    description: 'How ContentAnonymity collects, uses, and protects personal data.',
    h1: 'Privacy Policy',
  },
  '/terms': {
    title: 'Terms of Service | ContentAnonymity',
    description: 'Terms of service for using ContentAnonymity websites and tools.',
    h1: 'Terms of Service',
  },
};

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(s, max) {
  const t = String(s ?? '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

/** Keep brand suffix intact while staying <= 55 chars (pixel-safe for SERPs). */
function brandTitle(headline) {
  const suffix = ' | ContentAnonymity';
  const max = 55;
  const h = String(headline ?? '').trim();
  if (!h) return truncate(`ContentAnonymity${suffix}`, max);
  if (h.includes('ContentAnonymity')) return truncate(h, max);
  if ((h + suffix).length <= max) return h + suffix;
  return `${truncate(h, max - suffix.length)}${suffix}`;
}

/** Load slug list from fallback niche TS sources (authoritative public URLs). */
function loadFallbackNicheRecords() {
  const files = [
    path.join(root, 'src/config/niches/fallbackCore.ts'),
    path.join(root, 'src/config/niches/fallbackBulk.ts'),
  ];
  const bySlug = new Map();
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    const blocks = text.split(/\{\s*slug:\s*"/).slice(1);
    for (const block of blocks) {
      const slug = block.match(/^([^"]+)"/)?.[1];
      if (!slug || !VALID_NICHE_SLUG_RE.test(slug)) continue;
      const nicheName = block.match(/nicheName:\s*"([^"]+)"/)?.[1] || titleFromSlug(slug);
      const description = block.match(/description:\s*"([^"]+)"/)?.[1] || '';
      bySlug.set(slug, { slug, nicheName, description });
    }
  }
  return [...bySlug.values()];
}

function normalizeNichesForSeo(convexNiches, fallbackNiches) {
  const bySlug = new Map();
  for (const f of fallbackNiches) {
    bySlug.set(f.slug, {
      slug: f.slug,
      nicheName: f.nicheName,
      description: f.description,
      source: 'fallback',
    });
  }
  for (const n of convexNiches || []) {
    const slug = nichePublicSlug(n);
    if (!slug || isOpaqueNicheParam(slug)) continue;
    const prev = bySlug.get(slug);
    bySlug.set(slug, {
      slug,
      nicheName: n.nicheName || prev?.nicheName || titleFromSlug(slug),
      description: n.description || prev?.description || '',
      difficultyLevel: n.difficultyLevel,
      profitabilityScore: n.profitabilityScore,
      source: prev ? 'merged' : 'convex',
    });
  }
  return [...bySlug.values()].sort((a, b) => a.nicheName.localeCompare(b.nicheName));
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function isCanonicalGuide(g) {
  const slug = (g.slug ?? '').trim();
  if (!VALID_SLUG_RE.test(slug) || AUTO_GUIDE_SLUG_RE.test(slug)) return false;
  const title = (g.title ?? '').trim();
  if (!title || /^untitled(\s+guide)?$/i.test(title)) return false;
  const content = (g.content ?? '').trim();
  const excerpt = (g.excerpt ?? '').trim();
  if (!content && !excerpt) return false;
  if (g.redirectToSlug) return false;
  return true;
}

function isCanonicalArticle(a) {
  const slug = (a.slug ?? '').trim();
  if (!VALID_SLUG_RE.test(slug) || EXCLUDED_ARTICLE_SLUGS.has(slug)) return false;
  if (a.redirectToSlug) return false;
  return true;
}

function looksLikeHtml(s) {
  return /<(h[1-6]|p|div|section|article|ul|ol|li|table|blockquote|pre|figure|img|a)\b/i.test(s);
}

function markdownToHtml(md) {
  if (!md || typeof md !== 'string') return '';
  let trimmed = md.trim();
  // Some CSV imports store HTML as entities
  if (!looksLikeHtml(trimmed) && /&lt;[a-z]/i.test(trimmed)) {
    trimmed = trimmed
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  }
  if (looksLikeHtml(trimmed)) {
    // Already HTML — strip scripts only; do not escape
    return trimmed.replace(/<script[\s\S]*?<\/script>/gi, '');
  }
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let para = [];
  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(' ').trim();
    if (text) out.push(`<p>${inlineMd(text)}</p>`);
    para = [];
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      continue;
    }
    if (/^###\s+/.test(line)) {
      flushPara();
      out.push(`<h3>${inlineMd(line.replace(/^###\s+/, ''))}</h3>`);
      continue;
    }
    if (/^##\s+/.test(line)) {
      flushPara();
      out.push(`<h2>${inlineMd(line.replace(/^##\s+/, ''))}</h2>`);
      continue;
    }
    if (/^#\s+/.test(line)) {
      flushPara();
      // Skip duplicate H1 — page already has one
      out.push(`<h2>${inlineMd(line.replace(/^#\s+/, ''))}</h2>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      out.push(`<li>${inlineMd(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }
    para.push(line.trim());
  }
  flushPara();
  // Wrap consecutive li
  let html = out.join('\n');
  html = html.replace(/(?:<li>[\s\S]*?<\/li>\n?)+/g, (block) => `<ul>${block}</ul>`);
  return html;
}

function inlineMd(text) {
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return s;
}

function routesFromSitemap() {
  if (!fs.existsSync(sitemapPath)) return ['/'];
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const routes = [];
  const seen = new Set();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    let pathname = new URL(m[1].trim()).pathname || '/';
    if (pathname !== '/' && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    if (seen.has(pathname)) continue;
    seen.add(pathname);
    routes.push(pathname);
  }
  return routes;
}

function loadShell() {
  const shellPath = path.join(dist, 'index.html');
  if (!fs.existsSync(shellPath)) {
    throw new Error('dist/index.html missing — run vite build first');
  }
  // Strip any residual AdSense loader from the Vite shell (T6.1 — load on-demand in SPA only)
  return fs
    .readFileSync(shellPath, 'utf8')
    .replace(
      /<script[^>]+pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*>\s*<\/script>/gi,
      '',
    );
}

function replaceNamedMeta(html, name, content) {
  const re = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'][^"']*["']\\s*/?>`, 'i');
  if (re.test(html)) {
    return html.replace(re, `<meta name="${name}" content="${escapeHtml(content)}" />`);
  }
  return `${html.replace(/<\/head>/i, `  <meta name="${name}" content="${escapeHtml(content)}" />\n</head>`)}`;
}

function replacePropertyMeta(html, property, content) {
  const re = new RegExp(
    `<meta\\s+property=["']${property}["']\\s+content=["'][^"']*["']\\s*/?>`,
    'i',
  );
  if (re.test(html)) {
    return html.replace(re, `<meta property="${property}" content="${escapeHtml(content)}" />`);
  }
  return html.replace(
    /<\/head>/i,
    `  <meta property="${property}" content="${escapeHtml(content)}" />\n</head>`,
  );
}

function applyHead(html, { title, description, canonical, type = 'website' }) {
  let out = html;
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  // Drop obsolete meta-title (duplicate of <title>)
  out = out.replace(/<meta\s+name=["']title["']\s+content=["'][^"']*["']\s*\/?>/gi, '');
  out = out.replace(/<meta\s+name=["']keywords["']\s+content=["'][^"']*["']\s*\/?>/gi, '');
  out = out.replace(/<meta\s+name=["']revisit-after["']\s+content=["'][^"']*["']\s*\/?>/gi, '');
  out = replaceNamedMeta(out, 'description', description);
  out = replaceNamedMeta(
    out,
    'robots',
    'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  );
  if (/<link[^>]+rel=["']canonical["']/i.test(out)) {
    out = out.replace(/<link[^>]+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
  } else {
    out = out.replace(/<\/head>/i, `  <link rel="canonical" href="${canonical}" />\n</head>`);
  }
  out = replacePropertyMeta(out, 'og:type', type);
  out = replacePropertyMeta(out, 'og:url', canonical);
  out = replacePropertyMeta(out, 'og:title', title);
  out = replacePropertyMeta(out, 'og:description', description);
  out = replaceNamedMeta(out, 'twitter:url', canonical);
  out = replaceNamedMeta(out, 'twitter:title', title);
  out = replaceNamedMeta(out, 'twitter:description', description);
  return out;
}

function siteNavHtml() {
  return `<nav aria-label="Primary">
  <a href="/">Home</a> ·
  <a href="/getting-started">Getting Started</a> ·
  <a href="/blog">Blog</a> ·
  <a href="/learning-paths">Learning Paths</a> ·
  <a href="/platform-guides">Platform Guides</a> ·
  <a href="/faceless-content">Faceless Content</a> ·
  <a href="/faceless-content/youtube">YouTube</a> ·
  <a href="/faceless-content/monetization">Monetization</a> ·
  <a href="/tools/all">Tools</a> ·
  <a href="/learning/case-studies">Case Studies</a> ·
  <a href="/news">News</a> ·
  <a href="/resources/niches">Niches</a>
</nav>`;
}

function siteFooterHtml() {
  return `<footer>
  <p><a href="/">ContentAnonymity</a> — privacy-first faceless content.</p>
  <p>
    <a href="/about">About</a> ·
    <a href="/contact">Contact</a> ·
    <a href="/privacy-policy">Privacy Policy</a> ·
    <a href="/terms">Terms</a> ·
    <a href="/getting-started">Getting Started</a> ·
    <a href="/blog">Blog</a> ·
    <a href="/learning-paths">Learning Paths</a> ·
    <a href="/platform-guides">Platform Guides</a> ·
    <a href="/faceless-content">Faceless Content</a> ·
    <a href="/tools/all">Tools</a> ·
    <a href="/tools/seo-audit">SEO Audit</a> ·
    <a href="/tools/keyword-research">Keyword Research</a> ·
    <a href="/tools/backlink-checker">Backlink Checker</a> ·
    <a href="/tools/performance">Performance</a> ·
    <a href="/news">News</a> ·
    <a href="/resources/niches">Niches</a> ·
    <a href="/starter-kit">Starter Kit</a>
  </p>
</footer>`;
}

function linkList(items) {
  if (!items.length) return '<p>No items published yet.</p>';
  return `<ul>${items
    .map(
      (it) =>
        `<li><a href="${escapeHtml(it.href)}">${escapeHtml(it.label)}</a>${
          it.excerpt ? ` — ${escapeHtml(truncate(it.excerpt, 140))}` : ''
        }</li>`,
    )
    .join('\n')}</ul>`;
}

function breadcrumbJsonLd(crumbs) {
  if (!crumbs?.length) return '';
  const items = crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: c.href.startsWith('http') ? c.href : `${SITE}${c.href === '/' ? '/' : c.href}`,
  }));
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function articleJsonLd({ headline, description, path, datePublished, dateModified }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    author: {
      '@type': 'Organization',
      name: 'ContentAnonymity',
      url: SITE,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ContentAnonymity',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE}/logo-icon.svg`,
      },
    },
    mainEntityOfPage: `${SITE}${path}`,
    image: `${SITE}/og-image.png`,
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function wrapRoot({ h1, lead, mainHtml, crumbs, jsonLd = '' }) {
  const crumbHtml = crumbs?.length
    ? `<nav aria-label="Breadcrumb"><ol>${crumbs
        .map((c, i) =>
          i === crumbs.length - 1
            ? `<li aria-current="page">${escapeHtml(c.name)}</li>`
            : `<li><a href="${escapeHtml(c.href)}">${escapeHtml(c.name)}</a></li>`,
        )
        .join(' › ')}</ol></nav>`
    : '';
  return `<div data-prerender-static="true">
${breadcrumbJsonLd(crumbs)}
${jsonLd}
${siteNavHtml()}
${crumbHtml}
<main id="main-content">
  <h1>${escapeHtml(h1)}</h1>
  ${lead ? `<p>${escapeHtml(lead)}</p>` : ''}
  ${mainHtml}
</main>
${siteFooterHtml()}
</div>`;
}

function metaForRoute(route, articlesBySlug, guidesBySlug, nichesBySlug) {
  if (STATIC_PAGE_META[route]) {
    const m = STATIC_PAGE_META[route];
    const h1 = m.h1.length > 70 ? truncate(m.h1, 68) : m.h1;
    return {
      title: brandTitle(m.title.replace(/\s*\|\s*ContentAnonymity\s*$/i, '')),
      description: truncate(m.description, 155),
      canonical: route === '/' ? `${SITE}/` : `${SITE}${route}`,
      type: 'website',
      h1,
    };
  }

  const blog = route.match(/^\/blog\/([^/]+)$/);
  if (blog) {
    const a = articlesBySlug.get(blog[1]);
    const headline = a?.seoTitle || a?.title || titleFromSlug(blog[1]);
    const description =
      a?.metaDescription ||
      a?.excerpt ||
      `Read ${headline} — practical guidance for faceless creators on ContentAnonymity.`;
    const h1raw = a?.title || headline;
    return {
      title: brandTitle(headline),
      description: truncate(description, 155),
      canonical: `${SITE}${route}`,
      type: 'article',
      h1: h1raw.length > 70 ? truncate(h1raw, 68) : h1raw,
    };
  }

  const guide = route.match(/^\/platform-guides\/([^/]+)$/);
  if (guide) {
    const g = guidesBySlug.get(guide[1]);
    const headline = g?.title || titleFromSlug(guide[1]);
    const description =
      g?.excerpt ||
      `${headline} — platform guide for faceless creators on ContentAnonymity.`;
    return {
      title: brandTitle(headline),
      description: truncate(description, 155),
      canonical: `${SITE}${route}`,
      type: 'article',
      h1: headline.length > 70 ? truncate(headline, 68) : headline,
    };
  }

  const niche = route.match(/^\/niches\/([^/]+)$/);
  if (niche) {
    const n = nichesBySlug?.get(niche[1]);
    const headline = n?.nicheName || titleFromSlug(niche[1]);
    const description =
      n?.description ||
      `${headline} niche analysis for faceless creators — formats, monetization, and tools on ContentAnonymity.`;
    return {
      title: brandTitle(`${headline} Niche`),
      description: truncate(description, 155),
      canonical: `${SITE}${route}`,
      type: 'article',
      h1: headline.length > 70 ? truncate(headline, 68) : headline,
    };
  }

  const tool = TOOL_DEFS.find((t) => t.path === route);
  if (tool) {
    return {
      title: brandTitle(tool.title),
      description: truncate(tool.description, 155),
      canonical: `${SITE}${route}`,
      type: 'website',
      h1: tool.title,
    };
  }

  const headline = titleFromSlug(route.split('/').filter(Boolean).pop() || 'Page');
  return {
    title: brandTitle(headline),
    description: truncate(
      `${headline} on ContentAnonymity — privacy-first faceless content guides and tools.`,
      155,
    ),
    canonical: `${SITE}${route}`,
    type: 'website',
    h1: headline,
  };
}

function bodyForRoute(route, meta, ctx) {
  const { articles, guides, niches, articlesBySlug, guidesBySlug } = ctx;

  if (route === '/blog') {
    const topNiches = niches.slice(0, 12).map((n) => ({
      href: `/niches/${n.slug}`,
      label: n.nicheName,
    }));
    return wrapRoot({
      h1: meta.h1,
      lead: 'All published guides and articles for faceless creators.',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
      ],
      mainHtml: `<h2>Latest guides</h2>
      ${linkList(
        articles.map((a) => ({
          href: `/blog/${a.slug}`,
          label: a.title,
          excerpt: a.excerpt,
        })),
      )}
      <h2>Pair articles with a niche</h2>
      ${linkList(topNiches)}
      <p><a href="/resources/niches">Full niche database</a> · <a href="/platform-guides">Platform guides</a> · <a href="/faceless-content">Faceless Content Hub</a></p>`,
    });
  }

  if (route === '/platform-guides') {
    return wrapRoot({
      h1: meta.h1,
      lead: 'Platform-specific playbooks for anonymous creators.',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Platform Guides', href: '/platform-guides' },
      ],
      mainHtml: linkList(
        guides.map((g) => ({
          href: `/platform-guides/${g.slug}`,
          label: g.title,
          excerpt: g.excerpt,
        })),
      ),
    });
  }

  if (route === '/tools/all') {
    return wrapRoot({
      h1: meta.h1,
      lead: 'Free tools to plan niches, revenue, and SEO for faceless channels.',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Tools', href: '/tools/all' },
      ],
      mainHtml: linkList(
        TOOL_DEFS.filter((t) => t.path !== '/tools/all').map((t) => ({
          href: t.path,
          label: t.title,
          excerpt: t.description,
        })),
      ),
    });
  }

  if (route === '/resources/niches') {
    const items = niches.slice(0, 200).map((n) => ({
      href: `/niches/${n.slug}`,
      label: n.nicheName || 'Niche',
      excerpt: n.description,
    }));
    return wrapRoot({
      h1: meta.h1,
      lead:
        'Browse faceless-friendly niches with difficulty, monetization notes, and startup considerations. Every niche below uses a stable slug URL for crawlers.',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Niches', href: '/resources/niches' },
      ],
      mainHtml: `<h2>How to use this niche database</h2>
      <p>Pick a niche that matches your skills and risk tolerance, then open the detail page for formats, tools, and monetization ideas. Cross-check with the <a href="/tools/niche-quiz">Niche Finder Quiz</a> and <a href="/tools/calculator">Profitability Calculator</a>.</p>
      <h2>All niches</h2>
      ${linkList(items)}
      <p>Related: <a href="/blog">Blog guides</a> · <a href="/faceless-content">Faceless Content Hub</a> · <a href="/getting-started">Getting Started</a></p>`,
    });
  }

  const nicheRoute = route.match(/^\/niches\/([^/]+)$/);
  if (nicheRoute) {
    const slug = nicheRoute[1];
    const idx = niches.findIndex((x) => x.slug === slug);
    const n = idx >= 0 ? niches[idx] : null;
    // Circular neighbors so every niche earns multiple peer inlinks (anti-orphan)
    const related = [];
    if (niches.length > 1 && idx >= 0) {
      for (let step = 1; step <= 8 && related.length < 8; step++) {
        const other = niches[(idx + step) % niches.length];
        if (other.slug !== slug) {
          related.push({ href: `/niches/${other.slug}`, label: other.nicheName });
        }
      }
    }
    return wrapRoot({
      h1: meta.h1,
      lead: n?.description || meta.description,
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Niches', href: '/resources/niches' },
        { name: truncate(meta.h1, 40), href: route },
      ],
      mainHtml: `<article>
        <h2>Why this niche works for faceless creators</h2>
        <p>${escapeHtml(n?.description || meta.description)}</p>
        <h2>Next steps</h2>
        <ul>
          <li><a href="/tools/niche-quiz">Validate fit with the Niche Finder Quiz</a></li>
          <li><a href="/tools/calculator">Model revenue with the Profitability Calculator</a></li>
          <li><a href="/faceless-content/youtube">Read the Faceless YouTube hub</a></li>
          <li><a href="/blog">Browse related blog guides</a></li>
          <li><a href="/platform-guides">Platform guides</a></li>
          <li><a href="/getting-started">Getting started</a></li>
        </ul>
      </article>
      <h2>Related niches</h2>
      ${linkList(related)}
      <p><a href="/resources/niches">Back to the full niche database</a> · <a href="/tools/all">Creator tools</a></p>`,
    });
  }

  if (route === '/faceless-content/youtube') {
    const yt = articles.filter((a) => /youtube|faceless/i.test(`${a.slug} ${a.title}`)).slice(0, 20);
    return wrapRoot({
      h1: meta.h1,
      lead: 'Guides and strategies for faceless YouTube channels.',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Faceless Content', href: '/faceless-content' },
        { name: 'YouTube', href: '/faceless-content/youtube' },
      ],
      mainHtml: `${linkList(
        yt.map((a) => ({ href: `/blog/${a.slug}`, label: a.title, excerpt: a.excerpt })),
      )}
      <h2>Related platform guides</h2>
      ${linkList(
        guides
          .filter((g) => /youtube/i.test(`${g.slug} ${g.title} ${g.platform || ''}`))
          .map((g) => ({ href: `/platform-guides/${g.slug}`, label: g.title })),
      )}`,
    });
  }

  if (route === '/faceless-content/monetization') {
    const mon = articles.filter((a) => /monetiz|adsense|affiliate|cpm|revenue/i.test(`${a.slug} ${a.title}`));
    return wrapRoot({
      h1: meta.h1,
      lead: 'Ways to monetize faceless channels beyond a single ad network.',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Faceless Content', href: '/faceless-content' },
        { name: 'Monetization', href: '/faceless-content/monetization' },
      ],
      mainHtml: linkList(
        mon.map((a) => ({ href: `/blog/${a.slug}`, label: a.title, excerpt: a.excerpt })),
      ),
    });
  }

  const blog = route.match(/^\/blog\/([^/]+)$/);
  if (blog) {
    const a = articlesBySlug.get(blog[1]);
    const rawText = typeof a?.content === 'string' ? a.content : a?.excerpt || '';
    const contentHtml = markdownToHtml(rawText);
    const clusterRelated = relatedPathsFor(route, 8);
    const articleIdx = articles.findIndex((x) => x.slug === blog[1]);
    const neighborRelated = [];
    if (articles.length > 1 && articleIdx >= 0) {
      for (let step = 1; step <= 8 && neighborRelated.length < 8; step++) {
        const other = articles[(articleIdx + step) % articles.length];
        if (other.slug !== blog[1]) {
          neighborRelated.push({ href: `/blog/${other.slug}`, label: other.title });
        }
      }
    }
    const related = [...clusterRelated];
    for (const r of neighborRelated) {
      if (related.length >= 10) break;
      if (!related.some((x) => x.href === r.href)) related.push(r);
    }
    const labelByHref = new Map(
      articles.map((x) => [`/blog/${x.slug}`, x.title]),
    );
    const relatedLabeled = related.map((r) => ({
      href: r.href,
      label: labelByHref.get(r.href) || r.label,
    }));
    const oppLinks = linkOpportunitiesForText(`${a?.title || ''} ${a?.excerpt || ''} ${rawText}`, {
      excludePath: route,
      limit: 4,
    });
    const published = a?.publishedAt || a?.createdAt;
    const modified = a?.updatedAt || published;
    const toIso = (n) => (typeof n === 'number' ? new Date(n).toISOString() : undefined);
    const toolCta =
      oppLinks.length > 0
        ? `<h2>Recommended tools for this topic</h2>${linkList(oppLinks)}`
        : `<p><a href="/tools/calculator">Next step: try the Profitability Calculator</a> · <a href="/tools/niche-quiz">or the Niche Finder Quiz</a> · <a href="/tools/seo-audit">SEO Audit</a></p>`;
    return wrapRoot({
      h1: meta.h1,
      lead: a?.excerpt || '',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: truncate(meta.h1, 48), href: route },
      ],
      jsonLd: articleJsonLd({
        headline: meta.h1,
        description: meta.description,
        path: route,
        datePublished: toIso(published),
        dateModified: toIso(modified),
      }),
      mainHtml: `<article>${contentHtml || `<p>${escapeHtml(a?.excerpt || 'Article content loading…')}</p>`}</article>
      <h2>Related Guides &amp; Articles</h2>
      ${linkList(relatedLabeled)}
      ${toolCta}
      <p>Authoritative references: <a href="https://support.google.com/youtube/answer/72851" rel="noopener" target="_blank">YouTube Partner Program</a>, <a href="https://www.tiktok.com/creators" rel="noopener" target="_blank">TikTok Creators</a>, <a href="https://creators.instagram.com/" rel="noopener" target="_blank">Instagram Creators</a>.</p>`,
    });
  }

  const guide = route.match(/^\/platform-guides\/([^/]+)$/);
  if (guide) {
    const g = guidesBySlug.get(guide[1]);
    const rawText = typeof g?.content === 'string' ? g.content : g?.excerpt || '';
    const contentHtml = markdownToHtml(rawText);
    const clusterRelated = relatedPathsFor(route, 5);
    const fallbackRelated = guides
      .filter((x) => x.slug !== guide[1])
      .slice(0, 5)
      .map((x) => ({ href: `/platform-guides/${x.slug}`, label: x.title }));
    const related = clusterRelated.length ? clusterRelated : fallbackRelated;
    const oppLinks = linkOpportunitiesForText(`${g?.title || ''} ${g?.excerpt || ''} ${rawText}`, {
      excludePath: route,
      limit: 3,
    });
    return wrapRoot({
      h1: meta.h1,
      lead: g?.excerpt || '',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Platform Guides', href: '/platform-guides' },
        { name: truncate(meta.h1, 48), href: route },
      ],
      mainHtml: `<article>${contentHtml || `<p>${escapeHtml(g?.excerpt || 'Guide content loading…')}</p>`}</article>
      <h2>Related Guides &amp; Articles</h2>
      ${linkList(related)}
      ${
        oppLinks.length
          ? `<h2>Tools that pair with this guide</h2>${linkList(oppLinks)}`
          : ''
      }
      <p><a href="/blog">Browse the blog</a> · <a href="/faceless-content">Faceless Content Hub</a> · <a href="/tools/all">Creator tools</a></p>`,
    });
  }

  const tool = TOOL_DEFS.find((t) => t.path === route);
  if (tool) {
    const siblingTools = TOOL_DEFS.filter((t) => t.path !== tool.path && t.path !== '/tools/all').map(
      (t) => ({ href: t.path, label: t.title, excerpt: t.description }),
    );
    const faqHtml = tool.faqs?.length
      ? `<h2>FAQ</h2><dl>${tool.faqs
          .map(
            ([q, a]) =>
              `<dt>${escapeHtml(q)}</dt><dd>${escapeHtml(a)}</dd>`,
          )
          .join('\n')}</dl>`
      : '';
    return wrapRoot({
      h1: meta.h1,
      lead: tool.description,
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Tools', href: '/tools/all' },
        { name: tool.title, href: tool.path },
      ],
      jsonLd: `${toolAppJsonLd(tool)}${toolFaqJsonLd(tool)}`,
      mainHtml: `<h2>What this tool helps you decide</h2>
      <p>${escapeHtml(tool.longCopy || tool.description)}</p>
      <p>Use the interactive controls after the page loads. Pair results with a niche from the database and a platform playbook before you publish.</p>
      ${faqHtml}
      <h2>Related tools</h2>
      ${linkList(siblingTools)}
      <h2>Related resources</h2>
      ${linkList([
        { href: '/blog', label: 'Faceless content blog' },
        { href: '/resources/niches', label: 'Niche database' },
        { href: '/getting-started', label: 'Getting started guide' },
        { href: '/faceless-content', label: 'Faceless Content Hub' },
        { href: '/platform-guides', label: 'Platform guides' },
        { href: '/tools/all', label: 'All creator tools' },
      ])}`,
    });
  }

  // Generic static / marketing page — richer crawlable copy for Low Content scores
  const hubExtras = {
    '/': `<h2>What you can do here</h2>
      <p>ContentAnonymity teaches privacy-first faceless content: YouTube automation, TikTok and Instagram formats, monetization without relying on a single ad network, and free planning tools. Start with Getting Started, then pick a platform hub and a niche.</p>
      <h2>Start with these hubs</h2>`,
    '/getting-started': `<h2>Your first week</h2>
      <p>Choose a niche, pick one platform, draft a simple content system, and validate monetization paths before you scale tooling. Use the quiz and calculator to avoid guessing.</p>
      <h2>Core resources</h2>`,
    '/about': `<h2>Our approach</h2>
      <p>We publish practical, privacy-first education for anonymous creators. Guides emphasize verifiable workflows, platform policy awareness, and sustainable monetization—not hype.</p>
      <h2>Explore the library</h2>`,
    '/contact': `<h2>How to reach us</h2>
      <p>Use this page for support, partnerships, and editorial questions. For product how-tos, start with Getting Started and the Faceless Content Hub.</p>
      <h2>Helpful links</h2>`,
    '/faceless-content': `<h2>Faceless content pillars</h2>
      <p>This hub connects YouTube, monetization, AI workflows, and quality control so you can build a channel without showing your face—while staying aligned with platform rules.</p>
      <h2>Go deeper</h2>`,
  };
  const intro = hubExtras[route] || `<h2>Explore related guides</h2>
    <p>${escapeHtml(meta.description)}</p>`;

  return wrapRoot({
    h1: meta.h1,
    lead: meta.description,
    crumbs: [
      { name: 'Home', href: '/' },
      { name: meta.h1, href: route === '/' ? '/' : route },
    ],
    mainHtml: `${intro}
    ${linkList([
      { href: '/blog', label: 'Blog & guides' },
      { href: '/learning-paths', label: 'Learning paths' },
      { href: '/platform-guides', label: 'Platform guides' },
      { href: '/faceless-content', label: 'Faceless Content Hub' },
      { href: '/faceless-content/youtube', label: 'Faceless YouTube hub' },
      { href: '/faceless-content/monetization', label: 'Monetization hub' },
      { href: '/faceless-content/ai-workflows', label: 'AI workflows' },
      { href: '/faceless-content/quality-control', label: 'Quality control' },
      { href: '/tools/all', label: 'Creator tools' },
      { href: '/resources/niches', label: 'Niche database' },
      { href: '/getting-started', label: 'Getting started' },
      { href: '/learning/case-studies', label: 'Case studies' },
      { href: '/tools/calculator', label: 'Profitability calculator' },
      { href: '/tools/niche-quiz', label: 'Niche finder quiz' },
      { href: '/tools/seo-audit', label: 'SEO audit tool' },
      { href: '/tools/keyword-research', label: 'Keyword research' },
      { href: '/tools/backlink-checker', label: 'Backlink checker' },
      { href: '/tools/performance', label: 'Performance monitor' },
      { href: '/starter-kit', label: 'Starter kit' },
      { href: '/templates/faceless-youtube-script-template', label: 'YouTube script template' },
      { href: '/compare/best-ai-video-generators-for-faceless-content', label: 'AI video generator comparison' },
      { href: '/trust-and-safety', label: 'Trust & safety' },
    ])}`,
  });
}

function writeRouteHtml(route, html) {
  if (route === '/') {
    fs.writeFileSync(path.join(dist, 'index.html'), html, 'utf8');
    return;
  }
  const dir = path.join(dist, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

function injectRoot(shell, bodyHtml) {
  if (!/<div id="root"[^>]*>[\s\S]*?<\/div>/i.test(shell)) {
    throw new Error('Could not find <div id="root"> in shell HTML');
  }
  return shell.replace(
    /<div id="root"[^>]*>[\s\S]*?<\/div>/i,
    `<div id="root">${bodyHtml}</div>`,
  );
}

async function fetchConvexData() {
  const convexUrl =
    process.env.VITE_CONVEX_URL ||
    process.env.CONVEX_URL ||
    'https://fabulous-roadrunner-783.convex.cloud';
  const client = new ConvexHttpClient(convexUrl);
  const [rawArticles, rawGuides, rawNiches] = await Promise.all([
    client.query(api.articles.listAllVisible, { limit: 2000 }),
    client.query(api.platformGuides.list, { limit: 500 }),
    client.query(api.niches.list, {}),
  ]);
  let articles = (rawArticles || []).filter(isCanonicalArticle);
  const guides = (rawGuides || []).filter(isCanonicalGuide);
  const niches = Array.isArray(rawNiches) ? rawNiches : [];

  // Hydrate short/empty bodies via getBySlug (list payloads are sometimes truncated)
  const needBody = articles.filter((a) => String(a.content || '').trim().length < 400).slice(0, 80);
  if (needBody.length) {
    const enriched = await Promise.all(
      needBody.map(async (a) => {
        try {
          const full = await client.query(api.articles.getBySlug, { slug: a.slug });
          if (full && typeof full.content === 'string' && full.content.length > String(a.content || '').length) {
            return { ...a, content: full.content, excerpt: full.excerpt || a.excerpt, seoTitle: full.seoTitle || a.seoTitle, metaDescription: full.metaDescription || a.metaDescription };
          }
        } catch {
          /* keep list row */
        }
        return a;
      }),
    );
    const bySlug = new Map(enriched.map((a) => [a.slug, a]));
    articles = articles.map((a) => bySlug.get(a.slug) || a);
  }

  return { articles, guides, niches, convexUrl };
}

function appendNichesToSitemap(nicheSlugs) {
  if (!fs.existsSync(sitemapPath) || !nicheSlugs.length) return;
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  const additions = [];
  for (const slug of nicheSlugs.slice(0, 80)) {
    const loc = `${SITE}/niches/${slug}`;
    if (xml.includes(`<loc>${loc}</loc>`)) continue;
    additions.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }
  if (!additions.length) return;
  xml = xml.replace('</urlset>', `${additions.join('\n')}\n</urlset>`);
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  // Keep dist copy in sync when present
  const distSitemap = path.join(dist, 'sitemap.xml');
  if (fs.existsSync(path.dirname(distSitemap))) {
    fs.writeFileSync(distSitemap, xml, 'utf8');
  }
}

async function main() {
  const shell = loadShell();
  const routes = routesFromSitemap();
  // Still emit HTML for thin/noindex pages (excluded from sitemap) so nginx can serve them.
  for (const thin of THIN_NOINDEX) {
    if (!routes.includes(thin)) routes.push(thin);
  }
  // Always prerender indexable tools (even if sitemap was stale).
  for (const t of TOOL_DEFS) {
    if (!routes.includes(t.path)) routes.push(t.path);
  }

  let articles = [];
  let guides = [];
  let rawNiches = [];
  try {
    const data = await fetchConvexData();
    articles = data.articles;
    guides = data.guides;
    rawNiches = data.niches;
    console.log(
      `Convex OK (${data.convexUrl}): ${articles.length} articles, ${guides.length} guides, ${rawNiches.length} niches`,
    );
  } catch (err) {
    console.warn('⚠️ Convex fetch failed — writing head+hub stubs only:', err?.message || err);
  }

  const fallbackNiches = loadFallbackNicheRecords();
  // Public niche URLs = bundled slug dataset only (never Convex document ids)
  const niches = normalizeNichesForSeo(rawNiches, fallbackNiches).filter((n) =>
    fallbackNiches.some((f) => f.slug === n.slug),
  );
  console.log(`Niches for SEO: ${niches.length} slug URLs (fallback canonical)`);

  for (const n of niches) {
    const r = `/niches/${n.slug}`;
    if (!routes.includes(r)) routes.push(r);
  }
  appendNichesToSitemap(niches.map((n) => n.slug));

  console.log(`Prerender: ${routes.length} routes (${THIN_NOINDEX.size} thin/noindex included)`);

  const articlesBySlug = new Map(articles.map((a) => [a.slug, a]));
  const guidesBySlug = new Map(guides.map((g) => [g.slug, g]));
  const nichesBySlug = new Map(niches.map((n) => [n.slug, n]));
  const ctx = { articles, guides, niches, articlesBySlug, guidesBySlug, nichesBySlug };

  let written = 0;
  for (const route of routes) {
    const meta = metaForRoute(route, articlesBySlug, guidesBySlug, nichesBySlug);
    const body = bodyForRoute(route, meta, ctx);
    let html = applyHead(shell, meta);
    if (THIN_NOINDEX.has(route)) {
      html = replaceNamedMeta(html, 'robots', 'noindex, follow');
    }
    html = injectRoot(html, body);
    // Remove homepage-only noscript duplicate H1 on inner routes
    if (route !== '/') {
      html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, '');
    }
    writeRouteHtml(route, html);
    written++;
  }

  // T1.3 — static 404.html (nginx error_page / host 404)
  const notFoundBody = wrapRoot({
    h1: 'Page Not Found',
    lead: 'This URL does not exist. Try one of these hubs instead.',
    crumbs: [
      { name: 'Home', href: '/' },
      { name: '404', href: '/404' },
    ],
    mainHtml: linkList([
      { href: '/blog', label: 'Blog & guides' },
      { href: '/platform-guides', label: 'Platform guides' },
      { href: '/tools/all', label: 'Creator tools' },
      { href: '/getting-started', label: 'Getting started' },
      { href: '/resources/niches', label: 'Niche database' },
    ]),
  });
  let notFoundHtml = applyHead(shell, {
    title: brandTitle('404 - Page Not Found'),
    description: 'The page you requested was not found. Explore faceless content guides and tools on ContentAnonymity.',
    canonical: `${SITE}/404`,
    type: 'website',
  });
  notFoundHtml = replaceNamedMeta(notFoundHtml, 'robots', 'noindex, follow');
  notFoundHtml = injectRoot(notFoundHtml, notFoundBody);
  notFoundHtml = notFoundHtml.replace(/<noscript>[\s\S]*?<\/noscript>/i, '');
  fs.writeFileSync(path.join(dist, '404.html'), notFoundHtml, 'utf8');
  console.log(`✅ Prerendered ${written} HTML files under dist/ (+ 404.html)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
