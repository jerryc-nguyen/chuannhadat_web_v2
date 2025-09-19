import { atom } from 'jotai';
import { Author } from '@common/types/product';
import { IProductDetail } from '@common/types';

export const postDetailAtom = atom<IProductDetail | undefined>(undefined);
export const authorAtom = atom<Author | undefined>(undefined);
