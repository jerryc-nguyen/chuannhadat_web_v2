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
  roomOptions?: OptionForSelect[];
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
  businessTypeOptions: [
    ALL_OPTION,
    ...searchFormOptions.business_types,
  ],
  categoryTypeOptions: [
    ALL_OPTION,
    ...searchFormOptions.category_types,
  ],
  bedOptions: [ALL_OPTION, ...searchFormOptions.rooms],
  bathOptions: [ALL_OPTION, ...searchFormOptions.rooms],
  priceOptions: [ALL_OPTION, ...searchFormOptions.sell_prices],
  areaOptions: [ALL_OPTION, ...searchFormOptions.areas],
  directionOptions: [ALL_OPTION, ...searchFormOptions.directions],
  roomOptions: [ALL_OPTION, ...searchFormOptions.rooms],
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
