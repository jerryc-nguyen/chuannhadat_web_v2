import { IBalanceResponse } from '@dashboard/FinancialManagement/mobile/types';
import { atom } from 'jotai';

const initialData = {
  tk_chinh: '0 Xu',
  tk_km: '0 Xu',
  total: '0 Xu',
  total_amount: 0
}
export const balanceDataAtom = atom<IBalanceResponse>(initialData);
