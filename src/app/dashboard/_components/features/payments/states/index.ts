import { atom } from 'jotai';

export const openModalDepositAtom = atom<boolean>(false);
export const transferedSuccessAtom = atom<boolean>(false);
export const transferedAmountAtom = atom<string | undefined>(undefined);
export const depositAmountAtom = atom<number | undefined>(undefined);
export const latestCreditIdAtom = atom<number | null>(null);
