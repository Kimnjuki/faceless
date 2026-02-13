/**
 * Google Analytics and Event Tracking
 * Privacy-compliant analytics implementation with advanced GA4 features
 * Integrates with Microsoft Clarity for enhanced user behavior tracking
 * Includes scroll depth, engagement tracking, and traffic acquisition analysis
 */

import { trackClarityEvent, upgradeClaritySession, setClarityMetadata } from './clarity';

// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-VGB9R02TVY';

// Engagement tracking state
let scrollDepthTracked = { 25: false, 50: false, 75: false, 90: false };
let sessionStartTime = Date.now();
let lastActivityTime = Date.now();
let engagementTimer: NodeJS.Timeout | null = null;

// Check if analytics is enabled (respects user privacy preferences)
export function isAnalyticsEnabled(): boolean {
  // Check localStorage for user consent
  const consent = localStorage.getItem('analytics_consent');
  return consent === 'true';
}

// Initialize Google Analytics with enhanced configuration
export function initGoogleAnalytics() {
  if (typeof window === 'undefined') return;
  
  // Only initialize if user has consented
  if (!isAnalyticsEnabled()) {
    return;
  }

  // gtag.js is already loaded in index.html
  // Configure with enhanced measurement and privacy settings
  if (typeof window !== 'undefined' && window.gtag) {
    const gtag = window.gtag;
    gtag('config', GA_MEASUREMENT_ID, {
      // Enhanced measurement settings
      send_page_view: true,
      page_location: window.location.href,
      page_referrer: document.referrer,
      
      // Privacy settings
      anonymize_ip: true, // Anonymize IP addresses for GDPR compliance
      allow_google_signals: false, // Disable Google Signals for privacy
      allow_ad_personalization_signals: false, // Disable ad personalization
      
      // Enhanced ecommerce and engagement
      enable_linker: true,
      linker: { domains: ['contentanonymity.com'] },
      
      // Custom dimensions for better tracking
      custom_map: {
        custom_parameter_1: 'user_type',
        custom_parameter_2: 'content_category',
        custom_parameter_3: 'traffic_source',
      }
    });
    
    // Initialize engagement tracking
    initEngagementTracking();
  }
}

// Initialize advanced engagement tracking
function initEngagementTracking() {
  // Track session start
  trackEvent('session_start', 'engagement', 'session_initiated');
  
  // Set up scroll depth tracking
  setupScrollDepthTracking();
  
  // Set up activity tracking
  setupActivityTracking();
  
  // Track traffic source
  trackTrafficSource();
}

// Setup scroll depth tracking
function setupScrollDepthTracking() {
  if (typeof window === 'undefined') return;
  
  let scrollTimeout: NodeJS.Timeout;
  
  const handleScroll = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100);
      
      // Track scroll depth milestones
      const milestones = [25, 50, 75, 90];
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !scrollDepthTracked[milestone as keyof typeof scrollDepthTracked]) {
          scrollDepthTracked[milestone as keyof typeof scrollDepthTracked] = true;
          trackEvent('scroll_depth', 'engagement', `${milestone}%_scroll`);
          trackClarityEvent('scroll_depth', { percentage: milestone });
        }
      });
    }, 100);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// Setup user activity tracking
function setupActivityTracking() {
  if (typeof window === 'undefined') return;
  
  const updateActivity = () => {
    lastActivityTime = Date.now();
    
    // Clear existing timer
    if (engagementTimer) {
      clearTimeout(engagementTimer);
    }
    
    // Set new timer to track engagement after 30 seconds of inactivity
    engagementTimer = setTimeout(() => {
      const engagementDuration = Date.now() - sessionStartTime;
      trackEvent('engagement_duration', 'engagement', 'session_active', Math.floor(engagementDuration / 1000));
    }, 30000);
  };
  
  // Track various user interactions
  ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, updateActivity, { passive: true });
  });
}

