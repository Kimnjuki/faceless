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

/** Placeholder / thin routes — noindex until populated (T4.3). */
const THIN_NOINDEX = new Set([
  '/products/all',
  '/news',
  '/community/challenges',
  '/community/events',
  '/community/members',
  '/learning-paths',
  '/learning/workshops',
  '/learning/resources',
  '/resources/templates',
  '/tools/backlink-checker',
  '/tools/seo-audit',
  '/tools/keyword-research',
  '/tools/performance',
]);

const TOOL_DEFS = [
  { path: '/tools/calculator', title: 'Profitability Calculator', description: 'Estimate faceless channel revenue scenarios with transparent assumptions.' },
  { path: '/tools/niche-quiz', title: 'Niche Finder Quiz', description: 'Find a faceless niche that matches your skills, risk tolerance, and goals.' },
  { path: '/tools/seo-audit', title: 'SEO Audit Tool', description: 'Check on-page SEO signals for your faceless content pages.' },
  { path: '/tools/keyword-research', title: 'Keyword Research', description: 'Discover keywords and topics for anonymous content channels.' },
  { path: '/tools/backlink-checker', title: 'Backlink Checker', description: 'Inspect referring domains and link patterns for your site.' },
  { path: '/tools/performance', title: 'Performance Monitor', description: 'Track Core Web Vitals and page speed for creator sites.' },
  { path: '/tools/all', title: 'All Creator Tools', description: 'Free tools for faceless creators: calculator, niche quiz, SEO, and more.' },
];

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

