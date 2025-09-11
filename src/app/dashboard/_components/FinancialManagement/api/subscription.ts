import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';

export const subscriptionApi = {
  getSubscriptionPlans: async (): Promise<{ data: any }> => {
    return axiosInstance.get(API_ROUTES.SUBSCRIPTION_PLANS.GET);
  },

  buySubscriptionPlans: async (plan_id: number): Promise<any> => {
    try {
      const response = await axiosInstance.post(API_ROUTES.SUBSCRIPTION_PLANS.BUY, { plan_id });
      return response;
    } catch (error) {
      console.log('ERROR', error);
    }
  },

  validateBuySubscriptionPlans: async (plan_id: number): Promise<any> => {
    return axiosInstance.post(API_ROUTES.SUBSCRIPTION_PLANS.VALIDATE_BUY, { plan_id });
  },
};
