import { IResponseData } from '@common/types';

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
 * Save summary response - using generic IResponseData
 */
export type ISavesSummaryResponse = IResponseData<{
  saved_product_uids: string[];
}>;
