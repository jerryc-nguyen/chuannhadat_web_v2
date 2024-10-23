import { HttpStatusCode } from 'axios';

export interface ISavesSummaryResponse {
  data: {
    saved_product_uids: string[];
  };
}

interface Image {
  id: number;
  url: string;
}

interface IPostData {
  id: number;
  uid: string;
  title: string;
  slug: string;
  featured_image_url: string | null;
  images: Image[];
  short_location_name: string;
  formatted_price: string;
  formatted_area: string;
  formatted_price_per_m2: string;
  formatted_floors: string;
  formatted_direction: string;
  formatted_publish_at: string;
  formatted_facade_with_label: string;
  formatted_kt: string | null;
  bedrooms_count: number;
  bathrooms_count: number;
  images_count: number;
  user_id: number;
}

interface Post {
  id: number;
  product: IPostData;
  created_at: string;
}

export interface Pagination {
  total_count: number;
  page: number;
  per_page: number;
}
export interface ISavedProductsResponse {
  code: HttpStatusCode;
  status: boolean;
  data: {
    code: number;
    status: boolean;
    pagination: Pagination;
    data: Post[];
  };
}
export enum ActionSaveProduct {
  Like = 'like',
  Unlike = 'unlike',
}
export interface ISaveProductPayload {
  product_uid: string;
  action: ActionSaveProduct;
}
export interface ISaveProductResponse {
  code: HttpStatusCode;
  status: boolean;
}
