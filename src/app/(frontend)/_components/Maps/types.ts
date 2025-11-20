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

export interface MarkerProfile extends IUser {
  facebook_url?: string;
  website_url?: string;
  youtube_url?: string;
}

export interface Marker {
  id: number;
  uid: string;
  mappable_type: 'User' | string;
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
  profile?: MarkerProfile; // Additional profile data from listing API
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


// Map setting data structure for autocomplete results
export interface TMapSetting {
  id: number;
  uid: string;
  mappable_type: string;
  mappable_id: number;
  location: LatLng;
  location_name: string;
  formatted_address: string;
}

// Export the Leaflet Map type for use in other files
export type { LeafletMap };
