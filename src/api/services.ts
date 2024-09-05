import axiosInstance from '@api/axiosInstance';
import { API_ROUTES } from '@common/router';
import {
  IPayloadCreateSchedule,
  IPayloadUpdateSchedule,
} from '@models/interface/IModalAutoRefresh';
import { IModalUpdatePassoword, IModalUpdateProfile } from '@models/interface/IModalProfiles';

export const services = {
  profiles: {
    getMyProfile: async (): Promise<A> => {
      return axiosInstance.get(API_ROUTES.PROFILES.GET_MY_PROFILE);
    },
    updateMyProfile: async (data: IModalUpdateProfile): Promise<A> => {
      return axiosInstance.put(API_ROUTES.PROFILES.UPDATE_MY_PROFILE, data);
    },
    updateMyAvatar: async (data: FormData) => {
      return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_AVATAR, data, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
    },
    getProfileId: async (id: number): Promise<A> => {
      return axiosInstance.get(`${API_ROUTES.PROFILES.GET_PROFILE_ID}/${id}`);
    },
    updateMyPassword: async (data: IModalUpdatePassoword) => {
      return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_PASSWORD, data);
    },
    updateMyPhone: async (data: { phone: string }) => {
      return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_PHONE, data);
    },
  },
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
