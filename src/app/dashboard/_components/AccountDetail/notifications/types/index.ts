import { IResponseData } from '@common/types/api';

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
