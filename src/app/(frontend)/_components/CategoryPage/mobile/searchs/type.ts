import { TPhoto } from '@common/types';

export interface IProject {
  url: string;
  long_name: string;
  name: string;
}

/**
 * Consolidated product type for listing pages and category responses
 * Combines functionality from the old IProduct interface
 */
export interface IProductList {
  // Basic identification
  id: number;
  uid: string;
  title: string;
  slug: string;

  // Location info
  short_location_name: string;

  // Property details
  bedrooms_count: number;
  bathrooms_count: number | null;

  // Formatted display values
  formatted_price: string | null;
  formatted_area: string;
  formatted_price_per_m2: string | null;
  formatted_direction: string;
  formatted_facade_with_label: string;
  formatted_floors: string;
  formatted_kt: string | null;
  formatted_publish_at: string | null;

  // Media
  featured_image_url: string;
  images: TPhoto[];
  images_count: number;
  youtube_url?: string;

  // Additional metadata
  name?: string;
  bus_cat_type?: string;
  ads_type?: string;
  project?: IProject;
}

export interface Author {
  id: number;
  slug: string;
  full_name: string;
  avatar_url: string;
  profile_tags: string[];
  job_title: string;
  address: string;
  phone: string;
  posts_count: number;
  formatted_badges: string[];
  description: string;
  formatted_joined_at: string;
  gender: string;
  facebook_url?: string;
  website_url?: string;
  youtube_url?: string;
}

/**
 * Consolidated product type for detail pages
 * Contains all detailed information for product detail views
 * Combines functionality from IProductDetail and ProductViewed
 */
export interface IProductDetail {
  // Basic identification
  id: number;
  uid: string;
  title: string;
  slug?: string; // From ProductViewed
  detail_path: string;

  // Business classification
  business_type: string;
  category_type: string;
  ads_type: string;
  bus_cat_type?: string; // From ProductViewed

  // Location and address
  full_address: string;
  short_location_name?: string; // From ProductViewed
  lat: number;
  lon: number;

  // Property details
  bedrooms_count: number;
  bathrooms_count: number;
  entrance: number;
  floors_count: number;
  price_per_m2: number;

  // Legal and status
  phap_ly: string;
  visibility: string;
  hide_on_frontend_reason: string | null;

  // Formatted display values
  formatted_price: string;
  formatted_area: string;
  formatted_price_per_m2: string;
  formatted_publish_at: string;
  formatted_facade_with_label: string;
  formatted_floors?: string; // From ProductViewed
  formatted_kt: string;

  // Optional formatted fields
  formatted_facade?: string;
  formatted_entrance?: string;
  formatted_direction?: string;
  formatted_furniture?: string;
  formatted_phap_ly?: string;

  // Media
  images: TPhoto[];
  images_count: number;
  featured_image_url?: string | null; // From ProductViewed
  youtube_url?: string;

  // Content
  description: string;

  // Relationships
  author: Author;
  breadcrumb: A;
  user_id?: number; // From ProductViewed
}

/**
 * Union type for components that can accept either product list or detail data
 * Useful for components like ProductCard that work with both listing and detail views
 */
export type IProductData = IProductList | IProductDetail;

/**
 * Type for viewed product history/details
 * Uses the consolidated IProductDetail type
 */
export interface IViewedProductDetail {
  id: number;
  product: IProductDetail;
  created_at: string;
}
