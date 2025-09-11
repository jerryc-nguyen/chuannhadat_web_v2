import { HttpStatusCode } from 'axios';

/**
 * Save and favorite related types and constants
 * Contains types for saved products, favorites, and related functionality
 */

/**
 * Pagination interface for paginated responses
 */
export interface IPagination {
  total_count: number;
  total_pages: number;
  page: number;
  per_page: number;
}

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
 * Request callback payload
 */
export interface IRequestCallbackPayload {
  product_uid: string;
  phone: string;
  full_name: string;
  email?: string;
  content?: string;
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
 * Request callback payload
 */
export interface IRequestCallbackPayload {
  product_uid: string;
  phone: string;
  full_name: string;
  email?: string;
  content?: string;
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

/**
 * Request callback response
 */
export interface IRequestCallbackResponse {
  code: number;
  status: boolean | number;
  message?: string;
  data: any;
}

/**
 * List of request callbacks response
 */
export interface IListRequestResponse {
  code: number;
  status: boolean | number;
  message?: string;
  data: IRequestCallbackContent[];
}

/**
 * Request callback content
 */
export interface IRequestCallbackContent {
  content: string;
  email: string;
  formatted_created_at: string;
  full_name: string;
  id: number;
  phone: string;
}
