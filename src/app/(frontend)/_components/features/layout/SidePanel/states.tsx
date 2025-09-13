import { atom } from 'jotai';
import { ReactElement } from 'react';

export type TPanel = {
  content?: ReactElement | string;
  onClosed?: IFunction;
  side?: 'top' | 'bottom' | 'left' | 'right' | null | undefined;
};
export const sidePanelAtom = atom<TPanel | undefined>(undefined);
