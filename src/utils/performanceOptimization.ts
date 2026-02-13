/**
 * Performance Optimization Utilities
 * Tracks page performance metrics and provides optimization suggestions
 * Integrates with GA4 for performance monitoring
 */

import { trackEvent, trackPageView } from './analytics';

// Performance metrics interface
interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  resourceLoadTimes: Array<{
    name: string;
    type: string;
    duration: number;
    size: number;
  }>;
}

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  pageLoadTime: { good: 1000, needsImprovement: 3000 },
  domContentLoaded: { good: 500, needsImprovement: 1500 },
  firstContentfulPaint: { good: 1000, needsImprovement: 2500 },
  largestContentfulPaint: { good: 2500, needsImprovement: 4000 },
  cumulativeLayoutShift: { good: 0.1, needsImprovement: 0.25 },
  firstInputDelay: { good: 100, needsImprovement: 300 },
  timeToInteractive: { good: 3800, needsImprovement: 7300 }
};

// Track page performance
export function trackPagePerformance(pagePath: string) {
  if (typeof window === 'undefined' || !window.performance) return;

  const metrics = collectPerformanceMetrics();
  
  // Track individual metrics in GA4
  Object.entries(metrics).forEach(([metric, value]) => {
    if (typeof value === 'number') {
      const threshold = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
      if (threshold) {
        let performanceRating = 'good';
        if (value > threshold.needsImprovement) {
          performanceRating = 'poor';
        } else if (value > threshold.good) {
          performanceRating = 'needs_improvement';
        }
        
        trackEvent('performance_metric', 'performance', performanceRating, Math.round(value), {
          metric_name: metric,
          page_path: pagePath,
          threshold_good: threshold.good,
          threshold_needs_improvement: threshold.needsImprovement
        });
      }
    }
  });

  // Track overall performance score
  const performanceScore = calculatePerformanceScore(metrics);
  trackEvent('page_performance_score', 'performance', pagePath, Math.round(performanceScore), {
    page_load_time: metrics.pageLoadTime,
    dom_content_loaded: metrics.domContentLoaded,
    first_contentful_paint: metrics.firstContentfulPaint,
    largest_contentful_paint: metrics.largestContentfulPaint,
    cumulative_layout_shift: metrics.cumulativeLayoutShift,
    first_input_delay: metrics.firstInputDelay
  });

  // Store metrics for optimization suggestions
  localStorage.setItem('performance_metrics', JSON.stringify({
    ...metrics,
    pagePath,
    timestamp: Date.now()
  }));

  // Generate optimization suggestions
  const suggestions = generateOptimizationSuggestions(metrics);
  if (suggestions.length > 0) {
    trackEvent('performance_suggestions', 'optimization', pagePath, suggestions.length, {
      suggestions: suggestions.join(','),
      page_path: pagePath
    });
  }
}

// Collect performance metrics
function collectPerformanceMetrics(): PerformanceMetrics {
  const timing = window.performance.timing;
  const navigation = window.performance.navigation;
  
  const metrics: PerformanceMetrics = {
    pageLoadTime: timing.loadEventEnd - timing.navigationStart,
    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    timeToInteractive: 0,
    resourceLoadTimes: []
  };

  // Get Web Vitals from PerformanceObserver
  if ('PerformanceObserver' in window) {
    try {
      // First Contentful Paint
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cumulativeLayoutShift = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('PerformanceObserver not fully supported:', error);
    }
  }

  // Calculate Time to Interactive
  if (timing.domInteractive > 0) {
    metrics.timeToInteractive = timing.domInteractive - timing.navigationStart;
  }

  // Collect resource load times
  const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  metrics.resourceLoadTimes = resources
    .filter(resource => resource.duration > 0)
    .map(resource => ({
      name: resource.name,
      type: getResourceType(resource.name),
      duration: resource.duration,
      size: resource.transferSize || 0
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10); // Top 10 slowest resources

  return metrics;
}

// Get resource type from URL
function getResourceType(url: string): string {
  if (url.includes('.js')) return 'script';
  if (url.includes('.css')) return 'stylesheet';
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)) return 'image';
  if (url.match(/\.(woff|woff2|ttf|eot)/i)) return 'font';
  if (url.includes('/api/') || url.includes('/graphql')) return 'api';
  return 'other';
}

// Calculate overall performance score
function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  let score = 100;
  
  // Deduct points for poor performance
  if (metrics.pageLoadTime > PERFORMANCE_THRESHOLDS.pageLoadTime.needsImprovement) score -= 20;
  else if (metrics.pageLoadTime > PERFORMANCE_THRESHOLDS.pageLoadTime.good) score -= 10;
  
  if (metrics.firstContentfulPaint > PERFORMANCE_THRESHOLDS.firstContentfulPaint.needsImprovement) score -= 15;
  else if (metrics.firstContentfulPaint > PERFORMANCE_THRESHOLDS.firstContentfulPaint.good) score -= 8;
  
  if (metrics.largestContentfulPaint > PERFORMANCE_THRESHOLDS.largestContentfulPaint.needsImprovement) score -= 15;
  else if (metrics.largestContentfulPaint > PERFORMANCE_THRESHOLDS.largestContentfulPaint.good) score -= 8;
  
  if (metrics.cumulativeLayoutShift > PERFORMANCE_THRESHOLDS.cumulativeLayoutShift.needsImprovement) score -= 20;
  else if (metrics.cumulativeLayoutShift > PERFORMANCE_THRESHOLDS.cumulativeLayoutShift.good) score -= 10;
  
  if (metrics.firstInputDelay > PERFORMANCE_THRESHOLDS.firstInputDelay.needsImprovement) score -= 15;
  else if (metrics.firstInputDelay > PERFORMANCE_THRESHOLDS.firstInputDelay.good) score -= 8;
  
  if (metrics.domContentLoaded > PERFORMANCE_THRESHOLDS.domContentLoaded.needsImprovement) score -= 10;
  else if (metrics.domContentLoaded > PERFORMANCE_THRESHOLDS.domContentLoaded.good) score -= 5;
  
  return Math.max(0, score);
}

