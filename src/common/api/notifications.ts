import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { INotificationsResponse } from '@common/types/api';

export const notificationsApi = {
  getNotifications: async (params: {
    page: number;
    per_page: number;
    filter_status: 'read' | 'unread' | null;
  }): Promise<INotificationsResponse> => {
    return axiosInstance.get(API_ROUTES.NOTIFICATION.LIST, {
      params,
    });
  },

  makeMarkReadAll: async (): Promise<any> => {
    return axiosInstance.post(API_ROUTES.NOTIFICATION.MARK_ALL_READ);
  },

  makeMarkRead: async (id: number) => {
    return axiosInstance.put(`${API_ROUTES.NOTIFICATION.READ}`, { id });
  },
};
