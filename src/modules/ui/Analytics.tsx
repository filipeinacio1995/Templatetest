import { useEffect } from 'react';
import { config } from '../../config/store.config';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const Analytics = () => {
  useEffect(() => {
    const gaId = config.analytics?.googleId;
    const hasConsent = localStorage.getItem('cookie-consent') === 'true';

    if (!gaId || gaId === 'G-XXXXXXXXXX' || !hasConsent) return;

    // Load Google Analytics Script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', gaId);

    return () => {
        // Cleanup is complex for global scripts, but usually strictly not needed for GA in SPAs 
        // unless we want to fully unload which is rare.
    };
  }, []);

  return null; // This component renders nothing
};
