import { IPagination } from '@common/types';
import { HttpStatusCode } from 'axios';

/**
 * Save product action enum
 */
export enum ActionSaveProduct {
  Like = 'like',
  Unlike = 'unlike',
}

/**
 * Save product payload
 */
export interface ISaveProductPayload {
  product_uid: string;
  action: ActionSaveProduct;
}

/**
 * Viewed posts payload
 */
export interface IViewedPostsPayload {
  page: number;
  per_page: number;
}


/**
 * Search author payload (generic)
 */
export type ISearchAuthorPayload = Record<string, any>;

/**
 * Viewed posts payload
 */
export interface IViewedPostsPayload {
  page: number;
  per_page: number;
}

/**
 * Save summary response
 */
export interface ISavesSummaryResponse {
  data: {
    saved_product_uids: string[];
  };
}

/**
 * Saved products response
 */
export interface ISavedProductsResponse {
  code: HttpStatusCode;
  status: boolean;
  pagination: IPagination;
  data: ISavedProduct[];
}

/**
 * Individual saved product
 */
export interface ISavedProduct {
  id: number;
  product: any; // This should be IProductDetail, but importing would create circular dependency
  created_at: string;
}
