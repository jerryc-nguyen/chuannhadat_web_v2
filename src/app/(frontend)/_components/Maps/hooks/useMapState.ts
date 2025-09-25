import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  mapAtom,
  selectedMarkerAtom,
  searchQueryAtom,
  searchQueryWithMarkerAtom,
  markerClickAtom,
  clearSelectedMarkerAtom
} from '../states/mapAtoms';

/**
 * Hook to access and manipulate map state using Jotai atoms
 * This provides a clean interface for components to interact with map state
 */
export const useMapState = () => {
  // Read-only values
  const map = useAtomValue(mapAtom);
  const selectedMarker = useAtomValue(selectedMarkerAtom);

  // Read-write values
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [, setSearchQueryWithMarker] = useAtom(searchQueryWithMarkerAtom);

  // Actions
  const handleMarkerClick = useSetAtom(markerClickAtom);
  const clearSelectedMarker = useSetAtom(clearSelectedMarkerAtom);

  return {
    // State
    map,
    selectedMarker,
    searchQuery,

    // Actions
    setSearchQuery,
    setSearchQueryWithMarker,
    handleMarkerClick,
    clearSelectedMarker,
  };
};

/**
 * Hook to only read map state (for components that don't need to modify state)
 */
export const useMapStateRead = () => {
  const map = useAtomValue(mapAtom);
  const selectedMarker = useAtomValue(selectedMarkerAtom);
  const searchQuery = useAtomValue(searchQueryAtom);

  return {
    map,
    selectedMarker,
    searchQuery,
  };
};

/**
 * Hook to only access map actions (for components that only need to trigger actions)
 */
export const useMapActions = () => {
  const handleMarkerClick = useSetAtom(markerClickAtom);
  const clearSelectedMarker = useSetAtom(clearSelectedMarkerAtom);
  const [, setSearchQueryWithMarker] = useAtom(searchQueryWithMarkerAtom);

  return {
    handleMarkerClick,
    clearSelectedMarker,
    setSearchQueryWithMarker,
  };
};
