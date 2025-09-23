'use client';
import { useEffect, useRef } from 'react';
import { MapOptions, LeafletMapProps } from '../types';
import { MAP_TILES, DEFAULT_TILE, MapTileType, getTileTypeForZoom } from '../utils/mapTiles';

const LeafletMap: React.FC<LeafletMapProps> = ({
  center = { lat: 10.8231, lng: 106.6297 }, // Ho Chi Minh City coordinates
  zoom = 13,
  className = 'h-full w-full',
  onMapReady,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const currentTileLayerRef = useRef<unknown>(null);
  const currentTileTypeRef = useRef<MapTileType | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const initializeMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;

      // Prevent double initialization
      if (mapInstanceRef.current) {
        console.warn('Map already initialized, skipping...');
        return;
      }

      try {
        // Dynamic imports for Leaflet
        const L = await import('leaflet');

        // Import Leaflet CSS (ignore TypeScript error for CSS import)
        // @ts-ignore - CSS imports are not recognized by TypeScript but work with bundlers
        await import('leaflet/dist/leaflet.css');

        // Fix for default markers in Leaflet with webpack
        // @ts-ignore - Leaflet internal property access
        delete (L.Icon.Default.prototype as unknown)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Clear any existing map container content
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }

        // Create map instance
        const mapOptions: MapOptions = {
          center,
          zoom,
          zoomControl: true,
          attributionControl: true,
        };

        const map = L.map(mapRef.current, mapOptions);

        // Function to switch tile layer based on zoom
        const switchTileLayer = (zoomLevel: number) => {
          const requiredTileType = getTileTypeForZoom(zoomLevel);

          // Only switch if tile type has changed
          if (currentTileTypeRef.current === requiredTileType) return;

          // Remove current tile layer if exists
          if (currentTileLayerRef.current) {
            try {
              (map as any).removeLayer(currentTileLayerRef.current);
            } catch (error) {
              console.warn('Error removing tile layer:', error);
            }
          }

          // Add new tile layer
          const tileConfig = MAP_TILES[requiredTileType];
          const layerOptions: any = {
            attribution: tileConfig.attribution,
            maxZoom: tileConfig.maxZoom,
          };

          // Add subdomains only if they exist
          if ('subdomains' in tileConfig) {
            layerOptions.subdomains = tileConfig.subdomains;
          }

          const newTileLayer = L.tileLayer(tileConfig.url, layerOptions);
          newTileLayer.addTo(map);

          // Update refs
          currentTileLayerRef.current = newTileLayer;
          currentTileTypeRef.current = requiredTileType;

          console.log(`Switched to ${requiredTileType} at zoom level ${zoomLevel}`);
        };

        // Add initial tile layer based on current zoom
        switchTileLayer(zoom);

        // Listen for zoom changes
        map.on('zoomend', () => {
          const currentZoom = (map as any).getZoom();
          switchTileLayer(currentZoom);
        });

        // Add a sample marker
        L.marker(center)
          .addTo(map)
          .bindPopup('Chuẩn Nhà Đất - Bản đồ bất động sản')
          .openPopup();

        mapInstanceRef.current = map;

        // Call onMapReady callback if provided
        if (onMapReady) {
          onMapReady(map);
        }

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeMap, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (mapInstanceRef.current) {
        try {
          // @ts-ignore - Leaflet map instance has remove method but TypeScript doesn't recognize it
          (mapInstanceRef.current as any).remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Handle prop changes separately
  useEffect(() => {
    if (mapInstanceRef.current && typeof window !== 'undefined') {
      try {
        // @ts-ignore - Leaflet map methods
        (mapInstanceRef.current as any).setView([center.lat, center.lng], zoom);
      } catch (error) {
        console.warn('Error updating map view:', error);
      }
    }
  }, [center, zoom]);

  return <div ref={mapRef} className={className} />;
};

export default LeafletMap;
