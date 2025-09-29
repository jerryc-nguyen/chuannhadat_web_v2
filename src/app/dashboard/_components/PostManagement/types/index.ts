import { OptionForSelect, TPhoto } from '@common/types';

export interface IPayloadCreateSchedule {
  hour: string;
  minute: string;
}
export interface IPayloadUpdateSchedule extends IPayloadCreateSchedule {
  id: number;
}

export interface IPostForm {
  business_type: string;
  category_type: string;
  title: string;
  description: string;
  area: string;
  phap_ly?: string;
  price_in_vnd: string;
  city_id?: number | string;
  district_id?: number | string;
  ward_id?: number | string;
  street_id?: number | string;
  project_id: number | string;
  child_project_id?: number | string;
  full_address?: string;
  bedrooms_count?: string;
  bathrooms_count?: string;
  facade?: string;
  entrance?: string;
  floors_count?: string;
  direction?: string;
  furniture?: string;
  image_ids: string;
  youtube_url?: string;
  user_agent?: string;
  create_source?: string;
  project?: OptionForSelect;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  street?: OptionForSelect;
  child_project?: OptionForSelect;
}

export interface IManageProductDetail {
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
  price_per_m2: number;
  formatted_kt: string;

}
