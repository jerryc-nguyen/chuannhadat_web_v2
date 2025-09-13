import { TPhoto } from "@common/types";

export interface IProject {
  url: string;
  long_name: string;
  name: string;
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
 * Consolidated product type for listing pages and category responses
 * Combines functionality from the old IProduct interface
 */
export interface IProductList {
  // Basic identification
  id: number;
  uid: string;
  title: string;
  slug: string;
  detail_path: string;

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


/**
 * Type for viewed product history/details
 * Uses the consolidated IProductDetail type
 */
export interface ISavedProducts {
  id: number;
  product: IProductList;
  created_at: string;
  activity_id: number;
}

export type IViewedProducts = ISavedProducts;
