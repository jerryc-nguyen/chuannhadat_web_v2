import { ILoginResponse } from '@mobile/auth/types';
import { CURRENT_USER_KEY } from './constants';
import { getFromStorage } from './localstorage';

export class AuthUtils {
  static getCurrentUser(): ILoginResponse | null {
    try {
      const currentUserStr = getFromStorage(CURRENT_USER_KEY);

      return currentUserStr ? JSON.parse(currentUserStr) : null;
    } catch (err) {
      return null;
    }
  }

  static getAccessToken(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser['api_token'] : null;
  }
}
