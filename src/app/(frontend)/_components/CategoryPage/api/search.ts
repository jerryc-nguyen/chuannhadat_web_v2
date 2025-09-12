import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { ISearchAuthorPayload } from '@app/(frontend)/_components/features/product-detail-actions/save-post/types';
import { TopAuthorsResponse } from '@frontend/CategoryPage/types';

export const searchApi = {
  topAuthors: async (data: ISearchAuthorPayload): Promise<TopAuthorsResponse> => {
    return axiosInstance.get(API_ROUTES.SEARCHS.TOP_AUTHORS, {
      params: data,
    });
  },
};
