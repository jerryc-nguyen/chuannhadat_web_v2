import cookies from 'js-cookie';
import { API_TOKEN_CIENT } from './auth';
import { timeOutDuration } from './constants';

export const getCookie = (name: A) => cookies.get(name);
export const setCookie = (name: A, value: A, expires = 1) => cookies.set(name, value, { expires });
export const removeCookie = (name: A) => cookies.remove(name);
export const setTokenClient = (value: string) => {
  const expiredTime = new Date(new Date().getTime() + timeOutDuration);
  cookies.set(API_TOKEN_CIENT, value, {
    secure: true,
    expires: expiredTime,
    sameSite: 'lax',
    httpOnly: false,
  });
};
export const getTokenClient = () => {
  return cookies.get(API_TOKEN_CIENT);
};
export const removeTokenClient = () => {
  cookies.remove(API_TOKEN_CIENT);
};
