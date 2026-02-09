/**
 * Google Analytics and Event Tracking
 * Privacy-compliant analytics implementation
 * Also integrates with Microsoft Clarity for enhanced user behavior tracking
 */

import { trackClarityEvent, upgradeClaritySession, setClarityMetadata } from './clarity';

// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-VGB9R02TVY';

// Check if analytics is enabled (respects user privacy preferences)
export function isAnalyticsEnabled(): boolean {
  // Check localStorage for user consent
  const consent = localStorage.getItem('analytics_consent');
  return consent === 'true';
}

// Initialize Google Analytics
export function initGoogleAnalytics() {
  if (typeof window === 'undefined') return;
  
  // Only initialize if user has consented
  if (!isAnalyticsEnabled()) {
    return;
  }

  // gtag.js is already loaded in index.html
  // Just configure it with privacy settings
  if (typeof window !== 'undefined' && window.gtag) {
    const gtag = window.gtag;
    gtag('config', GA_MEASUREMENT_ID, {
      // Privacy settings
      anonymize_ip: true, // Anonymize IP addresses for GDPR compliance
      allow_google_signals: false, // Disable Google Signals for privacy
      allow_ad_personalization_signals: false, // Disable ad personalization
    });
  }
}

// Track page views
export function trackPageView(path: string, title?: string) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;
  
  const gtag = window.gtag;
  if (gtag) {
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
  // Track in Clarity (automatic, but we can add metadata)
  if (path) {
    setClarityMetadata('page_path', path);
  }
}

// Track events
export function trackEvent(
  eventName: string,
  eventCategory: string,
  eventLabel?: string,
  value?: number
) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;
  
  const gtag = window.gtag;
  if (gtag) {
    gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: value,
    });
  }
}

// Track conversions (for ad platforms)
export function trackConversion(conversionId: string, value?: number, currency = 'USD') {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;
  
  const gtag = window.gtag;
  if (gtag) {
    gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: currency,
    });
  }
}

// Track user signups
export function trackSignup(method: 'email' | 'google' = 'email') {
  trackEvent('sign_up', 'engagement', method);
  // Track in Clarity
  trackClarityEvent('signup', { method });
  upgradeClaritySession('signup_completed');
}

// Track content views
export function trackContentView(contentType: string, contentId: string, contentName?: string) {
  trackEvent('view_content', 'content', contentType, undefined);
  
  const gtag = window.gtag;
  if (gtag) {
    gtag('event', 'view_item', {
      content_type: contentType,
      content_id: contentId,
      content_name: contentName,
    });
  }
}

// Track button clicks
export function trackButtonClick(buttonName: string, location: string) {
  trackEvent('click', 'button', `${buttonName}_${location}`);
  // Track in Clarity
  trackClarityEvent('button_click', { button_name: buttonName, location });
}

// Track form submissions
export function trackFormSubmit(formName: string, formLocation: string) {
  trackEvent('form_submit', 'engagement', `${formName}_${formLocation}`);
  // Track in Clarity
  trackClarityEvent('form_submit', { form_name: formName, location: formLocation });
}

// Track email captures
export function trackEmailCapture(source: string) {
  trackEvent('email_capture', 'lead_generation', source);
  // Track in Clarity
  trackClarityEvent('email_capture', { source });
  upgradeClaritySession('email_captured');
}

// Track purchases (for e-commerce)
export function trackPurchase(
  transactionId: string,
  value: number,
  currency = 'USD',
  items?: Array<{ id: string; name: string; category?: string; price: number; quantity: number }>
) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;
  
  const gtag = window.gtag;
  if (gtag) {
    gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  }
  // Track in Clarity
  trackClarityEvent('purchase', { transaction_id: transactionId, value, currency });
  upgradeClaritySession('purchase_completed');
}

// Set user properties (anonymously)
export function setUserProperty(property: string, value: string) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;
  
  const gtag = window.gtag;
  if (gtag) {
    gtag('set', { [property]: value });
  }
}

// Enable analytics (user consent)
export function enableAnalytics() {
  localStorage.setItem('analytics_consent', 'true');
  initGoogleAnalytics();
}

// Disable analytics (user opt-out)
export function disableAnalytics() {
  localStorage.setItem('analytics_consent', 'false');
  // Clear existing data
  if (window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
    });
  }
}

