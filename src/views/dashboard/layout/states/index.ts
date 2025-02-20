import { IBalanceResponse } from '@mobile/main-financial-management/types';
import { atom } from 'jotai';

const initialData = {
    tk_chinh: '0 Xu',
    tk_km: '0 Xu',
    total: '0 Xu',
}
export const balanceDataAtom = atom<IBalanceResponse>(initialData);