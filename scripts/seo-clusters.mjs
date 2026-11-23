/** Mirror of src/config/seoClusters.ts for Node build scripts (no TS loader). */

export const SEO_CLUSTERS = [
  {
    id: 'youtube-faceless-getting-started',
    hub: '/faceless-content/youtube',
    hubLabel: 'Faceless YouTube Hub',
    spokes: [
      '/blog/faceless-youtube-blueprint-2025',
      '/blog/faceless-youtube-channel-guide-2026',
      '/platform-guides/faceless-youtube-setup-2025',
      '/blog/how-to-start-faceless-youtube-ai-voiceover-2026',
      '/platform-guides/youtube-faceless-strategy',
      '/blog/faceless-strategy-playbook-2025',
      '/blog/youtube-automation-strategy-2025',
    ],
  },
  {
    id: 'monetize-without-adsense',
    hub: '/faceless-content/monetization',
    hubLabel: 'Faceless Monetization Hub',
    spokes: [
      '/blog/how-to-monetize-faceless-channel-without-adsense',
      '/blog/monetize-faceless-channel-without-ads-2026',
      '/blog/youtube-monetization-ai-faceless-policy-2026',
    ],
  },
  {
    id: 'ai-tools-reviews',
    hub: '/tools/all',
    hubLabel: 'Creator Tools',
    spokes: [
      '/blog/ultimate-top-10-ai-faceless-content-tools-review',
      '/blog/top-10-ai-video-generators-2026',
    ],
  },
  {
    id: 'tiktok',
    hub: '/platform-guides',
    hubLabel: 'Platform Guides',
    spokes: [
      '/blog/tiktok-growth-strategy-faceless',
      '/blog/automate-faceless-tiktok-guide-2026',
      '/platform-guides/tiktok-faceless-virality',
      '/platform-guides/tiktok-account-warming-strategy',
      '/blog/tiktok-shop-faceless-creator-strategy-2026',
    ],
  },
  {
    id: 'instagram',
    hub: '/platform-guides',
    hubLabel: 'Platform Guides',
    spokes: [
      '/blog/instagram-reels-faceless-brand',
      '/platform-guides/instagram-faceless-aesthetic',
      '/platform-guides/instagram-reels-monetization',
      '/blog/how-to-create-ai-influencers-instagram-2026',
    ],
  },
  {
    id: 'niche-selection',
    hub: '/resources/niches',
    hubLabel: 'Niche Database',
    spokes: [
      '/blog/best-faceless-youtube-niches-2026-ultimate-guide',
      '/blog/niche-idea-generator-guide',
      '/blog/horror-story-channel-case-study',
      '/blog/stoic-philosophy-faceless-niche-2026',
      '/blog/luxury-lifestyle-faceless-high-cpm-2026',
    ],
  },
];

function titleFromPath(p) {
  const slug = p.split('/').filter(Boolean).pop() || p;
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function relatedPathsFor(path, limit = 5) {
  const clean = path.replace(/\/+$/, '') || '/';
  const clusters = SEO_CLUSTERS.filter((c) => c.hub === clean || c.spokes.includes(clean));
  const out = [];
  const seen = new Set([clean]);
  for (const c of clusters) {
    if (!seen.has(c.hub)) {
      seen.add(c.hub);
      out.push({ href: c.hub, label: c.hubLabel });
    }
    for (const spoke of c.spokes) {
      if (seen.has(spoke)) continue;
      seen.add(spoke);
      out.push({ href: spoke, label: titleFromPath(spoke) });
      if (out.length >= limit) return out;
    }
  }
  return out;
}
