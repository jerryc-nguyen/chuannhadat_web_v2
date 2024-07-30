import { useAtom } from 'jotai';
import { filterStateAtom, localFilterStateAtom } from '../states';
import { OptionForSelect } from '@app/types';
import {
  FilterFieldName,
  FILTER_FIELDS_TO_PARAMS,
  FILTER_FIELDS_PARAMS_MAP,
} from '@app/types';
import { FilterChipOption } from '../FilterChips';

export default function useFilterState() {
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const copyFilterStatesToLocal = (
    fieldIds: Array<FilterFieldName> = []
  ) => {
    if (fieldIds.length > 0) {
      const values: Record<string, any> = {};
      fieldIds?.forEach((fieldId) => {
        const fieldName = FilterFieldName[fieldId];
        values[fieldName] = (filterState as Record<string, any>)[
          fieldName
        ];
      });
      setLocalFilterState({ ...values });
    } else {
      setLocalFilterState({ ...filterState });
    }
  };

  const getLocalFieldValue = (fieldId: FilterFieldName) => {
    const fieldName = FilterFieldName[fieldId];
    // @ts-ignore
    return localFilterState[fieldName];
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
    console.log('localFilterState', localFilterState);
    setFilterState({
      ...localFilterState,
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

  const applySingleFilter = (filterOption: FilterChipOption) => {
    let localValue: Record<string, any> = {};

    if (filterOption.id == FilterFieldName.locations) {
      localValue = {
        city: localFilterState.city,
        district: localFilterState.district,
        ward: localFilterState.ward,
      };
    } else if (filterOption.id == FilterFieldName.rooms) {
      if (localFilterState.bed) {
        localValue.bed = localFilterState.bed;
      }
      if (localFilterState.bath) {
        localValue.bath = localFilterState.bath;
      }
    } else {
      // @ts-ignore
      const fieldName = FilterFieldName[filterOption.id];

      localValue = {
        // @ts-ignore
        [fieldName]: localFilterState[fieldName],
      };
    }

    setFilterState({ ...filterState, ...localValue });
  };

  return {
    filterState: filterState,
    localFilterState: localFilterState,
    getLocalFieldValue: getLocalFieldValue,
    setLocalFieldValue: setLocalFieldValue,
    applyAllFilters: applyAllFilters,
    filterParams: filterParams,
    applySingleFilter: applySingleFilter,
    copyFilterStatesToLocal: copyFilterStatesToLocal,
  };
}
