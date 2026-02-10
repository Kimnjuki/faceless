/**
 * Microsoft Clarity Analytics
 * Heatmaps, session recordings, and user behavior analysis
 * 
 * Features:
 * - Heatmaps (click, scroll, move)
 * - Session recordings
 * - User insights
 * - Conversion funnels
 * - Custom events tracking
 * 
 * Project ID: vd7rgy7tu7
 */

declare global {
  interface Window {
    clarity?: (action: string, ...args: any[]) => void;
  }
}

// Default Clarity Project ID (can be overridden via env)
const DEFAULT_CLARITY_ID = 'vd7rgy7tu7';

/**
 * Initialize Microsoft Clarity
 * Loads in both development and production (can be restricted to production if needed)
 */
export function initClarity() {
  if (typeof window === 'undefined') return;

  // Get Clarity ID from env or use default
  const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID || DEFAULT_CLARITY_ID;
  
  if (!clarityId) {
    console.warn('[Clarity] No Project ID found. Clarity will not be initialized.');
    return;
  }

  // Prevent double initialization
  if (window.clarity) {
    console.log('[Clarity] Already initialized');
    return;
  }

  try {
    // Microsoft Clarity tracking code (official implementation)
    // Note: t and y are declared inside the function, not passed as parameters
    (function(c: any, l: any, a: any, r: any, i: any) {
      c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
      const t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      
      // Add error handling for network failures
      t.onerror = () => {
        // Suppress network errors silently - they're not critical
        // Clarity will retry automatically on next page load
      };
      
      const y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", clarityId);

    console.log('[Clarity] Initialized successfully with Project ID:', clarityId);
  } catch (error) {
    // Suppress initialization errors - Clarity is non-critical
    // Network errors are handled by script onerror handler
    if (import.meta.env.DEV) {
      console.warn('[Clarity] Failed to initialize (non-critical):', error);
    }
  }
}

/**
 * Track custom events in Clarity
 * Useful for tracking specific user interactions
 * 
 * @example
 * trackClarityEvent('button_click', { button_name: 'signup', location: 'header' });
 */
export function trackClarityEvent(eventName: string, data?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.clarity) return;
  
  try {
    window.clarity('event', eventName, data);
  } catch (error) {
    console.error('[Clarity] Failed to track event:', error);
  }
}

/**
 * Identify users in Clarity (anonymously)
 * Use this to track user journeys without PII
 * 
 * @example
 * identifyClarityUser('user_12345');
 */
export function identifyClarityUser(userId: string) {
  if (typeof window === 'undefined' || !window.clarity) return;
  
  try {
    window.clarity('identify', userId);
  } catch (error) {
    console.error('[Clarity] Failed to identify user:', error);
  }
}

/**
 * Set Clarity metadata for better session analysis
 * Useful for filtering sessions by custom attributes
 * 
 * @example
 * setClarityMetadata('user_type', 'premium');
 * setClarityMetadata('signup_source', 'google');
 */
export function setClarityMetadata(key: string, value: string) {
  if (typeof window === 'undefined' || !window.clarity) return;
  
  try {
    window.clarity('set', key, value);
  } catch (error) {
    console.error('[Clarity] Failed to set metadata:', error);
  }
}

/**
 * Track page views in Clarity
 * Usually automatic, but can be used for SPA navigation
 */
export function trackClarityPageView(pageName: string) {
  if (typeof window === 'undefined' || !window.clarity) return;
  
  try {
    window.clarity('page', pageName);
  } catch (error) {
    console.error('[Clarity] Failed to track page view:', error);
  }
}

/**
 * Upgrade Clarity session (mark as conversion)
 * Use when user completes important actions
 * 
 * @example
 * upgradeClaritySession('signup_completed');
 */
export function upgradeClaritySession(tag?: string) {
  if (typeof window === 'undefined' || !window.clarity) return;
  
  try {
    window.clarity('upgrade', tag);
  } catch (error) {
    console.error('[Clarity] Failed to upgrade session:', error);
  }
}
