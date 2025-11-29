import { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { Marker } from '../../../types';
import { setHoveredMarkerAtom } from '../../../states/mapAtoms';

/**
 * Custom hook for handling listing item hover interactions
 * @returns Object with hover event handlers
 */
export const useListingItemHover = () => {
  const setHoveredMarker = useSetAtom(setHoveredMarkerAtom);

  const handleMouseEnter = useCallback((marker: Marker) => {
    console.log('🖱️ Mouse enter on listing item:', marker.uid);
    setHoveredMarker(marker);
  }, [setHoveredMarker]);

  const handleMouseLeave = useCallback(() => {
    console.log('🖱️ Mouse leave from listing item');
    setHoveredMarker(null);
  }, [setHoveredMarker]);

  return {
    handleMouseEnter,
    handleMouseLeave,
  };
};
