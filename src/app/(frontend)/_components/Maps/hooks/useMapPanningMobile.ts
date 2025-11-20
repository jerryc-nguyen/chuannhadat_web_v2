import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { mapAtom } from '../states/mapAtoms';
import { LatLng } from '../types';
import { useMapPanning } from './useMapPanning';

// Debug flag to control logging output
const DEBUG_MAP_PANNING_MOBILE = true; // Set to true to enable debug logs

/**
 * Debug logger that only logs when DEBUG_MAP_PANNING_MOBILE is true
 * @param message - The log message
 * @param data - Optional data to log
 */
const debugLog = (message: string, data?: unknown) => {
  if (DEBUG_MAP_PANNING_MOBILE) {
    if (data) {
      console.log(`📱 ${message}`, data);
    } else {
      console.log(`📱 ${message}`);
    }
  }
};

/**
 * Debug warning logger that only logs when DEBUG_MAP_PANNING_MOBILE is true
 * @param message - The warning message
 * @param data - Optional data to log
 */
const debugWarn = (message: string, data?: unknown) => {
  if (DEBUG_MAP_PANNING_MOBILE) {
    if (data) {
      console.warn(`📱 ${message}`, data);
    } else {
      console.warn(`📱 ${message}`);
    }
  }
};

/**
 * Custom hook for map panning functionality on mobile
 * Simplified panning for mobile devices without panel-aware centering
 */
