import axiosInstance from '@api/axiosInstance';
import { API_ROUTES } from '@common/router';

export const DashboardSummaryApi = {
  accountSummary: async (): Promise<A> => {
    return axiosInstance.get(API_ROUTES.DASHBOARD.ACCOUNT_SUMMARY);
  },
};
