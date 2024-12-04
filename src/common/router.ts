export const API_ROUTES = {
  AUTH: {
    LOGIN_BY_PHONE: 'api/v1/authentications/login_by_phone',
    LOGIN_BY_GOOGLE: 'api/v1/authentications/login_by_google',
    REGISTER_BY_PHONE: 'api/v1/authentications/register_by_phone',
    FORGOT_PASSWORD: 'auth/forgot-password',
    VERIFY_CODE: 'auth/verify-reset-password-token',
    VERIFY_PHONE: '/api/v1/authentications/check_phone',
    CHECK_RESET_PASSWORD: 'api/v1/authentications/check_reset_password',
    CHANGE_PASSWORD: 'auth/reset-password',
    LOGOUT: 'auth/logout',
  },
  OAUTHS: {
    CONNECT_GOOGLE: 'api/v1/oauths/connect_google',
    CONNECT_FACEBOOK: 'api/v1/oauths/connect_facebook',
    GET_OAUTHS: 'api/v1/oauths',
  },
  POSTS: {
    DETAIL_POST: 'api/v1/products',
    VIEWD_PRODUCTS: 'api/v1/products/viewed_products',
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
    UPDATE_EMAIL: 'api/v1/profiles/update_email',
    CONFIRM_EMAIL: 'api/v1/profiles/confirm_email',
  },
  IMAGE_UPLOAD: {
    SIGN_S3: 'api/v1/product_images/sign-s3',
    TRACK_UPLOADED_URL: 'api/v1/product_images/track-uploaded-url',
  },
  MAPS: {
    GET_LOCATION_BY_LAT_LNG: 'api/v1/maps/locations_by_ll',
  },
  MANAGE_PRODUCTS: {
    DETAIL: 'api/v1/manage_products',
    END_POINT: 'api/v1/manage_products',
    DELETE: 'api/v1/manage_products/{product_id}',
    GET_PRODUCT_ACTION_SETTINGS: 'api/v1/manage_products/settings',
    UP_VIP: 'api/v1/manage_products/up_vip',
    VALIDATE_UP_VIP: 'api/v1/manage_products/validate_up_vip',
    REFRESH: 'api/v1/manage_products/{product_id}/refresh',
    SETUP_AUTO_REFRESH: 'api/v1/manage_products/{product_id}/setup_auto_refresh',
    SHOW_ON_FRONTEND: 'api/v1/manage_products/{product_id}/show_on_frontend',
  },
  MANAGE_CONTACTS: {
    REQUEST_CALLBACK: 'api/v1/products/request_callback',
    GET_REQUESTS: 'api/v1/contacts/request_callbacks',
  },
  SAVES: {
    SAVE_POST: 'api/v1/saves/save_product',
    SAVED_PRODUCTS: 'api/v1/saves/saved_products',
    SAVED_SUMMARY: 'api/v1/saves/summary',
  },
  TRACKINGS: {
    VIEW_PRODUCT: 'api/v1/trackings/view_product',
  },
  SEOS: 'api/v1/seos/metadata',
  REFERRALS: 'api/v1/referrals',
  DASHBOARD: {
    ACCOUNT_SUMMARY: 'api/v1/dashboards',
  },
  SEARCHS: {
    TOP_AUTHORS: 'api/v1/searchs/top_authors',
  },
};
