import { atom } from 'jotai';
import { ProductActionSetting } from '../data/type/products-action-settings';
import { Product, productSchema } from '../data/schemas/product-schema';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { productQuerySchema } from '../data/schemas/product-query-schema';

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

export const productQueryFormAtom = atom<UseFormReturn<z.infer<typeof productQuerySchema>> | undefined>(undefined);

export const needUpdateProductsListAtom = atom<boolean>(true);