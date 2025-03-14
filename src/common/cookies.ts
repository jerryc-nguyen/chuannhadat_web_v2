import cookies from 'js-cookie';
import { API_TOKEN_CIENT, FRONTEND_TOKEN } from './auth';

// Use days for js-cookie (it's more natural for this library)
// https://github.com/js-cookie/js-cookie#expires
const THIRTY_DAYS = 30; // js-cookie uses days for expiration

export const defaultConfigToken: Cookies.CookieAttributes = {
  secure: true,
  expires: THIRTY_DAYS, // js-cookie uses days, not milliseconds or seconds
  sameSite: 'lax',
  // HTTP-only can only be set by the server, not by client JavaScript
  // We're not using HTTP-only since we need JavaScript access
};

export const getCookie = (name: A) => cookies.get(name);
export const setCookie = (name: A, value: A, cookieAttributes = defaultConfigToken) =>
  cookies.set(name, value, cookieAttributes);
export const removeCookie = (name: A) => cookies.remove(name);
export const setTokenClient = (value: string) => {
  cookies.set(API_TOKEN_CIENT, value, defaultConfigToken);
};
export const setFrontendToken = (value: string) => {
  cookies.set(FRONTEND_TOKEN, value, defaultConfigToken);
};
export const getTokenClient = () => {
  return cookies.get(API_TOKEN_CIENT);
};
export const getFrontendTokenClient = () => {
  return cookies.get(FRONTEND_TOKEN);
};
export const removeTokenClient = () => {
  cookies.remove(API_TOKEN_CIENT);
};
