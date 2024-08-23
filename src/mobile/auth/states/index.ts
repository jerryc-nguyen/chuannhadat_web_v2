import { atom } from 'jotai';
import { ILoginResponse } from '../types';

export const currentUserAtom = atom<
  ILoginResponse | undefined
>(undefined);
