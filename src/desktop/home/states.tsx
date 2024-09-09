import { atom } from 'jotai';
export type TCardAuthors = {
  id: number;
  slug: string;
  avatar_url: string;
  full_name: string;
  phone: string;
};
export type TLoadedCardAuthors = Record<string, TCardAuthors>;

export const loadedCardAuthorsAtom = atom<TLoadedCardAuthors>({});
