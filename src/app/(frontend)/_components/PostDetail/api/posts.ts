import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IViewedPostsPayload } from '@frontend/features/product-detail-actions/save-post/types';
import { IViewedPostsResponse } from '@frontend/PostDetail/type';
import { ISavesSummaryResponse } from '@frontend/features/product-detail-actions/save-post/types';
import { IProductDetail } from '@common/types';
import { IProductSummary } from '@frontend/PostDetail/type';

export const postsApi = {
  getDetailPost: async (product_uid: string): Promise<{ data: IProductDetail }> => {
    return axiosInstance.get(`${API_ROUTES.POSTS.DETAIL_POST}/${product_uid}`);
  },

  getPostsSameAuthor: async (product_uid: string): Promise<{ data: IProductSummary[] }> => {
    return axiosInstance.get(
      `${API_ROUTES.POSTS.DETAIL_POST}/${product_uid}/${API_ROUTES.POSTS.POSTS_SAME_AUTHOR}`,
      {
        params: {
          product_uid,
        },
      },
    );
  },

  getViewedPosts: async (payload: IViewedPostsPayload): Promise<IViewedPostsResponse> => {
    return axiosInstance.get(API_ROUTES.POSTS.VIEWED_PRODUCTS_V2, {
      params: payload
    });
  },

  deleteViewedPosts: async (product_uid: string): Promise<IViewedPostsResponse> => {
    return axiosInstance.delete(`${API_ROUTES.POSTS.VIEWD_PRODUCTS}/${product_uid}`);
  },

  viewProduct: async (payload: { product_uid: string }): Promise<ISavesSummaryResponse> => {
    return axiosInstance.post(API_ROUTES.TRACKINGS.VIEW_PRODUCT, payload);
  },
  trackAction: async (payload: { target_type: string, target_id: string, action: string }): Promise<ISavesSummaryResponse> => {
    return axiosInstance.post(API_ROUTES.TRACKINGS.TRACK_ACTION, payload);
  },
};
