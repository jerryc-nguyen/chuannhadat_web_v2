import { atom } from 'jotai';

export const openModalDepositAtom = atom<boolean>(false);
export const statusTransactionAtom = atom<boolean>(false);
export const depositAmountAtom = atom<number | undefined>(undefined);
export const latestCreditIdAtom = atom<number | null>(null);
