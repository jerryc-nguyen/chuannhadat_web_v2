import { IPagination, IResponseData } from '@common/types/api';
import { IProductList } from '@common/types/product';
import { IProductDetail } from '../CategoryPage/mobile/searchs/type';

export type AuthorPostProps = {
  data: IProductDetail;
  className?: string;
};

export enum StatusPhoneNumber {
  normal = 'Bấm để hiện số',
  copy = 'Sao chép',
  copied = 'Đã sao chép',
}

// Note: IProductSummary is now replaced by IProductList for consistency
// Use IProductList for listing views and IProductDetail for detail views
export type IProductSummary = IProductList;

/**
 * Viewed posts response
 */
export interface IViewedPostsResponse extends IResponseData<any[]> {
  pagination: IPagination;
}
