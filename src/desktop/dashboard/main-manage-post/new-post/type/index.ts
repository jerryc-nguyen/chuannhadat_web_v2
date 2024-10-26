export interface CNDImage {
  id?: string | number;
  url: string;
  uploadedFile?: File;
}

export interface IProductForm {
  business_type: string;
  category_type: string;
  title: string;
  description: string;
  area: string;
  phap_ly?: string;
  price_in_vnd: string;
  city_id: string;
  district_id: string;
  ward_id?: string;
  street_id?: string;
  project_id?: string;
  full_address?: string;
  bedrooms_count?: string;
  bathrooms_count?: string;
  facade?: number;
  entrance?: number;
  floors_count?: string;
  entrance_direction?: string;
  view_direction?: string;
  furniture?: string;
  image_ids: string;
  youtube_url?: string;
}
