export interface LatLng {
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  title: string;
  price: string;
  location: LatLng;
  type: 'sale' | 'rent';
  image?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  address?: string;
}

export interface MapOptions {
  center: LatLng;
  zoom: number;
  zoomControl?: boolean;
  attributionControl?: boolean;
}

export interface SearchResult {
  id: string;
  name: string;
  location: LatLng;
  type: 'property' | 'location' | 'project';
}

export interface LeafletMapProps {
  center?: LatLng;
  zoom?: number;
  className?: string;
  onMapReady?: (map: unknown) => void;
  tileType?: string;
}

export interface MapControlsProps {
  onSearch?: (query: string) => void;
  onLocationClick?: () => void;
  onLayersClick?: () => void;
  onNavigationClick?: () => void;
  onHomeClick?: () => void;
  className?: string;
}
