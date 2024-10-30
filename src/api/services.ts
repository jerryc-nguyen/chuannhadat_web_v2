import axiosInstance from '@api/axiosInstance';
import { FRONTEND_TOKEN } from '@common/auth';
import { getCookie } from '@common/cookies';
import { API_ROUTES } from '@common/router';
import { concatStrings } from '@common/utils';
import { IProductSummary } from '@desktop/post-detail/type';
import {
  IFormPropsLogin,
  IFormPropsRegister,
  IRegisterResponse,
  LoginResponse,
} from '@mobile/auth/types';
import { Author, IProductDetail } from '@mobile/searchs/type';
import { IResponseData } from '@models';
import { IConnectOauthsPayload, IViewedPostsPayload } from '@models/modelPayload';
import { IConnectOauthsResponse, IViewedPostResonpse } from '@models/modelResponse';
import {
  ISavedProductsResponse,
  ISaveProductPayload,
  ISavesSummaryResponse,
} from '@models/savesPostModel';

export const services = {
  profiles: {
    getMyProfile: async (headers?: A): Promise<A> => {
      return axiosInstance.get(API_ROUTES.PROFILES.GET_MY_PROFILE, { headers: headers });
    },
    getProfileSlug: async (slug: string): Promise<{ data: Author }> => {
      return axiosInstance.get(concatStrings(API_ROUTES.PROFILES.GET_MY_PROFILE_SLUG, slug), {
        params: {
          slug,
        },
      });
    },
    getProfileId: async (id: number): Promise<A> => {
      return axiosInstance.get(`${API_ROUTES.PROFILES.GET_PROFILE_ID}/${id}`);
    },
  },
  subscription_plans: {
    getSubscriptionPlans: async (): Promise<{ data: A }> => {
      return axiosInstance.get(API_ROUTES.SUBSCRIPTION_PLANS.GET);
    },
    buySubscriptionPlans: async (plan_id: number): Promise<A> => {
      try {
        const response = await axiosInstance.post(API_ROUTES.SUBSCRIPTION_PLANS.BUY, { plan_id });
        return response;
      } catch (error) {
        console.log('ERROR', error);
      }
    },
    validateBuySubscriptionPlans: async (plan_id: number): Promise<A> => {
      return axiosInstance.post(API_ROUTES.SUBSCRIPTION_PLANS.VALIDATE_BUY, { plan_id });
    },
  },
  notifications: {
    getNotifications: async (params: {
      page: number;
      per_page: number;
      filter_status: 'read' | 'unread' | null;
    }): Promise<A> => {
      return axiosInstance.get(API_ROUTES.NOTIFICATION.LIST, {
        params,
      });
    },
    makeMarkReadAll: async (): Promise<A> => {
      return axiosInstance.post(API_ROUTES.NOTIFICATION.MARK_ALL_READ);
    },
    makeMarkRead: async (id: number) => {
      return axiosInstance.put(`${API_ROUTES.NOTIFICATION.READ}`, { id });
    },
  },
  manage_posts: {
    getDetailPost: async (product_uid: string): Promise<{ data: IProductDetail }> => {
      return axiosInstance.get(`${API_ROUTES.MANAGE_PRODUCTS.DETAIL}/${product_uid}`);
    },
  },
  posts: {
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
    getViewedPosts: async (payload: IViewedPostsPayload): Promise<IViewedPostResonpse> => {
      return axiosInstance.get(API_ROUTES.POSTS.VIEWD_PRODUCTS, {
        params: payload,
        headers: {
          'Frontend-Token': getCookie(FRONTEND_TOKEN),
        },
      });
    },
  },
  auth: {
    signIn: async (data: IFormPropsLogin): Promise<LoginResponse> => {
      return axiosInstance.post(API_ROUTES.AUTH.LOGIN_BY_PHONE, data);
    },
    signUp: async (data: Partial<IFormPropsRegister>): Promise<IRegisterResponse> => {
      return axiosInstance.post(API_ROUTES.AUTH.REGISTER_BY_PHONE, data);
    },
  },
  oauths: {
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
  },
  saves: {
    savePost: async (payload: ISaveProductPayload): Promise<IResponseData> => {
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
  },
  trackings: {
    viewProduct: async (payload: { product_uid: string }): Promise<ISavesSummaryResponse> => {
      return axiosInstance.post(API_ROUTES.TRACKINGS.VIEW_PRODUCT, payload, {
        headers: {
          'Frontend-Token': getCookie(FRONTEND_TOKEN),
        },
      });
    },
  },
};
