import { atom } from 'jotai';
import { Product } from '../data/schemas/product-schema';
import { ProductActionSetting } from '../data/type/products-action-settings';

export const productActionSetting = atom<ProductActionSetting | undefined>(undefined);
export const productsListAppliedAtom = atom<{
    productsList: Product[],
    totalPages: number,
    totalRecords: number,
}>({
    productsList: [],
    totalPages: 0,
    totalRecords: 0,
});

export const needUpdateProductsListAtom = atom<boolean>(true);