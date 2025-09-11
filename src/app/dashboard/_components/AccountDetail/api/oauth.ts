import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IConnectOauthsPayload } from '@common/models/modelPayload';
import { IConnectOauthsResponse } from '@common/models/modelResponse';

export const oauthApi = {
  connectGoogle: async (data: IConnectOauthsPayload): Promise<IConnectOauthsResponse> => {
    return axiosInstance.post(API_ROUTES.OAUTHS.CONNECT_GOOGLE, data);
  },

  connectFacebook: async (data: IConnectOauthsPayload): Promise<IConnectOauthsResponse> => {
    return axiosInstance.post(API_ROUTES.OAUTHS.CONNECT_FACEBOOK, data);
  },

  getOauths: async (): Promise<IConnectOauthsResponse> => {
    return axiosInstance.get(API_ROUTES.OAUTHS.GET_OAUTHS);
  },

  deleteOauth: async (oauthId: string) => {
    return axiosInstance.delete(`${API_ROUTES.OAUTHS.GET_OAUTHS}/${oauthId}`);
  },
};