export const useMapPanningMobile = () => {
  const map = useAtomValue(mapAtom);

  // Use shared panning functionality
  const { panToLocation, panToCurrentLocation: sharedPanToCurrentLocation, isMapReady } = useMapPanning();

  /**
   * Check if a marker location is within the current map bounds
   */
  const isMarkerInMapBounds = useCallback((location: LatLng) => {
    if (!map) return false;

    const bounds = map.getBounds();
    const leafletResult = bounds.contains([location.lat, location.lon]);

    // Manual bounds check for comparison
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const west = bounds.getWest();

    const manualCheck =
      location.lat >= south &&
      location.lat <= north &&
      location.lon >= west &&
      location.lon <= east;

    // Debug: Check if there's a discrepancy between Leaflet and manual calculation
    if (leafletResult !== manualCheck) {
      debugWarn('🚨 Bounds check discrepancy:', {
        location,
        leafletResult,
        manualCheck,
        bounds: { north, south, east, west }
      });
    }

    debugLog('📱 Map bounds check:', {
      location,
      isInBounds: leafletResult,
      reason: leafletResult ? 'marker in bounds' : 'marker out of bounds'
    });

    return leafletResult;
  }, [map]);

  /**
   * Calculate pan offset to position marker at center of top 1/3 of screen
   * @param location - The marker location to position
   * @returns Pixel offset to pan the map
   */
  const calculateTopThirdCenter = useCallback((location: LatLng) => {
    if (!map) return { x: 0, y: 0 };

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Target position: center of top 1/3 of screen
    const targetX = windowWidth / 2;  // Center horizontally
    const targetY = windowHeight / 6; // 1/6 from top = center of top 1/3

    // Get marker's current screen position
    const markerPoint = map.latLngToContainerPoint([location.lat, location.lon]);

    // Calculate pan offset: difference between current position and target position
    const offsetX = markerPoint.x - targetX; // Positive = marker is right of target
    const offsetY = markerPoint.y - targetY; // Positive = marker is below target

    debugLog('📱 Top 1/3 center calculation:', {
      location,
      windowHeight,
      windowWidth,
      targetX,
      targetY,
      markerScreenX: markerPoint.x,
      markerScreenY: markerPoint.y,
      offsetX,
      offsetY,
      meaning: `pan map by (-${offsetX}, -${offsetY}) to move marker to top 1/3 center`
    });

    return { x: -offsetX, y: -offsetY };
  }, [map]);

  /**
   * Pan the map to a location with smart centering for mobile
   * Ensures markers are visible above the bottom sheet when it's open
   * @param location - The location to pan to (lat, lon)
   * @param options - Optional panning configuration
   */
  const panToLocationSmart = useCallback((
    location: LatLng,
    options?: {
      animate?: boolean;
      duration?: number;
      zoom?: number;
    }
  ) => {
    if (!map) return;

    // Always position marker at center of top 1/3 of screen
    const pixelOffset = calculateTopThirdCenter(location);

    if (options?.zoom) {
      map.setView([location.lat, location.lon], options.zoom, {
        animate: options?.animate !== false,
        duration: options?.duration || 1
      });
    } else {
      // Always pan to position marker at top 1/3 center
      // Use negative offset because we're moving the map, not the marker
      map.panBy([-pixelOffset.x, -pixelOffset.y], {
        animate: options?.animate !== false,
        duration: options?.duration || 1
      });
    }

    debugLog('📱 Applied top 1/3 center positioning:', {
      location,
      pixelOffset,
      panBy: [-pixelOffset.x, -pixelOffset.y]
    });
  }, [map, calculateTopThirdCenter]);

  /**
   * Pan to current user location
   */
  const panToCurrentLocation = useCallback((options?: { zoom?: number }) => {
    return sharedPanToCurrentLocation({ ...options, platform: 'mobile' });
  }, [sharedPanToCurrentLocation]);

  /**
   * Check if a marker at the given location would be behind the bottom sheet
   */
  const isMarkerBehindPanels = useCallback((location: LatLng) => {
    if (!map) return false;

    // Convert the location to screen coordinates
    const markerPoint = map.latLngToContainerPoint([location.lat, location.lon]);

    // Bottom sheet typically takes up about 40% of screen height (adjust as needed)
    const windowHeight = window.innerHeight;
    const bottomSheetHeight = windowHeight * 0.4; // 40% of screen height
    const bottomSheetTop = windowHeight - bottomSheetHeight;

    // Check if marker is in the bottom sheet area
    const isBehindBottomSheet = markerPoint.y > bottomSheetTop;

    debugLog('📱 Bottom sheet collision check:', {
      location,
      windowHeight,
      bottomSheetHeight,
      bottomSheetTop,
      markerScreenY: markerPoint.y,
      isBehindBottomSheet,
      result: isBehindBottomSheet ? 'BEHIND BOTTOM SHEET' : 'VISIBLE'
    });

    return isBehindBottomSheet;
  }, [map]);

  /**
   * Pan the map to a location with smart centering for mobile
   * Ensures markers are visible above the bottom sheet when it's open
   * @param location - The location to pan to (lat, lon)
   * @param options - Optional panning configuration
   */
  const panToLocationSmartV2 = useCallback((
    location: LatLng,
    options?: {
      animate?: boolean;
      duration?: number;
      zoom?: number;
    }
  ) => {
    if (!map) return;

    const isBehindBottomSheet = isMarkerBehindPanels(location);

    if (isBehindBottomSheet) {
      // Calculate the pixel offset needed to move marker above bottom sheet
      const windowHeight = window.innerHeight;
      const bottomSheetHeight = windowHeight * 0.4; // 40% of screen height
      const visibleAreaTop = windowHeight - bottomSheetHeight;

      // Target position: center of the visible area above bottom sheet
      const targetScreenY = visibleAreaTop / 2;

      // Get current marker position on screen
      const markerPoint = map.latLngToContainerPoint([location.lat, location.lon]);

      // Calculate pan offset: to move marker from current position to target position
      // If marker is below target (higher y), we need to pan down to move marker up
      const yOffset = markerPoint.y - targetScreenY; // Positive if marker is below target

      debugLog('📱 Marker behind bottom sheet:', {
        location,
        windowHeight,
        bottomSheetHeight,
        visibleAreaTop,
        targetScreenY,
        markerScreenY: markerPoint.y,
        yOffset,
        panBy: [0, yOffset],
        action: 'pan down to move marker up'
      });

      // Pan the map down (positive y) to move markers up on screen
      map.panBy([0, yOffset], {
        animate: options?.animate !== false,
        duration: options?.duration || 0.5
      });
    } else {
      // Marker is already visible, just pan normally
      debugLog('📱 Marker is already visible above bottom sheet');
      panToLocation(location, options);
    }
  }, [map, panToLocation, isMarkerBehindPanels]);



  return {
    panToLocation,
    panToLocationSmart,
    panToCurrentLocation,
    isMapReady,
    isMarkerInMapBounds,
    panToLocationSmartV2,
    isMarkerBehindPanels
  };
};
