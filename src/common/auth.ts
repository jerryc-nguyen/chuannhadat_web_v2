import { ILoginResponse } from '@mobile/auth/types';
import { getFromStorage, removeFromStorage, saveToStorage } from './localstorage';
import { getCookie } from './cookies';

export const CURRENT_USER_KEY = 'current_user';
export const API_TOKEN = 'token';

export class AuthUtils {
  static updateCurrentUser(user: ILoginResponse) {
    try {
      saveToStorage(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (err) {
      return null;
    }
  }

  static getCurrentUser(): ILoginResponse | null {
    try {
      const currentUserStr = getFromStorage(CURRENT_USER_KEY);
      return currentUserStr;
    } catch (err) {
      return null;
    }
  }

  static removeCurrentUser() {
    try {
      removeFromStorage(CURRENT_USER_KEY);
    } catch (err) {
      return null;
    }
  }

  static getAccessToken(): string | undefined {
    try {
      return getCookie(API_TOKEN);
    } catch (err) {
      return undefined;
    }
  }
}
