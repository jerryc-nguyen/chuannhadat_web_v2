import { IRequestCallbackContent, IRequestCallbackResponse } from '@app/(frontend)/_components/features/profile-detail-actions/types';
import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IResponseData } from '@common/types';
import { IRequestCallbackPayload } from '@app/(frontend)/_components/features/product-detail-actions/save-post/types';

type IListRequestResponse = IResponseData<IRequestCallbackContent[]>;

export const contactsApi = {
  requestCallback: async (payload: IRequestCallbackPayload): Promise<IRequestCallbackResponse> => {
    return axiosInstance.post(API_ROUTES.MANAGE_CONTACTS.REQUEST_CALLBACK, payload);
  },

  getListRequest: async (): Promise<IListRequestResponse> => {
    return axiosInstance.get(API_ROUTES.MANAGE_CONTACTS.GET_REQUESTS);
  },
};
