'use client';

import { useEffect } from 'react';
import { useFilterState } from '@frontend/features/search/filters-v2/hooks/useFilterState';
import useMainContentNavigator from '@frontend/features/navigation/main-content-navigator/hooks';

/**
 * Custom hook to handle route changes
 * @param options Configuration options for the route change handler
 * @returns void
 */
export default function useRouteChangeHandler(options: {
  resetFiltersOnProfilePage?: boolean;
} = {}) {
  const { resetFiltersOnProfilePage = true } = options;
  const { clearAllFilters } = useFilterState();
  const { resetLocations } = useMainContentNavigator();

  useEffect(() => {
    // Function to handle route changes
    const handleRouteChange = (url: string) => {

      // Check if navigating to a profile page
      if (resetFiltersOnProfilePage && url.includes('/profile/')) {
        // do nothing!
      }
    };

    // Handler for popstate event
    const handlePopState = () => {
      const newUrl = window.location.pathname + window.location.search;
      handleRouteChange(newUrl);
    };

    // Subscribe to the popstate event
    window.addEventListener('popstate', handlePopState);

    // For Next.js client-side navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      // The third argument in pushState is the URL
      if (args[2] && typeof args[2] === 'string') {
        handleRouteChange(args[2].toString());
      }
      return result;
    };

    // Clean up
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.history.pushState = originalPushState;
    };
  }, [clearAllFilters, resetFiltersOnProfilePage, resetLocations]);
} 
