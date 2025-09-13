import { IResponseData } from '@common/types/api';

/**
 * Referral detail response
 */
export type IReferralsDetailResponse = IResponseData<{
  description: string;
  image: string;
  title: string;
}>

/**
 * Referral data structure
 */
export type IReferralData = {
  avatar: string;
  email: string;
  formatted_created_at: string;
  full_name: string;
  phone: string;
  success: boolean;
}

/**
 * Referral list response
 */
export type IReferralListResponse = IResponseData<IReferralData[]>;
