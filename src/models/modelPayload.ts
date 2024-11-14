export interface IViewedPostsPayload {
  page: number;
  per_page: number;
}
export interface IConnectOauthsPayload {
  uid: string;
  email: string;
  name: string;
  photo: string;
  referral_code?: string;
}
export interface IRequestCallbackPayload {
  product_uid: string;
  phone: string;
  full_name: string;
  email?: string;
  content?: string;
}
