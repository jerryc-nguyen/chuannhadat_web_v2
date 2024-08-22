export type Range = {
  min?: number;
  max?: number;
};

export type OptionForSelect = {
  value: number | string;
  text: string;
  range?: Range;
  params?: Record<string, any>;
};

export interface IFormPropsLogin {
  phone: string;
  password: string;
}

export interface IFormResponse<T> {
  code: number;
  data: T;
  status: boolean | number;
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
