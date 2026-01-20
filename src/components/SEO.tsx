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
  const fullTitle = title.includes('ContentAnonymity') ? title : `${title} | ContentAnonymity`;
  const canonicalUrl = canonical || url;
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : type === 'product' ? 'Product' : 'WebPage',
    name: title,
    description: description,
    url: canonicalUrl,
    image: image,
    publisher: {
      '@type': 'Organization',
      name: 'ContentAnonymity',
      url: 'https://contentanonymity.com',
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
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description.length > 160 ? description.substring(0, 157) + '...' : description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description.length > 200 ? description.substring(0, 197) + '...' : description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="ContentAnonymity" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description.length > 200 ? description.substring(0, 197) + '...' : description} />
      <meta name="twitter:image" content={image} />

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

