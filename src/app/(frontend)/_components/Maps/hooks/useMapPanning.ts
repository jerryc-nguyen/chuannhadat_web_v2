import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { mapAtom, selectedLocationAtom, selectedMarkerAtom } from '../states/mapAtoms';
import { LatLng } from '../types';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../constants';

// Debug flag to control logging output
const DEBUG_MAP_PANNING = false; // Set to true to enable debug logs

/**
 * Debug logger that only logs when DEBUG_MAP_PANNING is true
 * @param message - The log message
 * @param data - Optional data to log
 */
const debugLog = (message: string, data?: unknown) => {
  if (DEBUG_MAP_PANNING) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

/**
 * Debug warning logger that only logs when DEBUG_MAP_PANNING is true
 * @param message - The warning message
 * @param data - Optional data to log
 */
const debugWarn = (message: string, data?: unknown) => {
  if (DEBUG_MAP_PANNING) {
    if (data) {
      console.warn(message, data);
    } else {
      console.warn(message);
    }
  }
};

/**
 * Custom hook for map panning functionality
 * Can be used in both mobile and desktop components
 */
export const useMapPanning = () => {
  const map = useAtomValue(mapAtom);
  const selectedLocation = useAtomValue(selectedLocationAtom);
  const selectedMarker = useAtomValue(selectedMarkerAtom);

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

    debugLog('🗺️ Map bounds check:', {
      location,
      isInBounds: leafletResult,
      reason: leafletResult ? 'marker in bounds' : 'marker out of bounds'
    });

    return leafletResult;
  }, [map]);

  /**
   * Check if a marker at the given location would be behind panels
   */
  const isMarkerBehindPanels = useCallback((location: LatLng) => {
    if (!map) return false;

    const windowWidth = window.innerWidth;
    const isListingPanelShown = !!selectedLocation;
    const isInfoPanelShown = !!selectedMarker;
    const areBothPanelsShown = isListingPanelShown && isInfoPanelShown;
    const canShowBothPanels = windowWidth >= 1200;

    // If no panels are shown, marker can't be behind panels
    if (!isListingPanelShown && !isInfoPanelShown) {
      return false;
    }

    // Convert the location to screen coordinates
    const markerPoint = map.latLngToContainerPoint([location.lat, location.lon]);

    // Calculate panel coverage area
    let panelCoverageWidth = 0;
    if (areBothPanelsShown && canShowBothPanels) {
      panelCoverageWidth = SEARCH_BOX_WIDTH_WITH_PADDING * 2; // 1024px
    } else {
      panelCoverageWidth = SEARCH_BOX_WIDTH_WITH_PADDING; // 512px
    }

    // Check if marker is in the panel coverage area
    const isBehind = markerPoint.x < panelCoverageWidth;

    debugLog('🎯 Panel collision check:', {
      location,
      windowWidth,
      isListingPanelShown,
      isInfoPanelShown,
      areBothPanelsShown,
      canShowBothPanels,
      markerScreenX: markerPoint.x,
      panelCoverageWidth,
      isBehind,
      result: isBehind ? 'BEHIND PANELS' : 'VISIBLE'
    });

    return isBehind;
  }, [map, selectedLocation, selectedMarker]);

  /**
   * Calculate where the marker should be positioned in the visible area (not behind panels)
   */
  const calculateVisibleAreaCenter = useCallback(() => {
    const windowWidth = window.innerWidth;

    // Check which panels are shown
    const isListingPanelShown = !!selectedLocation;
    const isInfoPanelShown = !!selectedMarker;
    const areBothPanelsShown = isListingPanelShown && isInfoPanelShown;
    const canShowBothPanels = windowWidth >= 1200; // Same logic as in MapDesktop

    let visibleAreaCenterX = windowWidth / 2; // Default: center of screen

    if (areBothPanelsShown && canShowBothPanels) {
      // Both panels: visible area starts after both panels
      const availableWidth = windowWidth - (SEARCH_BOX_WIDTH_WITH_PADDING * 2);
      visibleAreaCenterX = (SEARCH_BOX_WIDTH_WITH_PADDING * 2) + (availableWidth / 2);
    } else if (isListingPanelShown || isInfoPanelShown) {
      // Single panel: visible area starts after one panel
      const availableWidth = windowWidth - SEARCH_BOX_WIDTH_WITH_PADDING;
      visibleAreaCenterX = SEARCH_BOX_WIDTH_WITH_PADDING + (availableWidth / 2);
    }

    // Calculate offset from screen center to visible area center
    const screenCenterX = windowWidth / 2;
    const offsetX = visibleAreaCenterX - screenCenterX;

    debugLog('🎯 Visible area calculation:', {
      windowWidth,
      isListingPanelShown,
      isInfoPanelShown,
      areBothPanelsShown,
      canShowBothPanels,
      screenCenterX,
      visibleAreaCenterX,
      offsetX,
      meaning: `marker should appear ${offsetX}px ${offsetX > 0 ? 'right' : 'left'} of screen center`
    });

    return { x: offsetX, y: 0 };
  }, [selectedLocation, selectedMarker]);

  /**
   * Pan the map to a specific location (simple panning without panel awareness)
   * @param location - The location to pan to (lat, lon)
   * @param options - Optional panning configuration
   */
  const panToLocation = useCallback((
    location: LatLng,
    options?: {
      animate?: boolean;
      duration?: number;
      zoom?: number;
    }
  ) => {
    if (!map) {
      debugWarn('Map not available for panning');
      return;
    }

    const { lat, lon } = location;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      debugWarn('Invalid location coordinates for panning:', location);
      return;
    }

    const panOptions = {
      animate: options?.animate !== false,
      duration: options?.duration || 0.5
    };

    // Pan to the location
    if (options?.zoom) {
      // Use setView if zoom level is specified
      map.setView([lat, lon], options.zoom, panOptions);
    } else {
      // Use panTo to maintain current zoom level
      map.panTo([lat, lon], panOptions);
    }

    debugLog('🗺️ Panning map to location:', { lat, lon, options });
  }, [map]);

  /**
   * Calculate optimal map center position for out-of-bounds markers
   * @param location - The marker location
   * @param pixelOffset - The pixel offset for visible area centering
   * @returns The optimal map center coordinates
   */
  const calculateOptimalMapCenter = useCallback((location: LatLng, pixelOffset: { x: number; y: number }) => {
    if (!map) return location;

    const { lat, lon } = location;

    // If no offset needed, return original location
    if (pixelOffset.x === 0 && pixelOffset.y === 0) {
      return { lat, lon };
    }

    // Get current map center and convert to screen coordinates
    const currentCenter = map.getCenter();
    const currentCenterPoint = map.latLngToContainerPoint([currentCenter.lat, currentCenter.lng]);

    // Apply offset in opposite direction (move map center opposite to desired marker position)
    const adjustedCenterPoint = {
      x: currentCenterPoint.x - pixelOffset.x,
      y: currentCenterPoint.y - pixelOffset.y
    };

    // Convert back to coordinates to get the offset amount
    const adjustedCenter = map.containerPointToLatLng([adjustedCenterPoint.x, adjustedCenterPoint.y]);

    // Calculate coordinate offset
    const latOffset = adjustedCenter.lat - currentCenter.lat;
    const lonOffset = adjustedCenter.lng - currentCenter.lng;

    // Apply offset to target marker location
    const targetMapCenter = {
      lat: lat + latOffset,
      lon: lon + lonOffset
    };

    debugLog('🎯 Calculated optimal map center:', {
      originalMarker: { lat, lon },
      pixelOffset,
      coordinateOffset: { latOffset, lonOffset },
      targetMapCenter,
      reason: 'Position map so marker appears in visible area'
    });

    return targetMapCenter;
  }, [map]);

  /**
   * Handle panning for out-of-bounds markers
   * @param location - The marker location
   * @param options - Panning options
   */
  const handleOutOfBoundsPanning = useCallback((
    location: LatLng,
    options: { animate: boolean; duration: number; zoom?: number }
  ) => {
    if (!map) return;

    debugLog('🎯 Marker out of bounds, calculating optimal pan position');

    // Get the visible area offset
    const pixelOffset = calculateVisibleAreaCenter();

    // Calculate optimal map center position
    const targetMapCenter = calculateOptimalMapCenter(location, pixelOffset);

    // Pan to optimal position in one smooth motion
    if (options.zoom) {
      map.setView([targetMapCenter.lat, targetMapCenter.lon], options.zoom, {
        animate: options.animate,
        duration: options.duration
      });
    } else {
      map.panTo([targetMapCenter.lat, targetMapCenter.lon], {
        animate: options.animate,
        duration: options.duration
      });
    }

    debugLog('🎯 Applied single smooth pan to optimal position');
  }, [map, calculateVisibleAreaCenter, calculateOptimalMapCenter]);

  /**
   * Handle panning for in-bounds markers that might be behind panels
   * @param location - The marker location
   * @param options - Panning options
   */
  const handleInBoundsPanning = useCallback((
    location: LatLng,
    options: { animate: boolean; duration: number }
  ) => {
    if (!map) return;

    const isBehindPanels = isMarkerBehindPanels(location);

    if (isBehindPanels) {
      // Apply offset to move marker to visible area
      const pixelOffset = calculateVisibleAreaCenter();

      if (pixelOffset.x !== 0 || pixelOffset.y !== 0) {
        // Use negative offset because we're moving the map, not the marker
        map.panBy([-pixelOffset.x, -pixelOffset.y], {
          animate: options.animate,
          duration: options.duration
        });
        debugLog('🎯 Applied visible area offset for in-bounds marker:', { pixelOffset });
      }
    } else {
      debugLog('🎯 Marker is visible and not behind panels, no panning needed');
    }
  }, [map, isMarkerBehindPanels, calculateVisibleAreaCenter]);

  /**
   * Validate panning inputs
   * @param location - The location to validate
   * @returns True if inputs are valid
   */
  const validatePanningInputs = useCallback((location: LatLng): boolean => {
    if (!map) {
      debugWarn('Map not available for smart panning');
      return false;
    }

    const { lat, lon } = location;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      debugWarn('Invalid location coordinates for smart panning:', location);
      return false;
    }

    return true;
  }, [map]);

  /**
   * Pan the map to a location with panel-aware centering
   * Centers the marker in the visible map area (excluding panels)
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
    // Validate inputs
    if (!validatePanningInputs(location)) {
      return;
    }

    // Prepare panning options
    const panOptions = {
      animate: options?.animate !== false,
      duration: options?.duration || 0.5,
      zoom: options?.zoom
    };

    // Check if marker is currently in bounds
    const isInBounds = isMarkerInMapBounds(location);

    if (!isInBounds) {
      // Handle out-of-bounds markers
      handleOutOfBoundsPanning(location, panOptions);
    } else {
      // Handle in-bounds markers (check if behind panels)
      handleInBoundsPanning(location, panOptions);
    }
  }, [
    validatePanningInputs,
    isMarkerInMapBounds,
    handleOutOfBoundsPanning,
    handleInBoundsPanning
  ]);

  /**
   * Pan to current user location
   */
  const panToCurrentLocation = useCallback((options?: { zoom?: number }) => {
    if (!navigator.geolocation) {
      debugWarn('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        panToLocation(
          { lat: latitude, lon: longitude },
          { zoom: options?.zoom || 15 }
        );
      },
      (error) => {
        debugWarn('Error getting current location:', error);
      }
    );
  }, [panToLocation]);

  /**
   * Check if map is available for panning
   */
  const isMapReady = useCallback(() => {
    return !!map;
  }, [map]);

  return {
    panToLocation,
    panToLocationSmart,
    panToCurrentLocation,
    isMapReady,
  };
};
