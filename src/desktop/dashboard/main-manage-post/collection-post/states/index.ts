import { atom } from 'jotai';
import { ProductActionSetting } from '../data/type/products-action-settings';
import { Product } from '../data/schemas/product-schema';

export const productActionSetting = atom<ProductActionSetting | undefined>(undefined);
export const productsListAtom = atom<Product[]>([]);