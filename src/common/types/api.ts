import { HttpStatusCode } from 'axios';

/**
 * Generic API types and response interfaces
 * Used across the application for API communication
 */

/**
 * Generic API response wrapper
 */
export interface IResponseData<T> {
  code: HttpStatusCode;
  status: boolean | number;
  message?: string;
  data: T;
}

/**
 * Notification response interface
 * Used for notification-related API responses
 */
export interface INotificationResponse {
  id: number;
  title: string;
  description: string;
  formatted_created_at: string;
  is_read: boolean;
  redirect_url: string;
}

/**
 * Internal notification data structure
 */
export interface INotificationData {
  description: string;
  formatted_created_at: string;
  id: number;
  is_read: boolean;
  redirect_url: string;
  title: string;
}

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
 * Paginated notifications response
 */
export type INotificationsResponse = IResponseData<{
  page: number;
  per_page: number;
  results: INotificationData[];
  total_count: number;
  total_pages: number;
}>

/**
 * Referral detail response
 */
export type IReferralsDetailResponse = IResponseData<{
  description: string;
  image: string;
  title: string;
}>

/**
 * OAuth connection response
 */
export type IConnectOauthsResponse = IResponseData<any>;

/**
 * Referral data structure
 */
export interface IReferralData {
  avatar: string;
  email: string;
  formatted_created_at: string;
  full_name: string;
  phone: string;
  success: boolean;
}

/**
 * Top author structure
 */
export interface ITopAuthor {
  avatar_url: string;
  full_name: string;
  id: number;
  phone: string;
  slug: string;
  top_position: number;
}

/**
 * Verify phone response data
 */
export interface IVerifyPhoneResponseData {
  name: string;
  avatar: string;
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

/**
 * Viewed posts response
 */
export interface IViewedPostsResponse extends IResponseData<any[]> {
  pagination: IPagination;
}

/**
 * Request callback response
 */
export type IRequestCallbackResponse = IResponseData<any>;

/**
 * List of request callbacks response
 */
export type IListRequestResponse = IResponseData<IRequestCallbackContent[]>;

/**
 * Referral list response
 */
export type IReferralListResponse = IResponseData<IReferralData[]>;

/**
 * Profile me response
 */
export type IProfileMeResponse = IResponseData<any>;

/**
 * Top authors response
 */
export type TopAuthorsResponse = IResponseData<ITopAuthor[]>;

/**
 * Verify phone response
 */
export type IVerifyPhoneResponse = IResponseData<IVerifyPhoneResponseData>;
