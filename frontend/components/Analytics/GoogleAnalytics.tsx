import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface GoogleAnalyticsProps {
  measurementId: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ measurementId }) => {
  const router = useRouter();

  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Track page views on route changes
    const handleRouteChange = (url: string) => {
      gtag('config', measurementId, {
        page_title: document.title,
        page_location: url,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [measurementId, router.events]);

  return null;
};

// Analytics event tracking functions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

export const trackRestaurantSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', 'restaurant', searchTerm, resultsCount);
};

export const trackRestaurantView = (restaurantName: string, restaurantId: string) => {
  trackEvent('view_item', 'restaurant', restaurantName);
  trackEvent('restaurant_view', 'engagement', restaurantId);
};

export const trackReservationAttempt = (restaurantName: string, restaurantId: string) => {
  trackEvent('begin_checkout', 'reservation', restaurantName);
  trackEvent('reservation_attempt', 'conversion', restaurantId);
};

export const trackReservationComplete = (restaurantName: string, restaurantId: string) => {
  trackEvent('purchase', 'reservation', restaurantName);
  trackEvent('reservation_complete', 'conversion', restaurantId);
};

export const trackCuisineFilter = (cuisine: string) => {
  trackEvent('filter', 'cuisine', cuisine);
};

export const trackLocationFilter = (location: string) => {
  trackEvent('filter', 'location', location);
};

export const trackPriceFilter = (priceRange: string) => {
  trackEvent('filter', 'price', priceRange);
};

export const trackRatingFilter = (rating: string) => {
  trackEvent('filter', 'rating', rating);
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default GoogleAnalytics;

