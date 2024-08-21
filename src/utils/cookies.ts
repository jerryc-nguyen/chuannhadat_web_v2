import cookies from "js-cookie";

export const getCookie = (name: any) => cookies.get(name);
export const setCookie = (name: any, value: any, expires = 1) =>
  cookies.set(name, value, { expires });
export const removeCookie = (name: any) => cookies.remove(name);
