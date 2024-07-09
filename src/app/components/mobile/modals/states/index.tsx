import { atom } from 'jotai';
import { Modal } from './types';

export const btsRefAtom = atom<any>(undefined);
export const openModalAtom = atom<Modal | undefined>(undefined);

export const closeBtsModalAtom = atom(null, (get, set) => {
  set(openModalAtom, undefined);
});
