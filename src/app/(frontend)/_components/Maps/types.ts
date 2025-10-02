// Import Leaflet Map type
import type { Map as LeafletMap } from 'leaflet';
import { IUser } from '@/common/types';

export interface LatLng {
  lat: number;
  lon: number;
  original?: boolean;
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
  uid: string;
  mappable_ype: string;
  mappable_id: number;
  mappable_data: IUser;
  location: LatLng;
  ward_id?: number;
  street_id?: number;
  district_id?: number;
  city_id?: number;
  business_types?: string[];
  category_types?: string[];
  meta?: MarkerMeta;
  marker_icon_url?: string;
  marker_label?: string;
  location_name?: string;
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
  onFilterChange?: (filters: { businessType?: string; categoryType?: string }) => void;
  className?: string;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}


// Export the Leaflet Map type for use in other files
export type { LeafletMap };