// Track traffic acquisition sources
function trackTrafficSource() {
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmContent = urlParams.get('utm_content');
  const utmTerm = urlParams.get('utm_term');
  
  // Track organic search
  const referrer = document.referrer;
  let trafficSource = 'direct';
  let trafficMedium = 'none';
  
  if (utmSource) {
    trafficSource = utmSource;
    trafficMedium = utmMedium || 'campaign';
  } else if (referrer) {
    const referrerDomain = new URL(referrer).hostname;
    if (referrerDomain.includes('google')) {
      trafficSource = 'google';
      trafficMedium = 'organic';
    } else if (referrerDomain.includes('facebook') || referrerDomain.includes('fb')) {
      trafficSource = 'facebook';
      trafficMedium = 'social';
    } else if (referrerDomain.includes('twitter') || referrerDomain.includes('t.co')) {
      trafficSource = 'twitter';
      trafficMedium = 'social';
    } else if (referrerDomain.includes('linkedin')) {
      trafficSource = 'linkedin';
      trafficMedium = 'social';
    } else {
      trafficSource = referrerDomain;
      trafficMedium = 'referral';
    }
  }
  
  // Set user properties for traffic source
  setUserProperty('traffic_source', trafficSource);
  setUserProperty('traffic_medium', trafficMedium);
  
  // Track traffic acquisition event
  trackEvent('traffic_acquisition', 'acquisition', `${trafficSource}_${trafficMedium}`);
  
  // Track UTM parameters if present
  if (utmSource || utmMedium || utmCampaign) {
    trackEvent('campaign_visit', 'acquisition', utmCampaign || 'no_campaign', undefined, {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
    });
  }
}

// Track page views with enhanced metrics
export function trackPageView(path: string, title?: string) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;
  
  const gtag = window.gtag;
  if (gtag) {
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
      // Enhanced page view tracking
      send_page_view: true,
      page_location: window.location.href,
      page_referrer: document.referrer,
    });
  }
  
  // Track in Clarity with enhanced metadata
  if (path) {
    setClarityMetadata('page_path', path);
    setClarityMetadata('page_title', title || document.title);
    
    // Track page load performance
    if (window.performance && window.performance.timing) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      trackEvent('page_load_time', 'performance', path, Math.floor(loadTime / 1000));
    }
  }
  
  // Reset scroll depth tracking for new page
  scrollDepthTracked = { 25: false, 50: false, 75: false, 90: false };
}

// Track events with enhanced parameters
export function trackEvent(
  eventName: string,
  eventCategory: string,
  eventLabel?: string,
  value?: number,
  additionalParams?: Record<string, any>
) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;
  
  const gtag = window.gtag;
  if (gtag) {
    gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: value,
      // Add custom parameters for enhanced tracking
      ...additionalParams,
      
      // Add engagement context
      engagement_time_msec: Date.now() - lastActivityTime,
      session_id: getSessionId(),
    });
  }
}

// Get or create session ID for tracking
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('ga_session_id');
  if (!sessionId) {
    sessionId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('ga_session_id', sessionId);
  }
  return sessionId;
}

// Track content engagement with detailed metrics
export function trackContentEngagement(
  contentType: string,
  contentId: string,
  contentName?: string,
  engagementType: 'view' | 'like' | 'share' | 'comment' | 'bookmark' = 'view',
  duration?: number
) {
  const eventName = `content_${engagementType}`;
  trackEvent(eventName, 'content', contentName || contentId, duration, {
    content_type: contentType,
    content_id: contentId,
    engagement_type: engagementType,
    engagement_duration: duration,
  });
  
  // Track in Clarity
  trackClarityEvent(`content_${engagementType}`, {
    content_type: contentType,
    content_id: contentId,
    content_name: contentName,
    engagement_type: engagementType,
  });
}

// Track user journey and behavior flow
export function trackUserJourney(step: string, journeyName: string, properties?: Record<string, any>) {
  trackEvent('user_journey', 'navigation', `${journeyName}_${step}`, undefined, {
    journey_name: journeyName,
    journey_step: step,
    step_number: properties?.stepNumber,
    ...properties,
  });
  
  // Track in Clarity
  trackClarityEvent('user_journey', {
    journey_name: journeyName,
    journey_step: step,
    ...properties,
  });
}

// Track bounce rate and exit intent
export function trackExitIntent(page: string, timeOnPage: number) {
  trackEvent('exit_intent', 'engagement', page, Math.floor(timeOnPage / 1000), {
    time_on_page_ms: timeOnPage,
    exit_type: 'page_exit',
  });
  
  // Track in Clarity
  trackClarityEvent('exit_intent', {
    page,
    time_on_page: timeOnPage,
  });
}

