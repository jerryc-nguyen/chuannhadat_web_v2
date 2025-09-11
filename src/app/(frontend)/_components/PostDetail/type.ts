import { IProductDetail, IProductList } from '../CategoryPage/mobile/searchs/type';

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
