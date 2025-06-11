'use client';

import { useEffect } from 'react';
import { saveScrollPosition, scrollToSavedPosition } from '@common/utils/scrollUtils';

/**
 * Hook to handle scroll restoration between page navigations
 */
export default function useScrollRestoration() {
  useEffect(() => {
    // Save current position when component mounts
    saveScrollPosition();

    // Use popstate event to detect back/forward navigation
    const handlePopState = () => {
      // Small delay to ensure the DOM is updated
      setTimeout(() => {
        scrollToSavedPosition();
      }, 0);
    };

    // Handle scroll position changes
    const handleScroll = () => {
      // Use requestAnimationFrame to debounce
      if (!window.scrollRAF) {
        window.scrollRAF = requestAnimationFrame(() => {
          saveScrollPosition();
          window.scrollRAF = 0;
        });
      }
    };

    // Add event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Listen for when page content has loaded
    if (document.readyState === 'complete') {
      scrollToSavedPosition();
    }

    // Clean up
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('scroll', handleScroll);

      if (window.scrollRAF) {
        cancelAnimationFrame(window.scrollRAF);
      }
    };
  }, []);
}

// Extend Window interface
declare global {
  interface Window {
    scrollRAF: number;
  }
} 
