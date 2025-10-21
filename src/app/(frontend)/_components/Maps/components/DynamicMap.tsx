'use client';
import { useEffect, useState } from 'react';
import { LeafletMapProps } from '../types';

const DynamicMap: React.FC<LeafletMapProps> = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return;

    const loadLeaflet = async () => {
      try {
        // Try to dynamically import leaflet
        await import('leaflet');
        // @ts-ignore - CSS imports work with bundlers but TypeScript doesn't recognize them
        await import('leaflet/dist/leaflet.css');

        // @ts-ignore - CSS imports work with bundlers but TypeScript doesn't recognize them
        await import('../leaflet-overrides.css');
        // @ts-ignore - CSS imports work with bundlers but TypeScript doesn't recognize them
        await import('../current-location-marker.css');
        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to load Leaflet:', err);
        setError('Leaflet library is not installed. Please run: npm install leaflet @types/leaflet');
      }
    };

    loadLeaflet();
  }, []);

  if (error) {
    // Dynamically import and show fallback map
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const FallbackMap = require('./FallbackMap').default;
    return <FallbackMap className={props.className} />;
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Dynamically import the actual LeafletMap component only after Leaflet is loaded
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const LeafletMapComponent = require('./LeafletMap').default;
  return <LeafletMapComponent {...props} />;
};

export default DynamicMap;
