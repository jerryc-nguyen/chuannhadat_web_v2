import { atom } from 'jotai';

export const openModalDepositAtom = atom<boolean>(false);
export const statusTransactionAtom = atom<boolean>(false);
export const depositAmountAtom = atom<string | undefined>(undefined);
