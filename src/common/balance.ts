import { getFromStorage, removeFromStorage } from './localstorage';
import { IBalanceResponse } from '@desktop/dashboard/main-financial-management/types';

export const BALANCE_INFO_KEY = 'balance';

export class BalanceUtils {
  static getBalanceInfo(): IBalanceResponse | null {
    try {
      const balanceInfoStr = getFromStorage(BALANCE_INFO_KEY);

      return balanceInfoStr ? JSON.parse(balanceInfoStr) : null;
    } catch (err) {
      return null;
    }
  }

  static removeBalanceInfo() {
    try {
      removeFromStorage(BALANCE_INFO_KEY);
    } catch (err) {
      return null;
    }
  }

}
