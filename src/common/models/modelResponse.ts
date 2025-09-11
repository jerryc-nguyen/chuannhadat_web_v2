import { Pagination } from './savesPostModel';
import { HttpStatusCode } from 'axios';
import { ILoginResponse } from '@components/features/auth/mobile/types';
import { IViewedProductDetail } from '@frontend/CategoryPage/mobile/searchs/type';

export interface IViewedPostResonpse extends IResponseData<IViewedProductDetail[]> {
  pagination: Pagination;
}
export interface IResponseData<T> {
  code: HttpStatusCode;
  status: boolean | number;
  message?: string;
  data: T;
}

export type IConnectOauthsResponse = IResponseData<A>;

export interface INotificationResponse {
  id: number;
  title: string;
  description: string;
  formatted_created_at: string;
  is_read: boolean;
  redirect_url: string;
}
export type IRequestCallbackResponse = IResponseData<A>;
export type RequestCallbackContent = {
  content: string;
  email: string;
  formatted_created_at: string;
  full_name: string;
  id: number;
  phone: string;
};
export type IListRequestResponse = IResponseData<RequestCallbackContent[]>;
export type IReferralsDetailResponse = IResponseData<{
  description: string;
  image: string;
  title: string;
}>;
export interface IReferralData {
  avatar: string;
  email: string;
  formatted_created_at: string;
  full_name: string;
  phone: string;
  success: false;
}
export type IReferralListResponse = IResponseData<IReferralData[]>;
export type IProfileMeResponse = IResponseData<ILoginResponse>;
export type IVerifyPhoneResponse = IResponseData<{
  name: string;
  avatar: string;
}>;
export interface ITopAuthor {
  avatar_url: string;
  full_name: string;
  id: number;
  phone: string;
  slug: string;
  top_position: number;
}
export type TopAuthorsResponse = IResponseData<ITopAuthor[]>;
interface INotificationData {
  description: string;
  formatted_created_at: string;
  id: number;
  is_read: boolean;
  redirect_url: string;
  title: string;
}
export type NotificationsResponse = IResponseData<{
  page: number;
  per_page: number;
  results: INotificationData[];
  total_count: number;
  total_pages: number;
}>;
