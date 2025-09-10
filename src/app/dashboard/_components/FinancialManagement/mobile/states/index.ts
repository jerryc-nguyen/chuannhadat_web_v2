import { atom } from 'jotai';
import { IBalanceResponse } from '../types';

export const balanceInfoAtom = atom<
  IBalanceResponse | null
>(null);
