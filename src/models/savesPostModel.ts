import { IProductDetail } from '@mobile/searchs/type';
import { HttpStatusCode } from 'axios';

export interface ISavesSummaryResponse {
  data: {
    saved_product_uids: string[];
  };
}

interface Post {
  id: number;
  product: IProductDetail;
  created_at: string;
}

export interface Pagination {
  total_count: number;
  total_pages: number;
  page: number;
  per_page: number;
}
export interface ISavedProductsResponse {
  code: HttpStatusCode;
  status: boolean;
  pagination: Pagination;
  data: Post[];
}
export enum ActionSaveProduct {
  Like = 'like',
  Unlike = 'unlike',
}
export interface ISaveProductPayload {
  product_uid: string;
  action: ActionSaveProduct;
}
