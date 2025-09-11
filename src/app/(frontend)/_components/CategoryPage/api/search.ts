import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { ISeachAuthorPayload } from '@common/models/modelPayload';
import { TopAuthorsResponse } from '@common/models/modelResponse';

export const searchApi = {
  topAuthors: async (data: ISeachAuthorPayload): Promise<TopAuthorsResponse> => {
    return axiosInstance.get(API_ROUTES.SEARCHS.TOP_AUTHORS, {
      params: data,
    });
  },
};
