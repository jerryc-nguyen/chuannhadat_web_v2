export const API_ROUTES = {
  AUTH: {
    LOGIN_BY_PHONE: 'api/v1/authentications/login_by_phone',
    REGISTER_BY_PHONE: 'api/v1/authentications/register_by_phone',
    FORGOT_PASSWORD: 'auth/forgot-password',
    VERIFY_CODE: 'auth/verify-reset-password-token',
    CHANGE_PASSWORD: 'auth/reset-password',
    LOGOUT: 'auth/logout',
  },
  POSTS: {
    DETAIL_POST: 'api/v1/products',
    POSTS_SAME_AUTHOR: 'same_owner_products',
  },
  BALANCE: {
    OVERVIEW: 'api/v1/balances/overviews',
    TRANSACTION: 'api/v1/balances/transactions',
    HISTORY: 'api/v1/balances/deposit_histories',
  },
  SUBSCRIPTION_PLANS: {
    GET: '/api/v1/subscription_plans',
    BUY: 'api/v1/subscription_plans/buy_plan',
    VALIDATE_BUY: 'api/v1/subscription_plans/validate_buy_plan',
  },
  NOTIFICATION: {
    LIST: 'api/v1/notifications',
    READ: 'api/v1/notifications/read',
    MARK_ALL_READ: 'api/v1/notifications/mark_all_read',
  },
  SCHEDULED_REFRESHS: 'api/v1/scheduled_refreshs',
  PROFILES: {
    GET_MY_PROFILE: 'api/v1/profiles/me',
    GET_MY_PROFILE_SLUG: 'api/v1/profiles/',
    UPDATE_MY_PROFILE: 'api/v1/profiles/me',
    UPDATE_AVATAR: 'api/v1/profiles/update_avatar',
    GET_PROFILE_ID: 'api/v1/profiles',
    UPDATE_PASSWORD: 'api/v1/profiles/update_password',
    UPDATE_PHONE: 'api/v1/profiles/update_phone',
  },
  IMAGE_UPLOAD: {
    SIGN_S3: 'api/v1/product_images/sign-s3',
    TRACK_UPLOADED_URL: 'api/v1/product_images/track-uploaded-url',
  },
  MAPS: {
    GET_LOCATION_BY_LAT_LNG: 'api/v1/maps/locations_by_ll',
  },
};
