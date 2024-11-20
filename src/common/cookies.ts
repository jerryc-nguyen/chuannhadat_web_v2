import cookies from 'js-cookie';
import { API_TOKEN_CIENT, FRONTEND_TOKEN } from './auth';
import { timeOutDuration } from './constants';
const expiredTime = new Date(new Date().getTime() + timeOutDuration);

export const defaultConfigToken: Cookies.CookieAttributes = {
  secure: true,
  expires: expiredTime,
  sameSite: 'lax',
  httpOnly: false,
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
