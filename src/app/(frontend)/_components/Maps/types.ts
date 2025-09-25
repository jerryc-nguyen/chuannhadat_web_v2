// Import Leaflet Map type
import type { Map as LeafletMap } from 'leaflet';

export interface LatLng {
  lat: number;
  lon: number;
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

export interface Professional {
  id: string;
  name: string;
  type: 'broker' | 'company' | 'bank_assistant';
  location: LatLng;
  avatar?: string;
  company?: string;
  specialty?: string[];
  experience?: number; // years of experience
  rating?: number; // 1-5 stars
  reviewCount?: number;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  services?: string[];
  languages?: string[];
  certifications?: string[];
  verified?: boolean;
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
  type: 'property' | 'location' | 'project' | 'professional';
}


export interface MarkerMeta {
  [key: string]: unknown;
}

export interface Marker {
  id: number;
  mappableType: string;
  mappableId: number;
  location: LatLng;
  wardId?: number;
  streetId?: number;
  districtId?: number;
  cityId?: number;
  businessTypes?: string[];
  categoryTypes?: string[];
  meta?: MarkerMeta;
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
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}


// Export the Leaflet Map type for use in other files
export type { LeafletMap };
