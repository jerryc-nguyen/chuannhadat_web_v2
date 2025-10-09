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
    const isInBounds = bounds.contains([location.lat, location.lon]);

    console.log('🗺️ Map bounds check:', {
      location,
      bounds: {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      },
      isInBounds
    });

    return isInBounds;
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
   * Calculate the pixel offset needed to center the marker in the visible map area
   */
  const calculatePanelOffset = useCallback(() => {
    const windowWidth = window.innerWidth;

    // Check which panels are shown
    const isListingPanelShown = !!selectedLocation;
    const isInfoPanelShown = !!selectedMarker;
    const areBothPanelsShown = isListingPanelShown && isInfoPanelShown;
    const canShowBothPanels = windowWidth >= 1200; // Same logic as in MapDesktop

    let panelWidth = 0;

    if (areBothPanelsShown && canShowBothPanels) {
      // Both panels are shown side by side - offset by one full panel width to the right
      panelWidth = -SEARCH_BOX_WIDTH_WITH_PADDING; // Negative to pan right (away from panels)
    } else if (isListingPanelShown || isInfoPanelShown) {
      // Only one panel is shown - offset by half panel width to the right
      panelWidth = -SEARCH_BOX_WIDTH_WITH_PADDING / 2; // Negative to pan right (away from panel)
    }

    console.log('🎯 Panel offset calculation:', {
      windowWidth,
      isListingPanelShown,
      isInfoPanelShown,
      areBothPanelsShown,
      canShowBothPanels,
      panelWidth,
      offsetX: panelWidth,
      direction: panelWidth < 0 ? 'right (away from panels)' : 'no offset'
    });

    return { x: panelWidth, y: 0 };
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

    // Check if marker needs panning: must be behind panels AND outside map bounds
    const isBehindPanels = isMarkerBehindPanels(location);
    const isInBounds = isMarkerInMapBounds(location);

    if (isBehindPanels || !isInBounds) {
      // Pan to location first, then apply panel offset
      if (options?.zoom) {
        map.setView([lat, lon], options.zoom, { animate: true });
      } else {
        map.panTo([lat, lon], { animate: true });
      }

      const offset = calculatePanelOffset();
      if (offset.x !== 0 || offset.y !== 0) {
        map.panBy([offset.x, offset.y], panOptions);
        console.log('🎯 Applied smart panning: marker was behind panels and out of bounds', { offset });
      }
    } else {
      console.log('🎯 No panning needed:', {
        isBehindPanels,
        isInBounds,
        reason: isInBounds ? 'marker already in view' : 'marker visible and in bounds'
      });
    }
  }, [map, calculatePanelOffset, isMarkerBehindPanels, isMarkerInMapBounds]);

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
