// Generate dynamic sitemap.xml for ContentAnonymity.com
// Run this script to generate/update sitemap.xml
// Usage: node scripts/generate-sitemap.js

const fs = require('fs');
const path = require('path');

// Base URL
const BASE_URL = 'https://contentanonymity.com';

// Static pages with priority and changefreq
const staticPages = [
  { url: '', priority: '1.0', changefreq: 'weekly' },
  { url: '/getting-started', priority: '0.9', changefreq: 'monthly' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/tools/all', priority: '0.8', changefreq: 'monthly' },
  { url: '/tools/calculator', priority: '0.8', changefreq: 'monthly' },
  { url: '/tools/niche-quiz', priority: '0.8', changefreq: 'monthly' },
  { url: '/tools/seo-audit', priority: '0.7', changefreq: 'monthly' },
  { url: '/tools/keyword-research', priority: '0.7', changefreq: 'monthly' },
  { url: '/tools/backlink-checker', priority: '0.7', changefreq: 'monthly' },
  { url: '/tools/performance', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { url: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
  { url: '/learning-paths', priority: '0.8', changefreq: 'monthly' },
  { url: '/platform-guides', priority: '0.8', changefreq: 'monthly' },
];

// Generate sitemap XML
function generateSitemap(articles = []) {
  const now = new Date().toISOString();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add blog articles
  articles.forEach(article => {
    if (article.slug && article.status === 'published') {
      const lastmod = article.updated_at || article.published_at || now;
      sitemap += `  <url>
    <loc>${BASE_URL}/blog/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }
  });

  sitemap += `</urlset>`;

  return sitemap;
}

// Main function
async function main() {
  try {
    // For now, generate sitemap with static pages only
    // In production, you would fetch articles from Supabase here
    const sitemap = generateSitemap([]);
    
    // Write to public/sitemap.xml
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    
    console.log('✅ Sitemap generated successfully!');
    console.log(`📄 Location: ${sitemapPath}`);
    console.log(`📊 Total URLs: ${staticPages.length}`);
    console.log('\n💡 To include articles, fetch from Supabase and pass to generateSitemap()');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateSitemap };


