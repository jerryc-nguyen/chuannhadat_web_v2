import { atom } from 'jotai';
import { Modal } from './types';

export const btsRefAtom = atom<A>(undefined);
export const btsModalAtom = atom<Modal | undefined>(
  undefined,
);
export const btsModal2Atom = atom<Modal | undefined>(
  undefined,
);
export const btsModal3Atom = atom<Modal | undefined>(
  undefined,
);