// Generate optimization suggestions
function generateOptimizationSuggestions(metrics: PerformanceMetrics): string[] {
  const suggestions: string[] = [];
  
  // Page load time suggestions
  if (metrics.pageLoadTime > PERFORMANCE_THRESHOLDS.pageLoadTime.needsImprovement) {
    suggestions.push('optimize_page_load_time');
    
    // Check for slow resources
    const slowResources = metrics.resourceLoadTimes.filter(r => r.duration > 1000);
    if (slowResources.length > 0) {
      suggestions.push('optimize_slow_resources');
      
      const slowImages = slowResources.filter(r => r.type === 'image');
      if (slowImages.length > 0) {
        suggestions.push('optimize_images');
      }
      
      const slowScripts = slowResources.filter(r => r.type === 'script');
      if (slowScripts.length > 0) {
        suggestions.push('optimize_scripts');
      }
    }
  }
  
  // FCP suggestions
  if (metrics.firstContentfulPaint > PERFORMANCE_THRESHOLDS.firstContentfulPaint.needsImprovement) {
    suggestions.push('reduce_server_response_time');
    suggestions.push('optimize_critical_rendering_path');
  }
  
  // LCP suggestions
  if (metrics.largestContentfulPaint > PERFORMANCE_THRESHOLDS.largestContentfulPaint.needsImprovement) {
    suggestions.push('optimize_largest_contentful_paint');
    suggestions.push('preload_important_resources');
  }
  
  // CLS suggestions
  if (metrics.cumulativeLayoutShift > PERFORMANCE_THRESHOLDS.cumulativeLayoutShift.needsImprovement) {
    suggestions.push('reduce_cumulative_layout_shift');
    suggestions.push('specify_image_dimensions');
  }
  
  // FID suggestions
  if (metrics.firstInputDelay > PERFORMANCE_THRESHOLDS.firstInputDelay.needsImprovement) {
    suggestions.push('reduce_javascript_execution_time');
    suggestions.push('break_up_long_tasks');
  }
  
  return suggestions;
}

// Track bounce rate and exit intent
export function trackExitIntent(pagePath: string, timeOnPage: number) {
  const bounceThreshold = 5000; // 5 seconds
  
  if (timeOnPage < bounceThreshold) {
    trackEvent('quick_exit', 'engagement', pagePath, Math.floor(timeOnPage / 1000), {
      exit_type: 'bounce',
      time_on_page_ms: timeOnPage
    });
  } else {
    trackEvent('page_exit', 'engagement', pagePath, Math.floor(timeOnPage / 1000), {
      exit_type: 'normal',
      time_on_page_ms: timeOnPage
    });
  }
}

// Monitor page visibility changes
export function setupPageVisibilityTracking(pagePath: string) {
  if (typeof document === 'undefined') return;
  
  let pageVisibleTime = Date.now();
  let totalVisibleTime = 0;
  
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Page became hidden
      totalVisibleTime += Date.now() - pageVisibleTime;
    } else {
      // Page became visible
      pageVisibleTime = Date.now();
    }
  };
  
  const handleBeforeUnload = () => {
    const totalTime = totalVisibleTime + (Date.now() - pageVisibleTime);
    trackExitIntent(pagePath, totalTime);
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}

// Track Core Web Vitals over time
export function setupCoreWebVitalsTracking() {
  if (typeof window === 'undefined') return;
  
  // Track performance over time
  const trackPerformanceOverTime = () => {
    const metrics = collectPerformanceMetrics();
    const performanceScore = calculatePerformanceScore(metrics);
    
    // Store in localStorage for trend analysis
    const historicalData = JSON.parse(localStorage.getItem('performance_history') || '[]');
    historicalData.push({
      timestamp: Date.now(),
      score: performanceScore,
      metrics
    });
    
    // Keep only last 30 entries
    const recentData = historicalData.slice(-30);
    localStorage.setItem('performance_history', JSON.stringify(recentData));
    
    // Track trend
    if (recentData.length >= 2) {
      const previousScore = recentData[recentData.length - 2].score;
      const currentScore = recentData[recentData.length - 1].score;
      const trend = currentScore > previousScore ? 'improving' : currentScore < previousScore ? 'declining' : 'stable';
      
      trackEvent('performance_trend', 'performance', trend, Math.round(currentScore - previousScore));
    }
  };
  
  // Track performance every 30 seconds
  const interval = setInterval(trackPerformanceOverTime, 30000);
  
  return () => clearInterval(interval);
}

// Get performance recommendations
export function getPerformanceRecommendations(): string[] {
  const stored = localStorage.getItem('performance_metrics');
  if (!stored) return [];
  
  const metrics = JSON.parse(stored);
  return generateOptimizationSuggestions(metrics);
}

// Get performance history
export function getPerformanceHistory(): Array<{ timestamp: number; score: number }> {
  const history = JSON.parse(localStorage.getItem('performance_history') || '[]');
  return history.map((entry: any) => ({
    timestamp: entry.timestamp,
    score: entry.score
  }));
}

// Clear performance data
export function clearPerformanceData() {
  localStorage.removeItem('performance_metrics');
  localStorage.removeItem('performance_history');
}
