import { atom } from 'jotai';
import { Modal } from './types';

export const btsRefAtom = atom<any>(undefined);
export const btsModalAtom = atom<Modal | undefined>(undefined);
export const openBtsModalAtom = atom(false);
export const isModalOpenning = atom(
  (get) => get(btsModalAtom) != undefined
);
