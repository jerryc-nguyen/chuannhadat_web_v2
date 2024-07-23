import { atom } from 'jotai';
import {
  FilterOption,
  FilterFieldName,
  LocationOption,
} from '../types';

export const defaultFilterOption: FilterOption = {
  text: '',
  params: {},
};

export const openFilterModalAtom = atom(false);
export const locationsAtom = atom(false);

import searchFormOptions from './search_form_options.json';

export interface FilterState {
  businessTypeOptions?: FilterOption[];
  categoryTypeOptions?: FilterOption[];
  bedOptions?: FilterOption[];
  bathOptions?: FilterOption[];
  priceOptions?: FilterOption[];
  areaOptions?: FilterOption[];
  directionOptions?: FilterOption[];
  cityOptions?: FilterOption[];
  districtOptions?: FilterOption[];
  wardOptions?: FilterOption[];
  businessType?: FilterOption;
  categoryType?: FilterOption;
  bed?: FilterOption;
  bath?: FilterOption;
  price?: FilterOption;
  area?: FilterOption;
  direction?: FilterOption;
  city?: LocationOption;
  district?: LocationOption;
  ward?: LocationOption;
}

export const filterStateAtom = atom<FilterState>({
  businessTypeOptions: searchFormOptions.business_types,
  categoryTypeOptions: searchFormOptions.property_types,
  bedOptions: searchFormOptions.beds_rooms,
  bathOptions: searchFormOptions.baths_rooms,
  priceOptions: searchFormOptions.sell_prices,
  areaOptions: searchFormOptions.areas,
  directionOptions: searchFormOptions.directions,
  cityOptions: [],
  districtOptions: [],
  wardOptions: [],
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
