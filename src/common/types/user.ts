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
export interface IUserProfile {
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
}

/**
 * Referral and social features types
 */
export interface IReferralData {
  avatar: string;
  email: string;
  formatted_created_at: string;
  full_name: string;
  phone: string;
  success: boolean;
}

export interface ITopAuthor {
  avatar_url: string;
  full_name: string;
  id: number;
  phone: string;
  slug: string;
  top_position: number;
}

/**
 * OAuth and social login types
 */
export interface IOAuthPayload {
  uid: string;
  email: string;
  name: string;
  photo: string;
  referral_code?: string;
}

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
