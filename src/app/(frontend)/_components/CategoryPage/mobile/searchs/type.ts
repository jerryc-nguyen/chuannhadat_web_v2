import { IProductList, IProductDetail } from '@common/types';

/**
 * Union type for components that can accept either product list or detail data
 * Useful for components like ProductCard that work with both listing and detail views
 */
export type IProductData = IProductList | IProductDetail;
