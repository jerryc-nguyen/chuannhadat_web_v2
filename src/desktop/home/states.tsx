import { atom } from 'jotai';
export type TCardAuthor = {
  id: number;
  slug: string;
  avatar_url: string;
  full_name: string;
  phone: string;
};

export type TSeoInfo = {
  title: string;
  description: string;
};
export interface IPostProductCard {
  id: number;
  uid: string;
  title: string;
  slug: string;
  featured_image_url: string;
  short_location_name: string;
  formatted_price: string;
  formatted_area: string;
  formatted_price_per_m2: string;
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
export type TLoadedCardAuthors = Record<string, TCardAuthor>;

export const loadedCardAuthorsAtom = atom<TLoadedCardAuthors>({});

export const seoInfoAtom = atom<TSeoInfo | Record<string, A>>({});
// export const dataPostListAtom = atom<IPostProductCard[]>([]);
