import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'course' | 'tool';
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
    steps: Array<{ name: string; text: string; image?: string }>;
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

    // Use custom structured data if provided, otherwise use built schemas
    if (structuredData) {
      return Array.isArray(structuredData) ? structuredData : [structuredData];
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

      {/* Structured Data - Multiple schemas */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

