import axiosInstance from '@common/api/axiosInstance';
import { getCookie } from '@common/cookies';
import { FRONTEND_TOKEN } from '@common/auth';
import { API_ROUTES } from '@common/router';
import { IResponseData } from '@common/types/api';
import { ISaveProductPayload, ISavedProductsResponse, ISavesSummaryResponse } from '@app/(frontend)/_components/features/product-detail-actions/save-post/types';

export const savesApi = {
  savePost: async (payload: ISaveProductPayload): Promise<IResponseData<any>> => {
    return axiosInstance.post(API_ROUTES.SAVES.SAVE_POST, payload, {
      headers: {
        'Frontend-Token': getCookie(FRONTEND_TOKEN),
      },
    });
  },

  savedPosts: async (): Promise<ISavedProductsResponse> => {
    return axiosInstance.get(API_ROUTES.SAVES.SAVED_PRODUCTS, {
      headers: {
        'Frontend-Token': getCookie(FRONTEND_TOKEN),
      },
    });
  },

  savedSummary: async (): Promise<ISavesSummaryResponse> => {
    return axiosInstance.get(API_ROUTES.SAVES.SAVED_SUMMARY, {
      headers: {
        'Frontend-Token': getCookie(FRONTEND_TOKEN),
      },
    });
  },
};
