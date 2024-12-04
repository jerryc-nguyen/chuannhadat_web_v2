import { IProductDetail } from '@mobile/searchs/type';
import { Pagination } from './savesPostModel';
import { HttpStatusCode } from 'axios';
import { ILoginResponse } from '@mobile/auth/types';

export interface IViewedPostResonpse extends IResponseData<IProductDetail[]> {
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
