import { IProductDetail } from '@common/types'
import { atom } from 'jotai';

export const postDetailAtom = atom<IProductDetail | undefined>(undefined);
