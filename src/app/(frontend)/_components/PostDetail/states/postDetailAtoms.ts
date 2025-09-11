import { IProductDetail } from '../../CategoryPage/mobile/searchs/type';
import { atom } from 'jotai';

export const postDetailAtom = atom<IProductDetail | undefined>(undefined);