// Track search behavior
export function trackSearch(query: string, category: string, resultsCount?: number) {
  trackEvent('search', 'content', category, resultsCount, {
    search_query: query,
    search_category: category,
    results_count: resultsCount,
  });
  
  // Track in Clarity
  trackClarityEvent('search', {
    query,
    category,
    results_count: resultsCount,
  });
}

// Track video engagement
export function trackVideoEngagement(
  videoTitle: string,
  videoId: string,
  action: 'play' | 'pause' | 'complete' | 'seek',
  currentTime?: number,
  duration?: number
) {
  trackEvent(`video_${action}`, 'content', videoTitle, currentTime || 0, {
    video_id: videoId,
    video_action: action,
    current_time: currentTime,
    video_duration: duration,
    completion_percentage: duration && currentTime ? (currentTime / duration) * 100 : undefined,
  });
  
  // Track in Clarity
  trackClarityEvent(`video_${action}`, {
    video_title: videoTitle,
    video_id: videoId,
    action,
    current_time: currentTime,
    duration,
  });
}

// Track form interactions (not just submissions)
export function trackFormInteraction(
  formName: string,
  formLocation: string,
  interactionType: 'start' | 'focus' | 'blur' | 'validation_error' | 'submit',
  fieldName?: string
) {
  trackEvent(`form_${interactionType}`, 'engagement', `${formName}_${formLocation}`, undefined, {
    form_name: formName,
    form_location: formLocation,
    interaction_type: interactionType,
    field_name: fieldName,
  });
  
  // Track in Clarity
  trackClarityEvent(`form_${interactionType}`, {
    form_name: formName,
    form_location: formLocation,
    field_name: fieldName,
  });
}

// Track conversions (for ad platforms) with enhanced attribution
export function trackConversion(
  conversionId: string, 
  value?: number, 
  currency = 'USD',
  additionalParams?: Record<string, any>
) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;
  
  const gtag = window.gtag;
  if (gtag) {
    gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: currency,
      ...additionalParams,
    });
  }
  
  // Track conversion event
  trackEvent('conversion', 'acquisition', conversionId, value, {
    conversion_value: value,
    conversion_currency: currency,
    ...additionalParams,
  });
}

// Track user signups with enhanced attribution
export function trackSignup(method: 'email' | 'google' = 'email', source?: string) {
  trackEvent('sign_up', 'engagement', method, undefined, {
    signup_method: method,
    signup_source: source || 'direct',
    session_duration: Date.now() - sessionStartTime,
  });
  
  // Track in Clarity
  trackClarityEvent('signup', { method, source });
  upgradeClaritySession('signup_completed');
}

// Track content views with enhanced metrics
export function trackContentView(contentType: string, contentId: string, contentName?: string) {
  trackEvent('view_content', 'content', contentType, undefined, {
    content_type: contentType,
    content_id: contentId,
    content_name: contentName,
  });
  
  const gtag = window.gtag;
  if (gtag) {
    gtag('event', 'view_item', {
      content_type: contentType,
      content_id: contentId,
      content_name: contentName,
    });
  }
}

// Track button clicks with enhanced context
export function trackButtonClick(buttonName: string, location: string, context?: Record<string, any>) {
  trackEvent('click', 'button', `${buttonName}_${location}`, undefined, {
    button_name: buttonName,
    button_location: location,
    ...context,
  });
  
  // Track in Clarity
  trackClarityEvent('button_click', { button_name: buttonName, location, ...context });
}

// Track form submissions with enhanced data
export function trackFormSubmit(formName: string, formLocation: string, formData?: Record<string, any>) {
  trackEvent('form_submit', 'engagement', `${formName}_${formLocation}`, undefined, {
    form_name: formName,
    form_location: formLocation,
    form_data: formData,
  });
  
  // Track in Clarity
  trackClarityEvent('form_submit', { form_name: formName, location: formLocation });
}

// Track email captures with source attribution
export function trackEmailCapture(source: string, context?: Record<string, any>) {
  trackEvent('email_capture', 'lead_generation', source, undefined, {
    capture_source: source,
    ...context,
  });
  
  // Track in Clarity
  trackClarityEvent('email_capture', { source, ...context });
  upgradeClaritySession('email_captured');
}

// Track purchases (for e-commerce) with enhanced attribution
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

// Set user properties (anonymously) with enhanced data
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

