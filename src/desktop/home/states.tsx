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
export type TLoadedCardAuthors = Record<string, TCardAuthor>;

export const loadedCardAuthorsAtom = atom<TLoadedCardAuthors>({});

export const seoInfoAtom = atom<TSeoInfo | Record<string, A>>({});
