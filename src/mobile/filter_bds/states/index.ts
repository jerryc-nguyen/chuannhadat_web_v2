import { atom } from 'jotai';
import { OptionForSelect } from '@models';

export const openFilterModalAtom = atom(false);
export const locationsAtom = atom(false);

import searchFormOptions from './search_form_options.json';
import {
  ALL_OPTION,
  DEFAULT_BUSINESS_TYPE_OPTION,
} from '@common/constants';

export interface FilterState {
  businessTypeOptions?: OptionForSelect[];
  categoryTypeOptions?: OptionForSelect[];
  bedOptions?: OptionForSelect[];
  bathOptions?: OptionForSelect[];
  priceOptions?: OptionForSelect[];
  areaOptions?: OptionForSelect[];
  directionOptions?: OptionForSelect[];
  roomOptions?: OptionForSelect[];
  businessType?: OptionForSelect;
  categoryType?: OptionForSelect;
  bed?: OptionForSelect;
  bath?: OptionForSelect;
  price?: OptionForSelect;
  area?: OptionForSelect;
  direction?: OptionForSelect;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  sort?: OptionForSelect;
}

export interface FilterFieldOptions {
  businessTypeOptions?: OptionForSelect[];
  categoryTypeOptions?: OptionForSelect[];
  bedOptions?: OptionForSelect[];
  bathOptions?: OptionForSelect[];
  priceOptions?: OptionForSelect[];
  areaOptions?: OptionForSelect[];
  directionOptions?: OptionForSelect[];
  roomOptions?: OptionForSelect[];
}

export const filterStateAtom = atom<FilterState>({
  businessType: DEFAULT_BUSINESS_TYPE_OPTION,
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
});

export const localFilterStateAtom = atom<FilterState>({});

export const filterFieldOptionsAtom =
  atom<FilterFieldOptions>({
    // @ts-ignore: ingore
    businessTypeOptions: searchFormOptions.business_types,
    categoryTypeOptions: [
      ALL_OPTION,
      ...searchFormOptions.category_types,
    ],
    bedOptions: [ALL_OPTION, ...searchFormOptions.rooms],
    bathOptions: [ALL_OPTION, ...searchFormOptions.rooms],
    priceOptions: [
      ALL_OPTION,
      ...searchFormOptions.sell_prices,
    ],
    areaOptions: [ALL_OPTION, ...searchFormOptions.areas],
    directionOptions: [
      ALL_OPTION,
      ...searchFormOptions.directions,
    ],
    roomOptions: [ALL_OPTION, ...searchFormOptions.rooms],
  });
