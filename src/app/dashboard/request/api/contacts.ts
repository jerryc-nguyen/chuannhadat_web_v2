import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IRequestCallbackPayload } from '@common/types/saves';
import { IListRequestResponse, IRequestCallbackResponse } from '@common/types/api';

export const contactsApi = {
  requestCallback: async (payload: IRequestCallbackPayload): Promise<IRequestCallbackResponse> => {
    return axiosInstance.post(API_ROUTES.MANAGE_CONTACTS.REQUEST_CALLBACK, payload);
  },

  getListRequest: async (): Promise<IListRequestResponse> => {
    return axiosInstance.get(API_ROUTES.MANAGE_CONTACTS.GET_REQUESTS);
  },
};
