'use client';

import { useEffect } from 'react';
import { useFilterState } from './useFilterState';

/**
 * Clears all selected filter states when the component using this hook unmounts.
 * Usage: call useCleanFilterStates() at the top of any page/component.
 */
export function useCleanFilterStates() {
  const { clearAllFilters } = useFilterState();

  useEffect(() => {
    return () => {
      clearAllFilters();
    };
  }, [clearAllFilters]);
}