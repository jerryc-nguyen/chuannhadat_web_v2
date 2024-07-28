import { useAtom } from 'jotai';
import { filterStateAtom, localFilterStateAtom } from '../states';
import { OptionForSelect } from '@app/types';
import {
  FilterFieldName,
  FILTER_FIELDS_TO_PARAMS,
  FILTER_FIELDS_PARAMS_MAP,
} from '@app/types';
import { FilterChipOption } from '../FilterChips';
import { useMemo } from 'react';

export default function useFilterState() {
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const getFieldValue = (fieldId: FilterFieldName) => {
    const fieldName = FilterFieldName[fieldId];
    // @ts-ignore
    return localFilterState[fieldName] ?? filterState[fieldName];
  };

  const setLocalFieldValue = (
    fieldId: FilterFieldName,
    option: OptionForSelect | undefined
  ) => {
    const fieldName = FilterFieldName[fieldId];
    const finalOption = option?.value != 'all' ? option : undefined;

    // @ts-ignore
    setLocalFilterState({
      ...localFilterState,
      [fieldName]: finalOption,
    });
  };

  const applyAllFilters = (filters?: {}) => {
    console.log('currentLocalFilters', currentLocalFilters);
    setFilterState({
      ...currentLocalFilters,
      ...filters,
    });

    console.log('filterParams', filterParams());
  };

  const filterParams = (): Record<string, any> => {
    const results: Record<string, any> = {};
    const allCurrentFilters: Record<string, any> = {
      ...filterState,
      ...localFilterState,
    };

    FILTER_FIELDS_TO_PARAMS.forEach((fieldName: string) => {
      const paramName = FILTER_FIELDS_PARAMS_MAP[fieldName];
      const option = allCurrentFilters[fieldName] as OptionForSelect;

      if (!option?.value && !option?.range) {
        return;
      } else if (option.value) {
        results[paramName] = option.value;
      } else {
        results[paramName] = [
          option?.range?.min,
          option?.range?.max,
        ].join(',');
      }
    });

    return results;
  };

  const currentLocalFilters = useMemo(() => {
    return {
      ...filterState,
      ...localFilterState,
    };
  }, [filterState, localFilterState]);

  const applySingleFilter = (filterOption: FilterChipOption) => {
    let localValue: Record<string, any> = {};

    if (filterOption.id == FilterFieldName.locations) {
      localValue = {
        city: currentLocalFilters.city,
        district: currentLocalFilters.district,
        ward: currentLocalFilters.ward,
      };
    } else if (filterOption.id == FilterFieldName.rooms) {
      if (currentLocalFilters.bed) {
        localValue.bed = currentLocalFilters.bed;
      }
      if (currentLocalFilters.bath) {
        localValue.bath = currentLocalFilters.bath;
      }
    } else {
      // @ts-ignore
      const fieldName = FilterFieldName[filterOption.id];

      localValue = {
        // @ts-ignore
        [fieldName]: currentLocalFilters[fieldName],
      };
    }

    setFilterState({ ...filterState, ...localValue });
  };

  return {
    filterState: filterState,
    localFilterState: localFilterState,
    getFieldValue: getFieldValue,
    setLocalFieldValue: setLocalFieldValue,
    applyAllFilters: applyAllFilters,
    filterParams: filterParams,
    applySingleFilter: applySingleFilter,
    currentLocalFilters: currentLocalFilters,
  };
}