/** Keep brand suffix intact while staying <= 60 chars. */
function brandTitle(headline) {
  const suffix = ' | ContentAnonymity';
  const h = String(headline ?? '').trim();
  if (!h) return truncate(`ContentAnonymity${suffix}`, 60);
  if (h.includes('ContentAnonymity')) return truncate(h, 60);
  if ((h + suffix).length <= 60) return h + suffix;
  return `${truncate(h, 60 - suffix.length)}${suffix}`;
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

function markdownToHtml(md) {
  if (!md || typeof md !== 'string') return '';
  const trimmed = md.trim();
  if (trimmed.startsWith('<') && /<\/[a-z]+>/i.test(trimmed)) {
    // Already HTML-ish — strip scripts only
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
  return fs.readFileSync(shellPath, 'utf8');
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
  <a href="/platform-guides">Platform Guides</a> ·
  <a href="/faceless-content">Faceless Content</a> ·
  <a href="/faceless-content/youtube">YouTube</a> ·
  <a href="/faceless-content/monetization">Monetization</a> ·
  <a href="/tools/all">Tools</a> ·
  <a href="/learning/case-studies">Case Studies</a> ·
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
    <a href="/learning-paths">Learning Paths</a> ·
    <a href="/learning/workshops">Workshops</a> ·
    <a href="/learning/resources">Resources</a> ·
    <a href="/resources/templates">Templates</a> ·
    <a href="/products/all">Products</a> ·
    <a href="/news">News</a>
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

function wrapRoot({ h1, lead, mainHtml, crumbs }) {
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

function metaForRoute(route, articlesBySlug, guidesBySlug) {
  if (STATIC_PAGE_META[route]) {
    const m = STATIC_PAGE_META[route];
    return {
      title: brandTitle(m.title),
      description: truncate(m.description, 160),
      canonical: route === '/' ? `${SITE}/` : `${SITE}${route}`,
      type: 'website',
      h1: m.h1,
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
    return {
      title: brandTitle(headline),
      description: truncate(description, 160),
      canonical: `${SITE}${route}`,
      type: 'article',
      h1: a?.title || headline,
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
      description: truncate(description, 160),
      canonical: `${SITE}${route}`,
      type: 'article',
      h1: headline,
    };
  }

  const tool = TOOL_DEFS.find((t) => t.path === route);
  if (tool) {
    return {
      title: brandTitle(tool.title),
      description: truncate(tool.description, 160),
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
      160,
    ),
    canonical: `${SITE}${route}`,
    type: 'website',
    h1: headline,
  };
}

function bodyForRoute(route, meta, ctx) {
  const { articles, guides, niches, articlesBySlug, guidesBySlug } = ctx;

  if (route === '/blog') {
    return wrapRoot({
      h1: meta.h1,
      lead: 'All published guides and articles for faceless creators.',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
      ],
      mainHtml: linkList(
        articles.map((a) => ({
          href: `/blog/${a.slug}`,
          label: a.title,
          excerpt: a.excerpt,
        })),
      ),
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
    const items = niches.slice(0, 200).map((n) => {
      const id = n.legacyId || n._id;
      return {
        href: `/niches/${id}`,
        label: n.nicheName || 'Niche',
        excerpt: n.description,
      };
    });
    return wrapRoot({
      h1: meta.h1,
      lead: 'Browse niches suited to faceless and AI-assisted content.',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Niches', href: '/resources/niches' },
      ],
      mainHtml: linkList(items),
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
    const contentHtml = markdownToHtml(typeof a?.content === 'string' ? a.content : a?.excerpt || '');
    const clusterRelated = relatedPathsFor(route, 5);
    const fallbackRelated = articles
      .filter((x) => x.slug !== blog[1])
      .slice(0, 5)
      .map((x) => ({ href: `/blog/${x.slug}`, label: x.title }));
    const related = clusterRelated.length ? clusterRelated : fallbackRelated;
    const labelByHref = new Map(
      articles.map((x) => [`/blog/${x.slug}`, x.title]),
    );
    const relatedLabeled = related.map((r) => ({
      href: r.href,
      label: labelByHref.get(r.href) || r.label,
    }));
    return wrapRoot({
      h1: meta.h1,
      lead: a?.excerpt || '',
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: truncate(meta.h1, 48), href: route },
      ],
      mainHtml: `<article>${contentHtml || `<p>${escapeHtml(a?.excerpt || 'Article content loading…')}</p>`}</article>
      <h2>Related Guides &amp; Articles</h2>
      ${linkList(relatedLabeled)}
      <p><a href="/tools/calculator">Next step: try the Profitability Calculator</a> · <a href="/tools/niche-quiz">or the Niche Finder Quiz</a></p>
      <p>Authoritative references: <a href="https://support.google.com/youtube/answer/72851" rel="noopener" target="_blank">YouTube Partner Program</a>, <a href="https://www.tiktok.com/creators" rel="noopener" target="_blank">TikTok Creators</a>, <a href="https://creators.instagram.com/" rel="noopener" target="_blank">Instagram Creators</a>.</p>`,
    });
  }

  const guide = route.match(/^\/platform-guides\/([^/]+)$/);
  if (guide) {
    const g = guidesBySlug.get(guide[1]);
    const contentHtml = markdownToHtml(typeof g?.content === 'string' ? g.content : g?.excerpt || '');
    const clusterRelated = relatedPathsFor(route, 5);
    const fallbackRelated = guides
      .filter((x) => x.slug !== guide[1])
      .slice(0, 5)
      .map((x) => ({ href: `/platform-guides/${x.slug}`, label: x.title }));
    const related = clusterRelated.length ? clusterRelated : fallbackRelated;
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
      <p><a href="/blog">Browse the blog</a> · <a href="/faceless-content">Faceless Content Hub</a></p>`,
    });
  }

  const tool = TOOL_DEFS.find((t) => t.path === route);
  if (tool) {
    return wrapRoot({
      h1: meta.h1,
      lead: tool.description,
      crumbs: [
        { name: 'Home', href: '/' },
        { name: 'Tools', href: '/tools/all' },
        { name: tool.title, href: tool.path },
      ],
      mainHtml: `<p>Use this tool interactively after the page loads. Related resources:</p>
      ${linkList([
        { href: '/blog', label: 'Faceless content blog' },
        { href: '/resources/niches', label: 'Niche database' },
        { href: '/getting-started', label: 'Getting started guide' },
      ])}`,
    });
  }

  // Generic static / marketing page
  return wrapRoot({
    h1: meta.h1,
    lead: meta.description,
    crumbs: [
      { name: 'Home', href: '/' },
      { name: meta.h1, href: route === '/' ? '/' : route },
    ],
    mainHtml: `<p>Explore:</p>
    ${linkList([
      { href: '/blog', label: 'Blog & guides' },
      { href: '/platform-guides', label: 'Platform guides' },
      { href: '/tools/all', label: 'Creator tools' },
      { href: '/resources/niches', label: 'Niche database' },
      { href: '/getting-started', label: 'Getting started' },
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
  const articles = (rawArticles || []).filter(isCanonicalArticle);
  const guides = (rawGuides || []).filter(isCanonicalGuide);
  const niches = Array.isArray(rawNiches) ? rawNiches : [];
  return { articles, guides, niches, convexUrl };
}

async function main() {
  const shell = loadShell();
  const routes = routesFromSitemap();
  // Still emit HTML for thin/noindex pages (excluded from sitemap) so nginx can serve them.
  for (const thin of THIN_NOINDEX) {
    if (!routes.includes(thin)) routes.push(thin);
  }
  console.log(`Prerender: ${routes.length} routes (${THIN_NOINDEX.size} thin/noindex included)`);

  let articles = [];
  let guides = [];
  let niches = [];
  try {
    const data = await fetchConvexData();
    articles = data.articles;
    guides = data.guides;
    niches = data.niches;
    console.log(
      `Convex OK (${data.convexUrl}): ${articles.length} articles, ${guides.length} guides, ${niches.length} niches`,
    );
  } catch (err) {
    console.warn('⚠️ Convex fetch failed — writing head+hub stubs only:', err?.message || err);
  }

  const articlesBySlug = new Map(articles.map((a) => [a.slug, a]));
  const guidesBySlug = new Map(guides.map((g) => [g.slug, g]));
  const ctx = { articles, guides, niches, articlesBySlug, guidesBySlug };

  let written = 0;
  for (const route of routes) {
    const meta = metaForRoute(route, articlesBySlug, guidesBySlug);
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
