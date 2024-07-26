import { atom } from 'jotai';
import { LocationOption } from '../types';
import { OptionForSelect } from '@app/types';

export const openFilterModalAtom = atom(false);
export const locationsAtom = atom(false);

import searchFormOptions from './search_form_options.json';
import { ALL_OPTION } from '@app/constants';

export interface FilterState {
  businessTypeOptions?: OptionForSelect[];
  categoryTypeOptions?: OptionForSelect[];
  bedOptions?: OptionForSelect[];
  bathOptions?: OptionForSelect[];
  priceOptions?: OptionForSelect[];
  areaOptions?: OptionForSelect[];
  directionOptions?: OptionForSelect[];
  cityOptions?: OptionForSelect[];
  districtOptions?: OptionForSelect[];
  wardOptions?: OptionForSelect[];
  businessType?: OptionForSelect;
  categoryType?: OptionForSelect;
  bed?: OptionForSelect;
  bath?: OptionForSelect;
  price?: OptionForSelect;
  area?: OptionForSelect;
  direction?: OptionForSelect;
  city?: LocationOption;
  district?: LocationOption;
  ward?: LocationOption;
}

export const filterStateAtom = atom<FilterState>({
  // @ts-ignore
  businessTypeOptions: searchFormOptions.business_types,
  categoryTypeOptions: searchFormOptions.category_types,
  bedOptions: searchFormOptions.rooms,
  bathOptions: searchFormOptions.rooms,
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
