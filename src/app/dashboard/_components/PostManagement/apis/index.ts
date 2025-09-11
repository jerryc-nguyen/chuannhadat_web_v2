import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IPayloadCreateSchedule, IPayloadUpdateSchedule } from '../types';

export const services = {
  scheduledRefreshs: {
    getScheduledRefreshs: async (): Promise<A> => {
      return axiosInstance.get(API_ROUTES.SCHEDULED_REFRESHS);
    },
    createScheduledRefreshs: async (data: IPayloadCreateSchedule): Promise<A> => {
      return axiosInstance.post(API_ROUTES.SCHEDULED_REFRESHS, data);
    },
    deleteScheduledRefreshs: async (id: number) => {
      return axiosInstance.delete(`${API_ROUTES.SCHEDULED_REFRESHS}/${id}`);
    },
    updateScheduledRefreshs: async (data: IPayloadUpdateSchedule): Promise<A> => {
      return axiosInstance.put(`${API_ROUTES.SCHEDULED_REFRESHS}/${data.id}`, data);
    },
  },
};
