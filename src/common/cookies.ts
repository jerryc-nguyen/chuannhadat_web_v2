import cookies from 'js-cookie';

export const getCookie = (name: A) => cookies.get(name);
export const setCookie = (name: A, value: A, expires = 1) =>
  cookies.set(name, value, { expires });
export const removeCookie = (name: A) =>
  cookies.remove(name);
