import { ILoginResponse } from '@mobile/auth/types';
import { getFromStorage, removeFromStorage } from './localstorage';

export const CURRENT_USER_KEY = 'current_user';
export const API_TOKEN = 'token';

export class AuthUtils {
  static getCurrentUser(): ILoginResponse | null {
    try {
      const currentUserStr = getFromStorage(CURRENT_USER_KEY);

      return currentUserStr ? JSON.parse(currentUserStr) : null;
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

  static getAccessToken(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser['api_token'] : null;
  }
}
