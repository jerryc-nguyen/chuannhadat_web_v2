import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  defaultFilterStateAtom,
  filterFieldOptionsAtom,
  filterStateAtom,
  localFilterStateAtom,
} from '../states';
import { OptionForSelect } from '@models';
import { FilterFieldName, FILTER_FIELDS_TO_PARAMS, FILTER_FIELDS_PARAMS_MAP } from '@models';
import { searchApi } from '@api/searchApi';
import { useMemo } from 'react';
import { FilterChipOption, FilterState } from '../types';
import { objectToQueryParams } from '@common/utils';
import { usePathname } from 'next/navigation';

export default function useFilterState() {
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(localFilterStateAtom);
  const filterFieldOptions = useAtomValue(filterFieldOptionsAtom);
  const pathname = usePathname();
  const resetDataFilter = () => {
    setFilterState(defaultFilterStateAtom);
    setLocalFilterState({});
  };
  const copyFilterStatesToLocalByFieldId = (fieldNames: Array<FilterFieldName>) => {
    let values: Record<string, A> = {};
    fieldNames?.forEach((fieldName) => {
      if (fieldName == FilterFieldName.Locations) {
        values = {
          city: filterState.city,
          district: filterState.district,
          ward: filterState.ward,
        };
      } else if (fieldName == FilterFieldName.Rooms) {
        values = {
          bath: filterState.bath,
          bed: filterState.bed,
        };
      } else {
        values[fieldName] = (filterState as Record<string, A>)[fieldName];
      }
    });
    setLocalFilterState({ ...values });
  };
  const copyFilterStatesToLocal = (fieldIds: Array<FilterFieldName> = []) => {
    if (fieldIds.length > 0) {
      copyFilterStatesToLocalByFieldId(fieldIds);
    } else {
      setLocalFilterState({ ...filterState });
    }
  };

  const getLocalFieldValue = (fieldName: FilterFieldName) => {
    return localFilterState[fieldName as keyof FilterState];
  };

  const setLocalFieldValue = (fieldId: FilterFieldName, option: OptionForSelect | undefined) => {
    const finalOption = option?.value != 'all' ? option : undefined;

    setLocalFilterState({
      ...localFilterState,
      [fieldId]: finalOption,
    });
  };
  const removeFilterValue = (fieldId: FilterFieldName) => {
    setLocalFilterState({
      ...localFilterState,
      [fieldId]: undefined,
    });
    applyAllFilters({ [fieldId]: undefined });
  };

  const applyAllFilters = (filters?: A) => {
    const allFilterState = {
      ...filterState,
      ...filters,
    };

    setFilterState(allFilterState);
    syncSelectedParamsToUrl();
  };

  const buildFilterParams = ({ withLocal = true }: { withLocal?: boolean } = {}): Record<
    string,
    A
  > => {
    let results: Record<string, A> = {};
    let allCurrentFilters: Record<string, A> = {
      ...filterState,
    };
    if (withLocal) {
      allCurrentFilters = {
        ...allCurrentFilters,
        ...localFilterState,
      };
    }
    FILTER_FIELDS_TO_PARAMS.forEach((fieldName: string) => {
      const paramName = FILTER_FIELDS_PARAMS_MAP[fieldName];
      const option = allCurrentFilters[fieldName] as OptionForSelect;

      if (!option?.value && !option?.range && !option?.params) {
        return;
      } else if (option.value) {
        results[paramName] = option.value;
      } else if (option.params) {
        results = { ...results, ...option.params };
      } else {
        results[paramName] = [option?.range?.min, option?.range?.max].join(',');
      }
    });
    return results;
  };

  const applySingleFilter = (filterOption: FilterChipOption) => {
    let localValue: Record<string, A> = {};

    if (filterOption.id == FilterFieldName.Locations) {
      localValue = {
        city: localFilterState.city,
        district: localFilterState.district,
        ward: localFilterState.ward,
      };
    } else if (filterOption.id == FilterFieldName.Rooms) {
      localValue = {
        bed: localFilterState.bed,
        bath: localFilterState.bath,
      };
    } else {
      const fieldName = filterOption.id;

      localValue = {
        // @ts-ignore: read value
        [fieldName]: localFilterState[fieldName],
      };
    }
    const allFilterState = { ...filterState, ...localValue };
    setFilterState(allFilterState);
    syncSelectedParamsToUrl();
  };

  const syncSelectedParamsToUrl = async () => {
    const filterParams = buildFilterParams();
    filterParams.only_url = true;
    const response = await searchApi(filterParams);
    const { listing_url } = response;
    window.history.pushState({}, '', listing_url);
  };

  // handle apply filter by sort in mobile
  const applySortFilter = () => {
    const newFilterState = {
      ...filterState,
      sort: localFilterState.sort,
    };
    applyFilterToSyncParams(newFilterState);
  };

  const applyFilterToSyncParams = (newFilterState: FilterState) => {
    setFilterState(newFilterState);
    syncSelectedParamsToUrl();
  };

  const selectedSortText = useMemo((): string | undefined => {
    return filterState.sort?.text as string | undefined;
  }, [filterState.sort?.text]);

  return {
    filterState,
    localFilterState,
    filterFieldOptions,
    getLocalFieldValue,
    setLocalFieldValue,
    applyAllFilters,
    buildFilterParams,
    applySingleFilter,
    copyFilterStatesToLocal,
    resetDataFilter,
    applySortFilter,
    selectedSortText,
    removeFilterValue,
  };
}
