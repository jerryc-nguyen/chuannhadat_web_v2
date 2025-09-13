import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IArticleDetail, INews, ResponseNewsByCategory } from '@frontend/NewsPage/types';

export const newsApi = {
  getNews: async (): Promise<{ data: INews }> => {
    return axiosInstance.get(API_ROUTES.NEWS.GET_NEWS);
  },

  getNewsDetail: async (news_id: string): Promise<{ data: IArticleDetail }> => {
    return axiosInstance.get(`${API_ROUTES.NEWS.GET_NEWS_DETAIL}/${news_id}`);
  },

  getNewsByCategory: async (slug: string): Promise<ResponseNewsByCategory> => {
    return axiosInstance.get(`${API_ROUTES.NEWS.GET_NEWS_BY_CATEGORY}/${slug}`);
  },
};
