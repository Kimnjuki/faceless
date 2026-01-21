// SEO Auditor Utility - Screaming Frog Alternative
// Performs technical SEO checks on pages

export interface SEOAuditResult {
  url: string;
  title: string;
  h1Count: number;
  h1Text: string[];
  metaDescription: string;
  metaDescriptionLength: number;
  imageCount: number;
  imagesWithoutAlt: number;
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  loadTime: number;
  issues: SEOIssue[];
  score: number;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  page: string;
  fix?: string;
  severity: number; // 0-100, higher = more critical
}

/**
 * Perform SEO audit on a given URL
 * In production, this would make an API call to crawl the page
 */
export async function auditPage(url: string): Promise<SEOAuditResult> {
  // This is a client-side audit - in production, you'd want a server-side crawler
  const issues: SEOIssue[] = [];
  let score = 100;

  // Get page title
  const title = document.title || '';
  if (!title) {
    issues.push({
      type: 'error',
      message: 'Missing page title',
      page: url,
      fix: 'Add a descriptive title tag (50-60 characters)',
      severity: 10
    });
    score -= 10;
  } else if (title.length > 60) {
    issues.push({
      type: 'warning',
      message: 'Title tag too long',
      page: url,
      fix: 'Shorten title to 60 characters or less for optimal display',
      severity: 5
    });
    score -= 5;
  }

  // Check H1 tags
  const h1Elements = Array.from(document.querySelectorAll('h1'));
  const h1Count = h1Elements.length;
  const h1Text = h1Elements.map(h1 => h1.textContent || '').filter(Boolean);

  if (h1Count === 0) {
    issues.push({
      type: 'error',
      message: 'Missing H1 heading',
      page: url,
      fix: 'Add a single H1 heading to your page',
      severity: 10
    });
    score -= 10;
  } else if (h1Count > 1) {
    issues.push({
      type: 'warning',
      message: `Multiple H1 headings found (${h1Count})`,
      page: url,
      fix: 'Use only one H1 per page. Use H2-H6 for subheadings',
      severity: 5
    });
    score -= 5;
  }

  // Check meta description
  const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
  const metaDescription = metaDesc?.content || '';
  const metaDescriptionLength = metaDescription.length;

  if (metaDescriptionLength === 0) {
    issues.push({
      type: 'error',
      message: 'Missing meta description',
      page: url,
      fix: 'Add a meta description between 120-160 characters',
      severity: 10
    });
    score -= 10;
  } else if (metaDescriptionLength < 120) {
    issues.push({
      type: 'warning',
      message: 'Meta description too short',
      page: url,
      fix: 'Expand meta description to 120-160 characters for better CTR',
      severity: 5
    });
    score -= 5;
  } else if (metaDescriptionLength > 160) {
    issues.push({
      type: 'warning',
      message: 'Meta description too long',
      page: url,
      fix: 'Shorten meta description to 160 characters or less',
      severity: 3
    });
    score -= 3;
  }

  // Check images
  const images = Array.from(document.querySelectorAll('img'));
  const imageCount = images.length;
  const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '').length;

  if (imagesWithoutAlt > 0) {
    issues.push({
      type: 'warning',
      message: `${imagesWithoutAlt} images missing alt text`,
      page: url,
      fix: 'Add descriptive alt text to all images for accessibility and SEO',
      severity: imagesWithoutAlt * 2
    });
    score -= Math.min(20, imagesWithoutAlt * 2);
  }

  // Estimate word count (rough calculation)
  const bodyText = document.body.innerText || '';
  const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;

  if (wordCount < 300) {
    issues.push({
      type: 'warning',
      message: 'Low word count',
      page: url,
      fix: 'Aim for at least 300 words. 800+ words is ideal for SEO',
      severity: 5
    });
    score -= 5;
  }

  // Check links
  const allLinks = Array.from(document.querySelectorAll('a'));
  const internalLinks = allLinks.filter(link => {
    const href = link.getAttribute('href') || '';
    return href.startsWith('/') || href.includes(window.location.hostname);
  }).length;
  const externalLinks = allLinks.length - internalLinks;

  // Measure load time (if available from Performance API)
  let loadTime = 0;
  if (window.performance && window.performance.timing) {
    const perf = window.performance.timing;
    loadTime = (perf.loadEventEnd - perf.navigationStart) / 1000;
  }

  if (loadTime > 3) {
    issues.push({
      type: 'error',
      message: 'Slow page load time',
      page: url,
      fix: 'Optimize images, enable compression, and minimize JavaScript',
      severity: 15
    });
    score -= 15;
  } else if (loadTime > 2.5) {
    issues.push({
      type: 'warning',
      message: 'Page load time could be improved',
      page: url,
      fix: 'Consider optimizing images and reducing JavaScript bundle size',
      severity: 5
    });
    score -= 5;
  }

  return {
    url,
    title,
    h1Count,
    h1Text,
    metaDescription,
    metaDescriptionLength,
    imageCount,
    imagesWithoutAlt,
    wordCount,
    internalLinks,
    externalLinks,
    loadTime,
    issues: issues.sort((a, b) => b.severity - a.severity),
    score: Math.max(0, score)
  };
}

/**
 * Check if URL is accessible and returns valid HTML
 */
export async function checkUrlAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return true;
  } catch {
    return false;
  }
}


