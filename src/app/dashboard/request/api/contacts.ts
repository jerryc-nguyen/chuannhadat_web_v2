import { IRequestCallbackContent, IRequestCallbackResponse } from '@frontend/features/profile-detail-actions/types';
import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IResponseData } from '@common/types';
import { IRequestCallbackPayload } from '@frontend/features/product-detail-actions/save-post/types';

type IListRequestResponse = IResponseData<IRequestCallbackContent[]>;

export const contactsApi = {
  requestCallback: async (payload: IRequestCallbackPayload): Promise<IRequestCallbackResponse> => {
    return axiosInstance.post(API_ROUTES.MANAGE_CONTACTS.REQUEST_CALLBACK, payload);
  },

  getListRequest: async (): Promise<IListRequestResponse> => {
    return axiosInstance.get(API_ROUTES.MANAGE_CONTACTS.GET_REQUESTS);
  },
};
