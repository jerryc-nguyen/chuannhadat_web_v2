import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IReferralListResponse, IReferralsDetailResponse } from '../types/referral';

export const referralsApi = {
  getReferralDetail: async (referral_code: string): Promise<IReferralsDetailResponse> => {
    return axiosInstance.get(`${API_ROUTES.REFERRALS}/${referral_code}`);
  },

  getListReferralFriend: async (): Promise<IReferralListResponse> => {
    return axiosInstance.get(API_ROUTES.REFERRALS);
  },
};
