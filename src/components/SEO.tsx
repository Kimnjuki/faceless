import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: object | object[];
}

export default function SEO({
  title = 'ContentAnonymity - Build Your Faceless Content Empire',
  description = 'Build profitable faceless content businesses with AI automation. Complete platform for anonymous digital entrepreneurship. Join 10,000+ creators earning 6-figures anonymously.',
  keywords = 'faceless content, anonymous content creator, content anonymity, faceless business, AI content creation',
  image = 'https://contentanonymity.com/og-image.jpg',
  url = 'https://contentanonymity.com',
  type = 'website',
  author = 'ContentAnonymity',
  publishedTime,
  modifiedTime,
  canonical,
  noindex = false,
  structuredData,
}: SEOProps) {
  // Enforce < 60 characters for title (SEO best practice)
  const truncatedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const fullTitle = truncatedTitle.includes('ContentAnonymity') ? truncatedTitle : `${truncatedTitle} | ContentAnonymity`;
  
  // Enforce < 60 characters for full title (with site name)
  const finalTitle = fullTitle.length > 60 ? fullTitle.substring(0, 57) + '...' : fullTitle;
  
  // Enforce < 155 characters for description and add CTA if missing
  let finalDescription = description;
  if (finalDescription.length > 155) {
    finalDescription = finalDescription.substring(0, 152) + '...';
  }
  // Add CTA if description doesn't end with action words
  const hasCTA = /(free|start|try|get|download|click|learn|join|sign up|anonymize|use|calculate)/i.test(finalDescription);
  if (!hasCTA && finalDescription.length < 140) {
    finalDescription += ' Start free today.';
  }
  
  const canonicalUrl = canonical || url;
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : type === 'product' ? 'Product' : 'WebPage',
    name: finalTitle,
    description: finalDescription,
    url: canonicalUrl,
    image: image,
    publisher: {
      '@type': 'Organization',
      name: 'ContentAnonymity',
      url: 'https://contentanonymity.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://contentanonymity.com/logo-icon.svg'
      }
    },
  };

  const articleStructuredData = type === 'article' && publishedTime ? {
    ...baseStructuredData,
    '@type': 'Article',
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
  } : null;

  const finalStructuredData = structuredData || articleStructuredData || baseStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="ContentAnonymity" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@contentanonymity" />
      <meta name="twitter:creator" content="@contentanonymity" />

      {/* Structured Data */}
      {Array.isArray(structuredData) ? (
        structuredData.map((data, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(data)}
          </script>
        ))
      ) : (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      )}
    </Helmet>
  );
}

