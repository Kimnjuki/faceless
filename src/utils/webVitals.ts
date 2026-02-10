/**
 * Core Web Vitals Performance Monitor
 * 
 * Tracks LCP, INP, and CLS metrics for SEO performance monitoring
 * Sends data to GA4 and console for analysis
 */

import { trackEvent } from '@/utils/ga4';

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Performance thresholds (2026 standards)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  INP: { good: 200, poor: 500 },   // Interaction to Next Paint (ms)
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function reportWebVital(metric: WebVitalMetric) {
  const rating = getRating(metric.name, metric.value);
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vital] ${metric.name}:`, {
      value: metric.value,
      rating,
      delta: metric.delta,
    });
  }

  // Send to GA4
  trackEvent('web_vital', {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: rating,
    metric_delta: metric.delta,
    metric_id: metric.id,
  });

  // Warn if poor performance (only in production, suppress in dev to reduce noise)
  if (rating === 'poor' && import.meta.env.PROD) {
    const unit = metric.name === 'CLS' ? '' : metric.name === 'FCP' || metric.name === 'LCP' ? 'ms' : 'ms';
    console.warn(`⚠️ Poor ${metric.name} performance: ${metric.value}${unit}`);
  }
  
  // In development, only log if it's significantly poor (not just slightly over threshold)
  if (rating === 'poor' && import.meta.env.DEV) {
    const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS];
    if (threshold && metric.value > threshold.poor * 1.2) {
      const unit = metric.name === 'CLS' ? '' : metric.name === 'FCP' || metric.name === 'LCP' ? 'ms' : 'ms';
      console.warn(`⚠️ Poor ${metric.name} performance: ${metric.value}${unit} (threshold: ${threshold.poor}${unit})`);
    }
  }
}

/**
 * Initialize Web Vitals monitoring
 * Call this once in your App component (production only)
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // LCP - Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
          startTime?: number;
        };
        
        const lcpValue = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime || 0;
        
        reportWebVital({
          name: 'LCP',
          value: Math.round(lcpValue),
          id: lastEntry.name || 'unknown',
          delta: 0,
          rating: getRating('LCP', lcpValue),
        });
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & { value?: number };
          if (!layoutShift.value) continue;
          clsValue += layoutShift.value;
        }

        reportWebVital({
          name: 'CLS',
          value: Math.round(clsValue * 1000) / 1000, // Round to 3 decimals (keep as decimal, not ms)
          id: 'cumulative',
          delta: clsValue,
          rating: getRating('CLS', clsValue),
        });
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // FCP - First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fcpValue = entry.startTime;
          reportWebVital({
            name: 'FCP',
            value: Math.round(fcpValue),
            id: entry.name || 'unknown',
            delta: 0,
            rating: getRating('FCP', fcpValue),
          });
        }
      });

      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP observer not supported');
    }

    // TTFB - Time to First Byte
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfbValue = navigationEntry.responseStart - navigationEntry.requestStart;
        reportWebVital({
          name: 'TTFB',
          value: Math.round(ttfbValue),
          id: 'navigation',
          delta: 0,
          rating: getRating('TTFB', ttfbValue),
        });
      }
    } catch (e) {
      console.warn('TTFB calculation failed');
    }

    // INP - Interaction to Next Paint (simplified measurement)
    // Note: Full INP requires more complex tracking of all interactions
    let interactionCount = 0;
    let totalInteractionDelay = 0;

    const measureInteraction = (event: Event) => {
      const start = performance.now();
      requestAnimationFrame(() => {
        const delay = performance.now() - start;
        interactionCount++;
        totalInteractionDelay += delay;

        if (interactionCount % 10 === 0) {
          const avgINP = totalInteractionDelay / interactionCount;
          reportWebVital({
            name: 'INP',
            value: Math.round(avgINP),
            id: `interaction-${interactionCount}`,
            delta: delay,
            rating: getRating('INP', avgINP),
          });
        }
      });
    };

    ['click', 'keydown', 'pointerdown'].forEach(type => {
      document.addEventListener(type, measureInteraction, { passive: true });
    });
  }
}

/**
 * Measure current Web Vitals from Performance API (for PerformanceMonitor page).
 * Returns values in display-friendly units: LCP/FCP in seconds, TTFB/INP in ms, CLS as decimal.
 */
export interface MeasuredVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
  description: string;
}

const DESCRIPTIONS: Record<string, string> = {
  LCP: 'Largest Contentful Paint - Time to render the largest content element',
  FID: 'First Input Delay - Time from first user interaction to browser response',
  INP: 'Interaction to Next Paint - Responsiveness to user input',
  CLS: 'Cumulative Layout Shift - Visual stability of the page',
  FCP: 'First Contentful Paint - Time to first content render',
  TTFB: 'Time to First Byte - Server response time',
};

export async function measureAllWebVitals(): Promise<MeasuredVital[]> {
  const vitals: MeasuredVital[] = [];
  if (typeof window === 'undefined' || !window.performance) return vitals;

  try {
    // LCP - from PerformanceObserver entries if available, else 0
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    const lcpValue = lcpEntries.length > 0
      ? ((lcpEntries[lcpEntries.length - 1] as PerformanceEntry & { renderTime?: number }).renderTime ?? 0) / 1000
      : 0;
    vitals.push({
      name: 'LCP',
      value: Math.round(lcpValue * 100) / 100,
      rating: getRating('LCP', lcpValue * 1000),
      threshold: { good: 2.5, poor: 4.0 },
      description: DESCRIPTIONS.LCP,
    });

    // FCP
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
    const fcpValue = fcpEntry ? fcpEntry.startTime / 1000 : 0;
    vitals.push({
      name: 'FCP',
      value: Math.round(fcpValue * 100) / 100,
      rating: getRating('FCP', fcpValue * 1000),
      threshold: { good: 1.8, poor: 3.0 },
      description: DESCRIPTIONS.FCP,
    });

    // CLS - not available synchronously; use 0
    vitals.push({
      name: 'CLS',
      value: 0,
      rating: 'good',
      threshold: { good: 0.1, poor: 0.25 },
      description: DESCRIPTIONS.CLS,
    });

    // TTFB (ms)
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const ttfbValue = nav ? nav.responseStart - nav.requestStart : 0;
    vitals.push({
      name: 'TTFB',
      value: Math.round(ttfbValue),
      rating: getRating('TTFB', ttfbValue),
      threshold: { good: 800, poor: 1800 },
      description: DESCRIPTIONS.TTFB,
    });

    // INP - placeholder (requires interaction)
    vitals.push({
      name: 'FID',
      value: 0,
      rating: 'good',
      threshold: { good: 100, poor: 300 },
      description: DESCRIPTIONS.FID,
    });
  } catch (e) {
    console.warn('measureAllWebVitals failed', e);
  }
  return vitals;
}

export default initWebVitals;
