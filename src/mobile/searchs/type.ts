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
}

export interface Image {
  id: number;
  url: string;
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
}

export interface IProductDetail {
  id: number;
  uid: string;
  title: string;
  detail_path: string;
  business_type: string;
  category_type: string;
  ads_type: string;
  images: Image[];
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
  price_per_m2: number;
  formatted_kt: string;
  author: Author;
}
