import axiosInstance from '@api/axiosInstance';
import { API_ROUTES } from '@common/router';

export interface IPayloadCreateSchedule {
  hour: string;
  minute: string;
}
export interface IPayloadUpdateSchedule extends IPayloadCreateSchedule {
  id: number;
}
export const service = {
  GET_SCHEDULED_REFRESHS: async (): Promise<A> => {
    return axiosInstance.get(API_ROUTES.SCHEDULED_REFRESHS);
  },
  CREATE_SCHEDULED_REFRESHS: async (data: IPayloadCreateSchedule): Promise<A> => {
    return axiosInstance.post(API_ROUTES.SCHEDULED_REFRESHS, data);
  },
  DELETE_SCHEDULED_REFRESHS: async (id: number) => {
    return axiosInstance.delete(`${API_ROUTES.SCHEDULED_REFRESHS}/${id}`);
  },
  UPDATE_SCHEDULED_REFRESHS: async (data: IPayloadUpdateSchedule): Promise<A> => {
    return axiosInstance.put(`${API_ROUTES.SCHEDULED_REFRESHS}/${data.id}`, data);
  },
};
