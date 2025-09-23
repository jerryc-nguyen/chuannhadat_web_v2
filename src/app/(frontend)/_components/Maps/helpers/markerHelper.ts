import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../constants';

export interface MarkerPositionResult {
  markerX: number;
  markerY: number;
  containerWidth: number;
  panelWidth: number;
  isBehindPanel: boolean;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Calculates marker position relative to map container and determines if it's behind the info panel
 * @param map - Leaflet map instance
 * @param markerLatLng - Marker coordinates
 * @returns Position calculation results
 */
export const calculateMarkerPosition = (
  map: any,
  markerLatLng: LatLng
): MarkerPositionResult | null => {
  try {
    if (!map || typeof window === 'undefined' || !(window as any).L) {
      return null;
    }

    const L = (window as any).L;
    const latLng = L.latLng(markerLatLng.lat, markerLatLng.lng);
    const markerPoint = map.latLngToContainerPoint(latLng);

    // Get map container dimensions
    const mapContainer = map._container;
    const containerRect = mapContainer.getBoundingClientRect();

    // Panel covers the left side of the screen (positioned at left-0)
    const panelWidth = SEARCH_BOX_WIDTH_WITH_PADDING;
    const isBehindPanel = markerPoint.x < panelWidth;

    return {
      markerX: markerPoint.x,
      markerY: markerPoint.y,
      containerWidth: containerRect.width,
      panelWidth,
      isBehindPanel
    };
  } catch (error) {
    console.warn('Error calculating marker position:', error);
    return null;
  }
};
