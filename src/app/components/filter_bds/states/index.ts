import { atom } from 'jotai';
import { FilterState, FilterOption, FilterFieldName } from '../types';

export const defaultFilterOption: FilterOption = {
  text: '',
  params: {}
};

import searchFormOptions from './search_form_options.json';

export const openFilterModalAtom = atom(false);
export const openBottomSheetFilterAtom = atom(false);
export const curBottomSheetFieldAtom = atom<FilterFieldName>(
  FilterFieldName.none
);

export const openBtsFilterAtom = atom(
  null,
  (get, set, fieldName: FilterFieldName) => {
    set(curBottomSheetFieldAtom, fieldName);
    set(openBottomSheetFilterAtom, true);
  }
);

export const filterStateAtom = atom<FilterState>({
  bedOptions: searchFormOptions.beds_rooms,
  bathOptions: searchFormOptions.baths_rooms,
  priceOptions: searchFormOptions.sell_prices,
  areaOptions: searchFormOptions.areas,
  directionOptions: searchFormOptions.directions,
  propertyTypeOptions: searchFormOptions.property_types,
  selectedBedOption: undefined,
  selectedBathOption: undefined,
  selectedPriceOption: undefined,
  selectedAreaOption: undefined,
  selectedDirectionOption: undefined,
  selectedPropertyTypeOption: undefined,
  selectedCity: undefined,
  selectedDistrict: undefined,
  selectedWard: undefined
});

export const applyFieldBtsFilterAtom = atom(
  null,
  (
    get,
    set,
    { fieldName, option }: { fieldName: FilterFieldName; option: FilterOption }
  ) => {
    let state = get(filterStateAtom);

    switch (fieldName) {
      case FilterFieldName.propertyType: {
        set(filterStateAtom, {
          ...state,
          selectedPropertyTypeOption: option
        });
        break;
      }
      case FilterFieldName.price: {
        set(filterStateAtom, { ...state, selectedPriceOption: option });
        break;
      }
      case FilterFieldName.area: {
        set(filterStateAtom, { ...state, selectedAreaOption: option });
        break;
      }
      case FilterFieldName.beds: {
        set(filterStateAtom, { ...state, selectedBedOption: option });
        break;
      }
      case FilterFieldName.baths: {
        set(filterStateAtom, { ...state, selectedBathOption: option });
        break;
      }
      case FilterFieldName.direction: {
        set(filterStateAtom, {
          ...state,
          selectedDirectionOption: option
        });
        break;
      }
    }

    let afterState = get(filterStateAtom);
    console.log('After apply filter', afterState);
    set(openBottomSheetFilterAtom, false);
  }
);

export const clearFieldBtsFilterAtom = atom(
  null,
  (get, set, { fieldName }: { fieldName: FilterFieldName }) => {
    let state = get(filterStateAtom);

    switch (fieldName) {
      case FilterFieldName.propertyType: {
        set(filterStateAtom, {
          ...state,
          selectedPropertyTypeOption: undefined
        });
        break;
      }
      case FilterFieldName.price: {
        set(filterStateAtom, { ...state, selectedPriceOption: undefined });
        break;
      }
      case FilterFieldName.area: {
        set(filterStateAtom, { ...state, selectedAreaOption: undefined });
        break;
      }
      case FilterFieldName.beds: {
        set(filterStateAtom, { ...state, selectedBedOption: undefined });
        break;
      }
      case FilterFieldName.baths: {
        set(filterStateAtom, { ...state, selectedBathOption: undefined });
        break;
      }
      case FilterFieldName.direction: {
        set(filterStateAtom, { ...state, selectedDirectionOption: undefined });
        break;
      }
    }

    set(openBottomSheetFilterAtom, false);
  }
);
