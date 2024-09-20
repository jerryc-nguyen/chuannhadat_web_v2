import { IProductDetail } from '@mobile/searchs/type';

export type AuthorPostProps = {
  data: IProductDetail;
  className?: string;
};
export enum StatusPhoneNumber {
  normal = 'Bấm để hiện số',
  copy = 'Sao chép',
  copied = 'Đã sao chép',
}
