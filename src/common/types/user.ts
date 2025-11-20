/**
 * User and Authentication related types and constants
 * Contains user profile, authentication, and user management types
 */

export enum CustomerType {
  Customer = 'customer',
  Broker = 'broker',
}

export enum CustomerGender {
  Male = 'male',
  FeMale = 'female',
}

/**
 * User profile and authentication related types
 */
export interface IUser {
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
  email?: string;
  unconfirmed_email?: string;
  phone_confirmed?: boolean;
  last_credit_id?: number;
  local_count?: number;
  local_location_name?: string;
}
