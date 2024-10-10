import cookies from 'js-cookie';
import { API_TOKEN } from './auth';
import { timeOutDuration } from './constants';

export const getCookie = (name: A) => cookies.get(name);
export const setCookie = (name: A, value: A, expires = 1) => cookies.set(name, value, { expires });
export const removeCookie = (name: A) => cookies.remove(name);
export const setToken = (value: string) => {
  const expiredTime = new Date(new Date().getTime() + timeOutDuration);
  cookies.set(API_TOKEN, value, {
    secure: true,
    expires: expiredTime,
    sameSite: 'lax',
    httpOnly: false,
  });
};
export const getToken = () => {
  return cookies.get(API_TOKEN);
};
