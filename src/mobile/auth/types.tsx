export interface IFormPropsLogin {
  phone: string;
  password: string;
}

export interface IFormPropsRegister extends IFormPropsLogin {
  confirmPassword: string;
}

export interface IFormResponse<T> {
  code: number;
  data: T;
  status: boolean | number;
  message: string;
}

export interface ILoginResponse {
  address: string;
  api_token: string;
  avatar_url: string;
  description: string | null;
  formatted_badges: string | null;
  formatted_joined_at: string;
  full_name: string;
  gender: string;
  id: number;
  job_title: string | null;
  phone: string;
  post_token: string;
  posts_count: number;
  profile_tags: string[];
  slug: string;
}
export type IRegisterResponse = ILoginResponse;
export enum ILoginAndRegisterModalType {
  LOGIN = 'login',
  REGISTER = 'register',
}
