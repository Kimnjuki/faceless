/**
 * Ahrefs-style internal link opportunities:
 * Match high-intent keyword mentions on source pages → link to target money/tool pages.
 */
export const LINK_OPPORTUNITIES = [
  {
    href: '/tools/seo-audit',
    label: 'free SEO audit tool',
    patterns: [/seo audit/i, /technical seo/i, /on-page seo/i, /seo checker/i, /seo score/i],
  },
  {
    href: '/tools/keyword-research',
    label: 'keyword research tool',
    patterns: [/keyword research/i, /find keywords/i, /search volume/i, /keyword ideas/i],
  },
  {
    href: '/tools/backlink-checker',
    label: 'backlink checker',
    patterns: [/backlink/i, /referring domain/i, /link building/i, /inbound links/i],
  },
  {
    href: '/tools/performance',
    label: 'performance monitor',
    patterns: [/core web vitals/i, /page speed/i, /lighthouse/i, /site performance/i, /loading time/i],
  },
  {
    href: '/tools/calculator',
    label: 'profitability calculator',
    patterns: [/cpm/i, /revenue estimate/i, /channel income/i, /monetiz/i, /earn(ings)?/i],
  },
  {
    href: '/tools/niche-quiz',
    label: 'niche finder quiz',
    patterns: [/find (a |your )?niche/i, /niche (idea|selection|quiz)/i, /pick a niche/i],
  },
  {
    href: '/faceless-content/youtube',
    label: 'faceless YouTube hub',
    patterns: [/faceless youtube/i, /youtube automation/i, /youtube without (showing|your) face/i],
  },
  {
    href: '/faceless-content/monetization',
    label: 'faceless monetization hub',
    patterns: [/monetize without adsense/i, /affiliate.*faceless/i, /digital product/i],
  },
  {
    href: '/resources/niches',
    label: 'niche database',
    patterns: [/niche database/i, /best niches/i, /faceless niches/i],
  },
  {
    href: '/getting-started',
    label: 'getting started guide',
    patterns: [/getting started/i, /how to start/i, /first channel/i],
  },
];

export function linkOpportunitiesForText(text, { excludePath, limit = 4 } = {}) {
  const hay = String(text || '');
  const hits = [];
  for (const opp of LINK_OPPORTUNITIES) {
    if (excludePath && opp.href === excludePath) continue;
    if (opp.patterns.some((re) => re.test(hay))) {
      hits.push({ href: opp.href, label: opp.label });
    }
    if (hits.length >= limit) break;
  }
  return hits;
}
