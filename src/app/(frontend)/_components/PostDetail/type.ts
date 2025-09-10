import { IProductDetail } from '../CategoryPage/mobile/searchs/type';

export type AuthorPostProps = {
  data: IProductDetail;
  className?: string;
};
export enum StatusPhoneNumber {
  normal = 'Bấm để hiện số',
  copy = 'Sao chép',
  copied = 'Đã sao chép',
}
export interface IProductSummary {
  id: number;
  uid: string;
  title: string;
  slug: string;
  featured_image_url: string;
  short_location_name: string;
  formatted_price: string | null;
  formatted_area: string;
  formatted_price_per_m2: string | null;
  formatted_floors: string;
  formatted_direction: string;
  formatted_publish_at: string;
  formatted_facade_with_label: string;
  formatted_kt: string | null;
  bedrooms_count: number | null;
  bathrooms_count: number | null;
  images_count: number;
  user_id: number;
}
