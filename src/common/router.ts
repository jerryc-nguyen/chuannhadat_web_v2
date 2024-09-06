export const API_ROUTES = {
  AUTH: {
    LOGIN_BY_PHONE: 'api/v1/authentications/login_by_phone',
    REGISTER_BY_PHONE: 'api/v1/authentications/register_by_phone',
    FORGOT_PASSWORD: 'auth/forgot-password',
    VERIFY_CODE: 'auth/verify-reset-password-token',
    CHANGE_PASSWORD: 'auth/reset-password',
    LOGOUT: 'auth/logout',
  },
  BALANCE: {
    OVERVIEW: 'api/v1/balances/overviews',
    TRANSACTION: 'api/v1/balances/transactions',
    HISTORY: 'api/v1/balances/deposit_histories',
  },
  NOTIFICATION: {
    LIST: 'api/v1/notifications',
    READ: 'api/v1/notifications/read',
    MARK_ALL_READ: 'api/v1/notifications/mark_all_read',
  },
  SCHEDULED_REFRESHS: 'api/v1/scheduled_refreshs',
  PROFILES: {
    GET_MY_PROFILE: 'api/v1/profiles/me',
    UPDATE_MY_PROFILE: 'api/v1/profiles/me',
    UPDATE_AVATAR: 'api/v1/profiles/update_avatar',
    GET_PROFILE_ID: 'api/v1/profiles',
    UPDATE_PASSWORD: 'api/v1/profiles/update_password',
    UPDATE_PHONE: 'api/v1/profiles/update_phone',
  },
};
