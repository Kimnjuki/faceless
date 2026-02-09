/**
 * Breadcrumb Navigation Component
 * 
 * Provides hierarchical navigation with JSON-LD BreadcrumbList schema
 * for better SEO and user experience
 */

import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Always include homepage as first item
  const allItems = [
    { label: 'Home', href: '/' },
    ...items
  ];

  // Generate JSON-LD BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `https://contentanonymity.com${item.href}`
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      >
        <ol className="flex items-center gap-2 flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
          {allItems.map((item, index) => (
            <li 
              key={item.href} 
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index === 0 ? (
                <Link 
                  to={item.href}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                  itemProp="item"
                >
                  <Home className="h-4 w-4" />
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  {index === allItems.length - 1 ? (
                    <span className="text-foreground font-medium" itemProp="name">
                      {item.label}
                    </span>
                  ) : (
                    <Link 
                      to={item.href}
                      className="hover:text-primary transition-colors"
                      itemProp="item"
                    >
                      <span itemProp="name">{item.label}</span>
                    </Link>
                  )}
                </>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}


