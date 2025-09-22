import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IResponseData } from '@common/types';

export const paymentApi = {
  lastCreditId: async (): Promise<IResponseData<{ last_credit_id: number }>> => {
    return axiosInstance.get(API_ROUTES.PAYMENTS.LAST_CREDIT_ID);
  },
  checkDeposit: async (last_credit_id: number): Promise<IResponseData<{ last_credit_id: number }>> => {
    return axiosInstance.post(API_ROUTES.PAYMENTS.CHECK_DEPOSIT, {
      last_credit_id: last_credit_id || undefined,
    });
  },
};
