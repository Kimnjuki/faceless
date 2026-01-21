// Web Vitals Measurement Utility
// Measures Core Web Vitals for performance monitoring

export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
  description: string;
  unit: 'ms' | 's' | '';
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP(): Promise<number> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(0);
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
        observer.disconnect();
        resolve(lcp / 1000); // Convert to seconds
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      resolve(0);
    }
  });
}

/**
 * Measure First Input Delay (FID)
 */
export function measureFID(): Promise<number> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(0);
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEventTiming[];
        if (entries.length > 0) {
          const fid = entries[0].processingStart - entries[0].startTime;
          observer.disconnect();
          resolve(fid);
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch {
      resolve(0);
    }
  });
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS(): Promise<number> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(0);
      return;
    }

    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as LayoutShift[];
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });

      // Return CLS after a delay to allow for measurement
      setTimeout(() => {
        observer.disconnect();
        resolve(clsValue);
      }, 5000);
    } catch {
      resolve(0);
    }
  });
}

/**
 * Measure First Contentful Paint (FCP)
 */
export function measureFCP(): Promise<number> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(0);
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint') as PerformancePaintTiming;
        if (fcpEntry) {
          const fcp = fcpEntry.startTime;
          observer.disconnect();
          resolve(fcp / 1000); // Convert to seconds
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch {
      resolve(0);
    }
  });
}

/**
 * Measure Time to First Byte (TTFB)
 */
export function measureTTFB(): Promise<number> {
  return new Promise((resolve) => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const ttfb = timing.responseStart - timing.navigationStart;
      resolve(ttfb);
    } else {
      resolve(0);
    }
  });
}

/**
 * Get rating for a metric value
 */
export function getRating(value: number, threshold: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' {
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Measure all Core Web Vitals
 */
export async function measureAllWebVitals(): Promise<WebVitalMetric[]> {
  const [lcp, fid, cls, fcp, ttfb] = await Promise.all([
    measureLCP(),
    measureFID(),
    measureCLS(),
    measureFCP(),
    measureTTFB()
  ]);

  return [
    {
      name: 'LCP',
      value: lcp,
      rating: getRating(lcp, { good: 2.5, poor: 4.0 }),
      threshold: { good: 2.5, poor: 4.0 },
      description: 'Largest Contentful Paint - Time to render the largest content element',
      unit: 's'
    },
    {
      name: 'FID',
      value: fid,
      rating: getRating(fid, { good: 100, poor: 300 }),
      threshold: { good: 100, poor: 300 },
      description: 'First Input Delay - Time from first user interaction to browser response',
      unit: 'ms'
    },
    {
      name: 'CLS',
      value: cls,
      rating: getRating(cls, { good: 0.1, poor: 0.25 }),
      threshold: { good: 0.1, poor: 0.25 },
      description: 'Cumulative Layout Shift - Visual stability of the page',
      unit: ''
    },
    {
      name: 'FCP',
      value: fcp,
      rating: getRating(fcp, { good: 1.8, poor: 3.0 }),
      threshold: { good: 1.8, poor: 3.0 },
      description: 'First Contentful Paint - Time to first content render',
      unit: 's'
    },
    {
      name: 'TTFB',
      value: ttfb,
      rating: getRating(ttfb, { good: 800, poor: 1800 }),
      threshold: { good: 800, poor: 1800 },
      description: 'Time to First Byte - Server response time',
      unit: 'ms'
    }
  ];
}

// Type definitions for Performance API
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface PerformancePaintTiming extends PerformanceEntry {
  startTime: number;
}


