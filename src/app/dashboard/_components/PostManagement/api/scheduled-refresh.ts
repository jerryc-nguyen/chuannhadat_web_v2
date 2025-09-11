import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';

export const scheduledRefreshApi = {
  getScheduledRefreshs: async (): Promise<A> => {
    return axiosInstance.get(API_ROUTES.SCHEDULED_REFRESHS.GET);
  },

  createScheduledRefreshs: async (payload: A): Promise<A> => {
    return axiosInstance.post(API_ROUTES.SCHEDULED_REFRESHS.CREATE, payload);
  },

  deleteScheduledRefreshs: async (id: number): Promise<A> => {
    return axiosInstance.delete(`${API_ROUTES.SCHEDULED_REFRESHS.DELETE}/${id}`);
  },

  updateScheduledRefreshs: async (payload: A): Promise<A> => {
    return axiosInstance.put(API_ROUTES.SCHEDULED_REFRESHS.UPDATE, payload);
  },
};
