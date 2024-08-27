import { atom } from 'jotai';

export const timeRefreshAtom = atom<string>('00:00');
export const showDialogAddRefreshAtom = atom<boolean>(false);
export const showDialogUpdateRefreshAtom = atom<boolean>(false);
