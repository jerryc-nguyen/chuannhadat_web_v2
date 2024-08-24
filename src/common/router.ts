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
};
