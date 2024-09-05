export interface IFormResponse<T> {
  code: number;
  data: T;
  status: boolean | number;
  message: string;
}

export interface INotificationResponse {
  id: number;
  title: string;
  description: string;
  formatted_created_at: string;
  is_read: boolean;
}

