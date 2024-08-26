import { atom } from 'jotai';
import { IProductDetail } from '@mobile/searchs/type';

export const postDetailAtom = atom<IProductDetail | undefined>(undefined);
