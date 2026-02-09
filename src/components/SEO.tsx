import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'course' | 'tool' | 'event';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: object | object[];
  faqData?: Array<{ question: string; answer: string }>;
  reviewData?: {
    rating?: number;
    reviewCount?: number;
    bestRating?: number;
    worstRating?: number;
  };
  howToData?: {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string; image?: string; url?: string }>;
  };
  softwareApplication?: {
    name: string;
    description: string;
    applicationCategory: string;
    operatingSystem: string;
    offers?: {
      price: string;
      priceCurrency: string;
    };
  };
  /** BreadcrumbList schema - use on all pages except homepage */
  breadcrumbItems?: Array<{ name: string; url: string }>;
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
  faqData,
  reviewData,
  howToData,
  softwareApplication,
  breadcrumbItems,
}: SEOProps) {
  // Enforce < 60 characters for title (SEO best practice)
  const truncatedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const fullTitle = truncatedTitle.includes('ContentAnonymity') ? truncatedTitle : `${truncatedTitle} | ContentAnonymity`;
  
  // Enforce < 60 characters for full title (with site name)
  const finalTitle = fullTitle.length > 60 ? fullTitle.substring(0, 57) + '...' : fullTitle;
  
  // Enforce 155-160 characters for description (Google SERP display) and add strong CTA if missing
  let finalDescription = description;
  if (finalDescription.length > 160) {
    finalDescription = finalDescription.substring(0, 157) + '...';
  }
  const hasCTA = /(start|try|get|learn|join|discover|master|build|today|free|now)/i.test(finalDescription);
  if (!hasCTA && finalDescription.length < 145) {
    finalDescription += ' Start building today.';
  }
  
  // Always generate canonical URL - use provided canonical, or construct from url, or default to homepage
  // Normalize: remove trailing slash (except for homepage) to fix "Duplicate pages without canonical"
  const rawCanonical = canonical || url || 'https://contentanonymity.com';
  const canonicalUrl = rawCanonical.replace(/\/+$/, '') || rawCanonical;
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

  // Build comprehensive structured data
  const buildStructuredData = () => {
    const schemas: object[] = [];

    // Base Organization schema (always included)
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ContentAnonymity',
      url: 'https://contentanonymity.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://contentanonymity.com/logo-icon.svg',
      },
      description: 'The definitive platform for anonymous digital entrepreneurship. Build profitable faceless content businesses with AI automation and complete privacy.',
      sameAs: [
        'https://twitter.com/contentanonymity',
        'https://www.youtube.com/@contentanonymity',
        'https://www.linkedin.com/company/contentanonymity',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'support@contentanonymity.com',
      },
    };

    // WebSite schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ContentAnonymity',
      url: 'https://contentanonymity.com',
      description: 'The definitive platform for anonymous digital entrepreneurship.',
      publisher: {
        '@type': 'Organization',
        name: 'ContentAnonymity',
        logo: {
          '@type': 'ImageObject',
          url: 'https://contentanonymity.com/logo-icon.svg',
        },
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://contentanonymity.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    };

    schemas.push(organizationSchema, websiteSchema);

    // BreadcrumbList Schema (all pages except homepage)
    if (breadcrumbItems && breadcrumbItems.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://contentanonymity.com' },
          ...breadcrumbItems.map((item, i) => ({
            '@type': 'ListItem' as const,
            position: i + 2,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `https://contentanonymity.com${item.url}`,
          })),
        ],
      };
      schemas.push(breadcrumbSchema);
    }

    // FAQ Schema
    if (faqData && faqData.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqData.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };
      schemas.push(faqSchema);
    }

    // Review Schema
    if (reviewData) {
      const reviewSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: finalTitle,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: reviewData.rating || 5,
          reviewCount: reviewData.reviewCount || 0,
          bestRating: reviewData.bestRating || 5,
          worstRating: reviewData.worstRating || 1,
        },
      };
      schemas.push(reviewSchema);
    }

    // HowTo Schema
    if (howToData) {
      const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: howToData.name,
        description: howToData.description,
        step: howToData.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
          ...(step.url && { url: step.url }),
          ...(step.image && {
            image: {
              '@type': 'ImageObject',
              url: step.image,
            },
          }),
        })),
      };
      schemas.push(howToSchema);
    }

    // SoftwareApplication Schema
    if (softwareApplication) {
      const softwareSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: softwareApplication.name,
        description: softwareApplication.description,
        applicationCategory: softwareApplication.applicationCategory,
        operatingSystem: softwareApplication.operatingSystem,
        offers: softwareApplication.offers || {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: reviewData ? {
          '@type': 'AggregateRating',
          ratingValue: reviewData.rating || 5,
          reviewCount: reviewData.reviewCount || 0,
        } : undefined,
      };
      schemas.push(softwareSchema);
    }

    // Article/BlogPosting Schema
    if (type === 'article' && publishedTime) {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: finalTitle,
        description: finalDescription,
        image: image,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        author: {
          '@type': 'Person',
          name: author || 'ContentAnonymity',
        },
        publisher: {
          '@type': 'Organization',
          name: 'ContentAnonymity',
          logo: {
            '@type': 'ImageObject',
            url: 'https://contentanonymity.com/logo-icon.svg',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      };
      schemas.push(articleSchema);

      // Also add BlogPosting
      const blogPostingSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: finalTitle,
        description: finalDescription,
        image: image,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        author: {
          '@type': 'Person',
          name: author || 'ContentAnonymity',
        },
        publisher: {
          '@type': 'Organization',
          name: 'ContentAnonymity',
          logo: {
            '@type': 'ImageObject',
            url: 'https://contentanonymity.com/logo-icon.svg',
          },
        },
      };
      schemas.push(blogPostingSchema);
    }

    // Course Schema
    if (type === 'course') {
      const courseSchema = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: finalTitle,
        description: finalDescription,
        provider: {
          '@type': 'Organization',
          name: 'ContentAnonymity',
          url: 'https://contentanonymity.com',
        },
      };
      schemas.push(courseSchema);
    }

    // Use custom structured data if provided, but always merge BreadcrumbList when breadcrumbItems given
    if (structuredData) {
      const customSchemas = Array.isArray(structuredData) ? structuredData : [structuredData];
      if (breadcrumbItems && breadcrumbItems.length > 0) {
        const breadcrumbSchema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://contentanonymity.com' },
            ...breadcrumbItems.map((item, i) => ({
              '@type': 'ListItem' as const,
              position: i + 2,
              name: item.name,
              item: item.url.startsWith('http') ? item.url : `https://contentanonymity.com${item.url}`,
            })),
          ],
        };
        return [breadcrumbSchema, ...customSchemas];
      }
      return customSchemas;
    }

    // Fallback to base structured data if no schemas were built
    return schemas.length > 0 ? schemas : [baseStructuredData];
  };

  const allStructuredData = buildStructuredData();

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

      {/* Open Graph / Facebook - Enhanced */}
      <meta property="og:type" content={type === 'article' ? 'article' : type === 'product' ? 'product' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:site_name" content="ContentAnonymity" />
      <meta property="og:locale" content="en_US" />
      {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === 'article' && author && <meta property="article:author" content={author} />}
      {type === 'article' && <meta property="article:section" content="Faceless Content Creation" />}
      {keywords && <meta property="og:keywords" content={keywords} />}

      {/* Twitter Card - Enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={finalTitle} />
      <meta name="twitter:site" content="@contentanonymity" />
      <meta name="twitter:creator" content="@contentanonymity" />
      <meta name="twitter:domain" content="contentanonymity.com" />

      {/* Structured Data - Multiple schemas */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

