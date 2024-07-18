import { atom } from 'jotai';
import { Modal } from './types';

export const btsRefAtom = atom<any>(undefined);
export const btsModalAtom = atom<Modal | undefined>(undefined);
