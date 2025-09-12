import { IResponseData } from '@common/types/api';

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
 * Paginated notifications response
 */
export type INotificationsResponse = IResponseData<{
  page: number;
  per_page: number;
  results: INotificationData[];
  total_count: number;
  total_pages: number;
}>;
