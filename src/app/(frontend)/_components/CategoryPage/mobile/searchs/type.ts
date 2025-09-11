import { TPhoto } from '@common/models';

export interface IProject {
  url: string;
  long_name: string;
  name: string;
}

export interface IProduct {
  bathrooms_count: number | null;
  bedrooms_count: number;
  featured_image_url: string;
  formatted_area: string;
  formatted_direction: string;
  formatted_facade_with_label: string;
  formatted_floors: string;
  formatted_kt: string | null;
  formatted_price: string | null;
  formatted_price_per_m2: string | null;
  formatted_publish_at: string | null;
  id: number;
  images_count: number;
  short_location_name: string;
  slug: string;
  title: string;
  uid: string;
  name?: string;
  bus_cat_type?: string;
  ads_type?: string;
  images: TPhoto[];
  youtube_url?: string;
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

export interface IProductDetail {
  id: number;
  uid: string;
  title: string;
  detail_path: string;
  business_type: string;
  category_type: string;
  ads_type: string;
  images: TPhoto[];
  images_count: number;
  full_address: string;
  formatted_price: string;
  formatted_area: string;
  formatted_price_per_m2: string;
  description: string;
  bedrooms_count: number;
  bathrooms_count: number;
  entrance: number;
  floors_count: number;
  phap_ly: string;
  lat: number;
  lon: number;
  visibility: string;
  hide_on_frontend_reason: string | null;
  formatted_publish_at: string;
  formatted_facade_with_label: string;
  formatted_facade?: string;
  formatted_entrance?: string;
  formatted_direction?: string;
  formatted_furniture?: string;
  formatted_phap_ly?: string;
  price_per_m2: number;
  formatted_kt: string;
  author: Author;
  breadcrumb: A;
  youtube_url?: string;
}

export interface IViewedProductDetail {
  id: number;
  product: ProductViewed;
  created_at: string;
}

// TODO: check if duplicate with IProductDetail
interface ProductViewed {
  id: number;
  uid: string;
  title: string;
  slug: string;
  detail_path: string;
  featured_image_url: null;
  ads_type: string;
  images: TPhoto[];
  short_location_name: string;
  formatted_price: string;
  formatted_area: string;
  formatted_price_per_m2: string;
  formatted_floors: string;
  formatted_direction: string;
  formatted_publish_at: string;
  formatted_facade_with_label: string;
  bus_cat_type: string;
  formatted_kt: null;
  bedrooms_count: number;
  bathrooms_count: number;
  images_count: number;
  user_id: number;
  youtube_url: string;
}
