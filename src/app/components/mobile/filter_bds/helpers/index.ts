import { FilterFieldName, FilterState, FilterOption } from '../types';

export const selectedFilterText = (
  state: FilterState,
  fieldName: FilterFieldName
) => {
  switch (fieldName) {
    case FilterFieldName.propertyType: {
      return state.selectedPropertyTypeOption?.text;
    }
    case FilterFieldName.price: {
      return state.selectedPriceOption?.text;
    }
    case FilterFieldName.area: {
      return state.selectedAreaOption?.text;
    }
    case FilterFieldName.beds: {
      return state.selectedBedOption?.text;
    }
    case FilterFieldName.baths: {
      return state.selectedBathOption?.text;
    }
    case FilterFieldName.direction: {
      return state.selectedDirectionOption?.text;
    }
  }
};

export const formattedReactSelectOptions = (options: FilterOption[]) => {
  return options.map((item) => {
    return {
      value: item,
      label: item.text
    };
  });
};
