import { useEffect } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // Wait for page to load
    if (typeof window === 'undefined') return;

    const measurePerformance = () => {
      const metrics: Partial<PerformanceMetrics> = {};

      // Page Load Time
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      }

      // Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                metrics.firstContentfulPaint = entry.startTime;
              }
              break;
            case 'largest-contentful-paint':
              metrics.largestContentfulPaint = entry.startTime;
              break;
            case 'first-input':
              metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                metrics.cumulativeLayoutShift = (metrics.cumulativeLayoutShift || 0) + (entry as any).value;
              }
              break;
          }
        }

        // Send metrics to analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Performance',
            page_load_time: metrics.pageLoadTime,
            first_contentful_paint: metrics.firstContentfulPaint,
            largest_contentful_paint: metrics.largestContentfulPaint,
            first_input_delay: metrics.firstInputDelay,
            cumulative_layout_shift: metrics.cumulativeLayoutShift,
          });
        }
      });

      // Observe different types of performance entries
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

      // Cleanup
      return () => observer.disconnect();
    };

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'page_visible', {
            event_category: 'Engagement',
          });
        }
      } else {
        // Page became hidden
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'page_hidden', {
            event_category: 'Engagement',
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('load', measurePerformance);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
};

export default PerformanceMonitor;

