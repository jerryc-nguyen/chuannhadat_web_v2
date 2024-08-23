import { CURRENT_USER_KEY } from './constants';

export class AuthUtils {
  static getCurrentUser() {
    try {
      const currentUserStr = window.localStorage.getItem(
        CURRENT_USER_KEY,
      );

      return currentUserStr
        ? JSON.parse(currentUserStr)
        : null;
    } catch (err) {
      return null;
    }
  }

  static getAccessToken(): string {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser['auth_token'] : null;
  }
}
