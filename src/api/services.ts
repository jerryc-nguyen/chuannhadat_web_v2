import axiosInstance from '@api/axiosInstance';
import { FRONTEND_TOKEN } from '@common/auth';
import { getCookie } from '@common/cookies';
import { API_ROUTES } from '@common/router';
import { concatStrings } from '@common/utils';
import { IArticleDetail, INews } from '@views/news/types';
import { IProductSummary } from '@desktop/post-detail/type';
import {
  IFormPropsLogin,
  IFormPropsRegister,
  IRegisterResponse,
  LoginResponse,
} from '@mobile/auth/types';
import { Author, IProductDetail } from '@mobile/searchs/type';
import {
  IConnectOauthsPayload,
  IRequestCallbackPayload,
  ISeachAuthorPayload,
  IViewedPostsPayload,
} from '@models/modelPayload';
import {
  IConnectOauthsResponse,
  IListRequestResponse,
  IProfileMeResponse,
  IReferralListResponse,
  IReferralsDetailResponse,
  IRequestCallbackResponse,
  IResponseData,
  IVerifyPhoneResponse,
  IViewedPostResonpse,
  TopAuthorsResponse,
} from '@models/modelResponse';
import {
  ISavedProductsResponse,
  ISaveProductPayload,
  ISavesSummaryResponse,
} from '@models/savesPostModel';
import { HttpStatusCode } from 'axios';

export const services = {
  news: {
    getNews: async (): Promise<{ data: INews }> => {
      return axiosInstance.get(API_ROUTES.NEWS.GET_NEWS);
    },
    getNewsDetail: async (news_id: string): Promise<{ data: IArticleDetail }> => {
      return axiosInstance.get(`${API_ROUTES.NEWS.GET_NEWS_DETAIL}/${news_id}`);
    }
  },
  autocompletes: {
    projects: async (params: { keyword: string; limit: number }): Promise<A> => {
      return axiosInstance.get(API_ROUTES.AUTOCOMPLETES.PROJECTS, { params });
    },
  },
  profiles: {
    getMyProfile: async (): Promise<IProfileMeResponse> => {
      return axiosInstance.get(API_ROUTES.PROFILES.GET_MY_PROFILE);
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
    updateEmail: async (email: string): Promise<A> => {
      return axiosInstance.post(`${API_ROUTES.PROFILES.UPDATE_EMAIL}`, {
        email: email,
      });
    },
    confirmEmail: async (confirm_email_token: string): Promise<A> => {
      return axiosInstance.post(`${API_ROUTES.PROFILES.CONFIRM_EMAIL}`, {
        confirm_email_token: confirm_email_token,
      });
    },
    updateMyPhone: async (data: { phone: string }) => {
      return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_PHONE, data);
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
  manage_contacts: {
    requestCallback: async (
      payload: IRequestCallbackPayload,
    ): Promise<IRequestCallbackResponse> => {
      return axiosInstance.post(API_ROUTES.MANAGE_CONTACTS.REQUEST_CALLBACK, payload);
    },
    getListRequest: async (): Promise<IListRequestResponse> => {
      return axiosInstance.get(API_ROUTES.MANAGE_CONTACTS.GET_REQUESTS);
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
    loginGoogle: async (data: IConnectOauthsPayload): Promise<LoginResponse> => {
      return axiosInstance.post(API_ROUTES.AUTH.LOGIN_BY_GOOGLE, data);
    },
    verifyPhone: async (phone: string): Promise<IVerifyPhoneResponse> => {
      return axiosInstance.post(API_ROUTES.AUTH.VERIFY_PHONE, {
        phone: phone,
      });
    },
    checkResetPassword: async (
      phone: string,
    ): Promise<{ status: boolean; code: HttpStatusCode }> => {
      return axiosInstance.post(API_ROUTES.AUTH.CHECK_RESET_PASSWORD, {
        phone: phone,
      });
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
    savePost: async (payload: ISaveProductPayload): Promise<IResponseData<A>> => {
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
  referralls: {
    getReferralDetail: async (referral_code: string): Promise<IReferralsDetailResponse> => {
      return axiosInstance.get(`${API_ROUTES.REFERRALS}/${referral_code}`);
    },
    getListReferralFriend: async (): Promise<IReferralListResponse> => {
      return axiosInstance.get(API_ROUTES.REFERRALS);
    },
  },
  searchs: {
    topAuthors: async (data: ISeachAuthorPayload): Promise<TopAuthorsResponse> => {
      return axiosInstance.get(API_ROUTES.SEARCHS.TOP_AUTHORS, {
        params: data,
      });
    },
  },
};
