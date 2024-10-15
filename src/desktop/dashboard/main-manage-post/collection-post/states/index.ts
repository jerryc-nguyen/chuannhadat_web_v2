import { atom } from 'jotai';
import { ProductActionSetting } from '../data/type/products-action-settings';

export const productActionSetting = atom<ProductActionSetting | undefined>(undefined);