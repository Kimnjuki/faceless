module.exports = {
  source: 'dist',
  destination: 'dist',
  include: [
    '/',
    '/getting-started',
    '/blog',
    '/tools/all',
    '/tools/calculator',
    '/tools/niche-quiz',
    '/privacy-policy',
    '/terms-of-service',
  ],
  minifyHtml: {
    collapseWhitespace: false,
    removeComments: false,
  },
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  skipThirdPartyRequests: true,
  cacheAjaxRequests: false,
  removeScriptTags: false,
  removeStyleTags: false,
  // Wait for React to hydrate
  waitFor: 1000,
  // Crawl from these pages
  crawlFrom: '/',
  // Don't pre-render authenticated pages
  skipThirdPartyRequests: true,
};

