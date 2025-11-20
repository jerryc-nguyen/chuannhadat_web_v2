'use client';

import { useState, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { bottomSheetSnapPointAtom, setBottomSheetSnapPointAtom } from '../../../states/mapAtoms';

/**
 * Custom hook for managing bottom sheet snap point state
 * Provides persistent snap point across panel switches
 */
export const useCurrentSnapPoint = (defaultSnapPoint: number | string | null = '400px') => {
  // Global state for persistence
  const globalSnapPoint = useAtomValue(bottomSheetSnapPointAtom);
  const setGlobalSnapPoint = useSetAtom(setBottomSheetSnapPointAtom);

  // Local state for immediate UI updates
  const [snap, setSnap] = useState<number | string | null>(globalSnapPoint || defaultSnapPoint);

  // Sync local state with global state
  useEffect(() => {
    setSnap(globalSnapPoint || defaultSnapPoint);
  }, [globalSnapPoint, defaultSnapPoint]);

  // Update both local and global state when snap point changes
  const handleSnapChange = (newSnap: number | string | null) => {
    setSnap(newSnap);
    setGlobalSnapPoint(newSnap);
  };

  // Reset to default snap point
  const resetSnapPoint = () => {
    handleSnapChange(defaultSnapPoint);
  };

  return {
    snap,
    setSnap: handleSnapChange,
    resetSnapPoint,
    globalSnapPoint,
  };
};
