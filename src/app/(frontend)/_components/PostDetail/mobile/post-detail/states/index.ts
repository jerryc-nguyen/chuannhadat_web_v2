import { atom } from 'jotai';
import { IProductDetail, Author } from '@frontend/CategoryPage/mobile/searchs/type';

export const postDetailAtom = atom<IProductDetail | undefined>(undefined);
export const authorAtom = atom<Author | undefined>(undefined);
