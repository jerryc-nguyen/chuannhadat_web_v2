import { useAtomValue, useSetAtom } from 'jotai';
import { mapBoundsAtom, setMapBoundsAtom, TMapBounds } from '../states/mapAtoms';

/**
 * Hook for accessing and managing map bounds
 * Provides current bounds and utility functions
 */
export const useMapBounds = () => {
  const bounds = useAtomValue(mapBoundsAtom);
  const setBounds = useSetAtom(setMapBoundsAtom);

  /**
   * Check if bounds are valid (not null and contain valid numbers)
   */
  const hasValidBounds = (boundsToCheck: TMapBounds | null = bounds): boolean => {
    if (!boundsToCheck) return false;

    const { north, south, east, west } = boundsToCheck;
    return (
      typeof north === 'number' && !isNaN(north) &&
      typeof south === 'number' && !isNaN(south) &&
      typeof east === 'number' && !isNaN(east) &&
      typeof west === 'number' && !isNaN(west) &&
      north > south && // north should be greater than south
      east > west    // east should be greater than west
    );
  };

  /**
   * Convert bounds to API parameters format
   */
  const getBoundsForAPI = (boundsToConvert: TMapBounds | null = bounds) => {
    if (!hasValidBounds(boundsToConvert) || !boundsToConvert) return null;

    return {
      north: boundsToConvert.north,
      south: boundsToConvert.south,
      east: boundsToConvert.east,
      west: boundsToConvert.west,
    };
  };

  /**
   * Calculate center point from bounds
   */
  const getCenterFromBounds = (boundsToConvert: TMapBounds | null = bounds) => {
    if (!hasValidBounds(boundsToConvert) || !boundsToConvert) return null;

    const { north, south, east, west } = boundsToConvert;
    return {
      lat: (north + south) / 2,
      lon: (east + west) / 2,
    };
  };

  /**
   * Get bounds as a query string for URLs
   */
  const getBoundsAsQueryString = (boundsToConvert: TMapBounds | null = bounds): string => {
    if (!hasValidBounds(boundsToConvert) || !boundsToConvert) return '';

    const { north, south, east, west } = boundsToConvert;
    return `north=${north}&south=${south}&east=${east}&west=${west}`;
  };

  /**
   * Get bounds and center combined for API calls
   */
  const getBoundsAndCenterForAPI = (boundsToConvert: TMapBounds | null = bounds) => {
    const boundsParams = getBoundsForAPI(boundsToConvert);
    const centerParams = getCenterFromBounds(boundsToConvert);

    if (!boundsParams || !centerParams) return null;

    return {
      ...boundsParams,
      center_ll: [centerParams.lat, centerParams.lon].join(','),
    };
  };

  return {
    bounds,
    hasValidBounds: hasValidBounds(),
    setBounds,
    getBoundsForAPI,
    getCenterFromBounds,
    getBoundsAndCenterForAPI,
    getBoundsAsQueryString,
    // Utility functions that take bounds as parameter
    hasValidBoundsFor: hasValidBounds,
    getBoundsForAPIFor: getBoundsForAPI,
    getCenterFromBoundsFor: getCenterFromBounds,
    getBoundsAndCenterForAPIFor: getBoundsAndCenterForAPI,
    getBoundsAsQueryStringFor: getBoundsAsQueryString,
  };
};
