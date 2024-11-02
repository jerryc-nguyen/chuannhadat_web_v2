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
import { usePathname } from 'next/navigation';
import { AuthUtils } from '@common/auth';

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
      if (fieldName == FilterFieldName.Locations ||
        fieldName == FilterFieldName.ProfileLocations) {
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
    let newFilteState = {};

    if (fieldId == FilterFieldName.Locations ||
      fieldId == FilterFieldName.ProfileLocations) {
      newFilteState = {
        ...filterState,
        city: undefined,
        district: undefined,
        ward: undefined,
      };
    } else if (fieldId == FilterFieldName.Rooms) {
      newFilteState = {
        ...filterState,
        bath: undefined,
        bed: undefined,
      };
    } else {
      newFilteState = {
        ...filterState,
        [fieldId]: undefined,
      }
    }

    setFilterState(newFilteState)
    syncSelectedParamsToUrl(newFilteState);
  };

  const applyAllFilters = (filters?: A) => {
    const allFilterState = {
      ...filterState,
      ...filters,
    };

    setFilterState(allFilterState);
    syncSelectedParamsToUrl(allFilterState);
  };

  const buildFilterParams = ({ withLocal = true, overrideStates = {} }: {
    withLocal?: boolean, overrideStates?: Record<string, A>
  }): Record<string, A> => {
    let results: Record<string, A> = {};
    let allCurrentFilters: Record<string, A> = {
      ...filterState,
      ...overrideStates
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

    return { ...results, ...extraSearchParams };
  };

  const applySingleFilter = (filterOption: FilterChipOption) => {
    let localValue: Record<string, A> = {};

    if (filterOption.id == FilterFieldName.Locations ||
      filterOption.id == FilterFieldName.ProfileLocations) {
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
    syncSelectedParamsToUrl(allFilterState);
  };

  const syncSelectedParamsToUrl = async (filterParams: Record<string, A>) => {
    let queryOptions = buildFilterParams({ withLocal: false, overrideStates: filterParams });
    queryOptions = {
      ...queryOptions,
      only_url: true,
    };
    const response = await searchApi(queryOptions);
    const { listing_url } = response;
    window.history.pushState({}, '', listing_url);
  };

  const extraSearchParams = useMemo(() => {
    if (pathname.indexOf('profile/') != -1) {
      return {
        search_scope: 'profile',
        author_slug: pathname.split('profile/')[1]
      };
    } else if (pathname.indexOf('/new-post') != -1 && AuthUtils.getCurrentUser()) {
      return {
        search_scope: 'manage',
        author_slug: AuthUtils.getCurrentUser()?.slug
      };
    } else {
      return {
        search_scope: 'search'
      };
    }
  }, [pathname])

  // handle apply filter by sort in mobile
  const applySortFilter = () => {
    const newFilterState = {
      ...filterState,
      sort: localFilterState.sort,
    };
    syncSelectedParamsToUrl(newFilterState);
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
    extraSearchParams
  };
}
