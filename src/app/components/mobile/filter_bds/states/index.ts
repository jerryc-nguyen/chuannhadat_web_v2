import { atom } from 'jotai';
import { FilterOption, FilterFieldName } from '../types';

export const defaultFilterOption: FilterOption = {
  text: '',
  params: {},
};

export const openFilterModalAtom = atom(false);

import searchFormOptions from './search_form_options.json';

export interface FilterState {
  bedOptions?: FilterOption[];
  bathOptions?: FilterOption[];
  priceOptions?: FilterOption[];
  areaOptions?: FilterOption[];
  directionOptions?: FilterOption[];
  categoryTypeOptions?: FilterOption[];
  businessType?: FilterOption;
  categoryType?: FilterOption;
  bed?: FilterOption;
  bath?: FilterOption;
  price?: FilterOption;
  area?: FilterOption;
  direction?: FilterOption;
  city?: FilterOption;
  district?: FilterOption;
  ward?: FilterOption;
}

export const filterStateAtom = atom<FilterState>({
  bedOptions: searchFormOptions.beds_rooms,
  bathOptions: searchFormOptions.baths_rooms,
  priceOptions: searchFormOptions.sell_prices,
  areaOptions: searchFormOptions.areas,
  directionOptions: searchFormOptions.directions,
  categoryTypeOptions: searchFormOptions.property_types,
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
});

export const localFilterStateAtom = atom<FilterState>({
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
});
