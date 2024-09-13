import axiosInstance from '@api/axiosInstance';
import { API_ROUTES } from '@common/router';

export const services = {
  getMyProfile: async (headers?: A): Promise<A> => {
    return axiosInstance.get(API_ROUTES.PROFILES.GET_MY_PROFILE, { headers: headers });
  },
  notifications: {
    getNotifications: async (params: {
      page: number;
      per_page: number;
      filter_status: 'read' | 'unread' | null;
    }): Promise<A> => {
      return axiosInstance.get(API_ROUTES.NOTIFICATION.LIST, {
        params,
      });
    },
    makeMarkReadAll: async (): Promise<A> => {
      return axiosInstance.post(API_ROUTES.NOTIFICATION.MARK_ALL_READ);
    },
    makeMarkRead: async (id: number) => {
      return axiosInstance.put(`${API_ROUTES.NOTIFICATION.READ}`, { id });
    },
  },
  posts: {
    getDetailPost: async (product_uid: string): Promise<A> => {
      return axiosInstance.get(`${API_ROUTES.POSTS.DETAIL_POST}/${product_uid}`);
    },
  },
};
