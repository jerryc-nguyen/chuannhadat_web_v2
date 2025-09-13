import { CustomerGender, CustomerType, IResponseData } from '@common/types';

export interface IModalUpdatePassoword {
  current_password?: string;
  new_password: string;
  confirm_password: string;
}
export interface IModalUpdateProfile {
  role?: CustomerType;
  full_name: string;
  job_title?: string;
  exp_years?: number;
  address?: string;
  gender?: CustomerGender;
  description?: string;
  facebook_url?: string;
  website_url?: string;
  youtube_url?: string;
}
/**
 * OAuth connection response
 */
export type IConnectOauthsResponse = IResponseData<any>;

/**
 * OAuth connection payload
 */
export interface IConnectOauthsPayload {
  uid: string;
  email: string;
  name: string;
  photo: string;
  referral_code?: string;
}
