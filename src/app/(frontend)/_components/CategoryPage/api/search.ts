import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { ISearchAuthorPayload } from '@common/types/saves';
import { TopAuthorsResponse } from '@common/types/api';

export const searchApi = {
  topAuthors: async (data: ISearchAuthorPayload): Promise<TopAuthorsResponse> => {
    return axiosInstance.get(API_ROUTES.SEARCHS.TOP_AUTHORS, {
      params: data,
    });
  },
};
