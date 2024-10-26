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

export interface IImageSignS3_Request {
  folder: string;
  file_name: string;
  new_file_name?: string;
}

export interface IImageSignS3_Response {
  code: number;
  status: boolean;
  s3_key: string;
  s3_url: string;
  signed_url: string;
}

export interface ITrackUploadedUrl_Request {
  s3_key: string;
  s3_url: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
}

export interface ITrackUploadedUrl_Response {
  success: boolean;
  id: number;
}
