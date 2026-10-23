import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useGoogleAnalytics() {
  const location = useLocation();
  const measurementId = import.meta.env?.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) return;

    if (!window.dataLayer) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head?.appendChild(script);

      window.dataLayer = [];
      function gtag(...args) {
        window.dataLayer?.push(args);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', measurementId, { send_page_view: false });
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location?.pathname + location?.search,
        page_title: document.title,
      });
    }
  }, [location, measurementId]);
}

/**
 * Track a custom GA4 event
 * @param {string} eventName - GA4 event name
 * @param {object} params - Event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
