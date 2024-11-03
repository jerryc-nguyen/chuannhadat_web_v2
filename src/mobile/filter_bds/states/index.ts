import { atom } from 'jotai';
import { defaultListFilterOptions } from '../constants';
import { FilterFieldOptions, FilterState } from '../types';

export const openFilterModalAtom = atom(false);
export const locationsAtom = atom(false);

export const defaultFilterStateAtom = {
  businessType: undefined,
  categoryType: undefined,
  bed: undefined,
  bath: undefined,
  price: undefined,
  area: undefined,
  direction: undefined,
  city: undefined,
  district: undefined,
  ward: undefined,
  sort: undefined,
  busCatType: undefined
};
export const filterStateAtom = atom<FilterState>(defaultFilterStateAtom);

export const localFilterStateAtom = atom<FilterState>({});

export const filterFieldOptionsAtom = atom<FilterFieldOptions>(
  defaultListFilterOptions as FilterFieldOptions,
);
export const isRedirectWhenApplyFilter = atom<boolean>(true);
