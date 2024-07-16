import { atom } from 'jotai';

export enum InnerBtsEnum {
  city,
  district,
  ward,
}

export const innerBtsLocationAtom = atom<undefined | InnerBtsEnum>(
  undefined
);
