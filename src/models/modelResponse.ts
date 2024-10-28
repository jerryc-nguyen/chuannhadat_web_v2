import { IProductDetail } from '@mobile/searchs/type';
import { IResponseData } from '@models';
import { Pagination } from './savesPostModel';

export interface IViewedPostResonpse extends IResponseData {
  data: IProductDetail[];
  pagination: Pagination;
}
export interface IFormResponse<T> {
  code: number;
  data: T[];
  status: boolean | number;
  message: string;
}
export type IConnectOauthsResponse = IFormResponse<A>;

export interface INotificationResponse {
  id: number;
  title: string;
  description: string;
  formatted_created_at: string;
  is_read: boolean;
  redirect_url: string;
}
