import { CustomerGender, CustomerType } from '@common/types';

export interface IFormPropsLogin {
  phone: string;
  password: string;
}

export interface IFormPropsRegister extends IFormPropsLogin {
  confirmPassword: string;
  referral_code?: string;
}

export interface IFormResponse<T> {
  code: number;
  data: T;
  status: boolean | number;
  message: string;
}

export type LoginResponse = {
  data: ILoginResponse;
  status: boolean;
  code: number;
  message?: string;
};
export interface ILoginResponse {
  address: string;
  api_token: string;
  avatar_url: string;
  description: string | null;
  formatted_badges: string | null;
  formatted_joined_at: string;
  full_name: string;
  gender: CustomerGender;
  id: number;
  job_title: string | null;
  referral_code: string;
  phone: string;
  post_token: string;
  posts_count: number;
  profile_tags: string[];
  slug: string;
  role?: CustomerType;
  website_url?: string;
  youtube_url?: string;
  facebook_url?: string;
}
export type IRegisterResponse = LoginResponse;
export enum ILoginAndRegisterModalType {
  LOGIN = 'login',
  REGISTER = 'register',
}
