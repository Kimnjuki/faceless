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
  puppeteerArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
  ],
  skipThirdPartyRequests: true,
  cacheAjaxRequests: false,
  removeScriptTags: false,
  removeStyleTags: false,
  // Wait for React to hydrate and content to load
  waitFor: 2000,
  // Crawl from these pages
  crawlFrom: '/',
  // Fix external links
  fixWebpackChunksIssue: false,
  // Headless browser options
  headless: true,
  // Timeout for page load
  timeout: 30000,
};

