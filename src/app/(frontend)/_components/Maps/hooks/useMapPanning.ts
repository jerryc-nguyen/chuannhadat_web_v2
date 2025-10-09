import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { mapAtom, selectedLocationAtom, selectedMarkerAtom } from '../states/mapAtoms';
import { LatLng } from '../types';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../constants';

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
      console.warn('🚨 Bounds check discrepancy:', {
        location,
        leafletResult,
        manualCheck,
        bounds: { north, south, east, west }
      });
    }

    console.log('🗺️ Map bounds check:', {
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

    console.log('🎯 Panel collision check:', {
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

    console.log('🎯 Visible area calculation:', {
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
      console.warn('Map not available for panning');
      return;
    }

    const { lat, lon } = location;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      console.warn('Invalid location coordinates for panning:', location);
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

    console.log('🗺️ Panning map to location:', { lat, lon, options });
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
    if (!map) {
      console.warn('Map not available for smart panning');
      return;
    }

    const { lat, lon } = location;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      console.warn('Invalid location coordinates for smart panning:', location);
      return;
    }

    const panOptions = {
      animate: options?.animate !== false,
      duration: options?.duration || 0.5
    };

    // First, center the map on the target location
    // if (options?.zoom) {
    //   map.setView([lat, lon], options.zoom, { animate: false });
    // } else {
    //   map.panTo([lat, lon], { animate: false });
    // }

    // Check if marker is currently in bounds
    const isInBounds = isMarkerInMapBounds(location);

    if (!isInBounds) {
      // Marker is out of bounds - calculate optimal position directly
      console.log('🎯 Marker out of bounds, calculating optimal pan position');

      // Get the visible area center offset
      const offset = calculateVisibleAreaCenter();

      // Start with the marker location as the target map center
      let targetMapCenter = { lat, lon };

      if (offset.x !== 0 || offset.y !== 0) {
        // Convert pixel offset to map coordinate offset
        // We need to calculate how much to adjust the map center
        // so that when the marker is displayed, it appears offset by the panel amount

        // Get current map center and convert offset to map coordinates
        const currentCenter = map.getCenter();
        const currentCenterPoint = map.latLngToContainerPoint([currentCenter.lat, currentCenter.lng]);

        // Apply the offset to the center point (opposite direction)
        const adjustedCenterPoint = {
          x: currentCenterPoint.x - offset.x, // Move map center opposite to where we want marker to appear
          y: currentCenterPoint.y - offset.y
        };

        // Convert back to lat/lng to get the offset amount
        const adjustedCenter = map.containerPointToLatLng([adjustedCenterPoint.x, adjustedCenterPoint.y]);

        // Calculate the coordinate difference
        const latOffset = adjustedCenter.lat - currentCenter.lat;
        const lonOffset = adjustedCenter.lng - currentCenter.lng;

        // Apply this offset to our target marker location
        targetMapCenter = {
          lat: lat + latOffset,
          lon: lon + lonOffset
        };

        console.log('🎯 Calculated optimal map center:', {
          originalMarker: { lat, lon },
          panelOffset: offset,
          coordinateOffset: { latOffset, lonOffset },
          targetMapCenter,
          reason: 'Position map so marker appears in visible area'
        });
      }

      // Pan to the optimal position in one smooth motion
      if (options?.zoom) {
        map.setView([targetMapCenter.lat, targetMapCenter.lon], options.zoom, panOptions);
      } else {
        map.panTo([targetMapCenter.lat, targetMapCenter.lon], panOptions);
      }

      console.log('🎯 Applied single smooth pan to optimal position');
    } else {
      // Marker is in bounds - check if it's behind panels
      const isBehindPanels = isMarkerBehindPanels(location);

      if (isBehindPanels) {
        // Apply offset to move marker to visible area
        const offset = calculateVisibleAreaCenter();
        if (offset.x !== 0 || offset.y !== 0) {
          map.panBy([-offset.x, -offset.y], panOptions); // Negative because we're moving the map, not the marker
          console.log('🎯 Applied visible area offset for in-bounds marker:', { offset });
        }
      } else {
        console.log('🎯 Marker is visible and not behind panels, no panning needed');
      }
    }
  }, [map, calculateVisibleAreaCenter, isMarkerBehindPanels, isMarkerInMapBounds]);

  /**
   * Pan to current user location
   */
  const panToCurrentLocation = useCallback((options?: { zoom?: number }) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
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
        console.error('Error getting current location:', error);
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
