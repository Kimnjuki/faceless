/**
 * Google Analytics 4 Setup
 * 
 * This file provides utilities for tracking events with GA4
 * 
 * Setup Instructions:
 * 1. Get your GA4 Measurement ID from Google Analytics (format: G-XXXXXXXXXX)
 * 2. Add it to your .env file: VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
 * 3. Import and use trackEvent() throughout your application
 */

// GA4 Measurement ID - Get from Google Analytics
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';

/**
 * Initialize GA4
 * Call this once in your main App component
 * Prevents double initialization in React Strict Mode
 */
export function initGA4() {
  if (!GA4_MEASUREMENT_ID) {
    if (import.meta.env.PROD) {
      console.warn('GA4 Measurement ID not found. Analytics will not track.');
    }
    return;
  }

  // Prevent double initialization
  if (window.__GA4_INITIALIZED__) {
    return;
  }

  // Check if script already exists
  const existingScript = document.querySelector(`script[src*="gtag/js?id=${GA4_MEASUREMENT_ID}"]`);
  if (existingScript) {
    window.__GA4_INITIALIZED__ = true;
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA4_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    anonymize_ip: true, // GDPR compliance
  });

  window.__GA4_INITIALIZED__ = true;
  
  if (import.meta.env.PROD) {
    console.log('✅ GA4 initialized:', GA4_MEASUREMENT_ID);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
  if (!GA4_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('config', GA4_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track custom event
 * 
 * @param eventName - Event name (e.g., 'signup', 'tool_usage', 'cta_click')
 * @param eventParams - Event parameters (e.g., { tool_name: 'calculator', category: 'tools' })
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (!GA4_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', eventName, {
    ...eventParams,
    event_category: eventParams?.category || 'general',
    event_label: eventParams?.label || eventName,
  });
}

/**
 * Track conversion events
 */
export const trackConversion = {
  signupStart: () => trackEvent('signup_start', { category: 'conversion' }),
  signupComplete: (method: string) => trackEvent('signup_complete', { category: 'conversion', method }),
  toolUsage: (toolName: string, toolCategory: string) => 
    trackEvent('tool_usage', { category: 'tools', tool_name: toolName, tool_category: toolCategory }),
  blogPostRead: (postTitle: string, postCategory: string) =>
    trackEvent('blog_post_read', { category: 'content', post_title: postTitle, post_category: postCategory }),
  ctaClick: (ctaLocation: string, ctaText: string) =>
    trackEvent('cta_click', { category: 'engagement', cta_location: ctaLocation, cta_text: ctaText }),
  scrollDepth: (depth: number) =>
    trackEvent('scroll_depth', { category: 'engagement', depth }),
  download: (resourceName: string, resourceType: string) =>
    trackEvent('download', { category: 'resources', resource_name: resourceName, resource_type: resourceType }),
  purchase: (productName: string, value: number, currency: string = 'USD') =>
    trackEvent('purchase', { category: 'ecommerce', product_name: productName, value, currency }),
};

/**
 * Track user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (!GA4_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
}

/**
 * Track exceptions/errors
 */
export function trackException(description: string, fatal: boolean = false) {
  if (!GA4_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', 'exception', {
    description,
    fatal,
  });
}

// Export default for convenience
export default {
  initGA4,
  trackPageView,
  trackEvent,
  trackConversion,
  setUserProperties,
  trackException,
};

