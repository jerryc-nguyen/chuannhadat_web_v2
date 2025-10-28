import { searchApi } from '@frontend/features/search/api/searchApi';
import { AuthUtils } from '@common/auth';
import useSearchScope, { SearchScopeEnums } from '@frontend/features/search/hooks/useSearchScope';
import {
  FilterFieldName,
  OptionForSelect,
  SORT_CHIP_OPTION,
  FilterChipOption
} from '@common/types';

import { useAtom, useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import {
  filterFieldOptionsAtom,
  filterStateAtom,
  localFilterStateAtom,
} from '../states';
import { FILTER_FIELDS_PARAMS_MAP, FILTER_FIELDS_TO_PARAMS, FilterState } from '../types';


import { useFilterStatePresenter } from '../../filters-v2/hooks/useFilterStatePresenter';

export default function useFilterState() {
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(localFilterStateAtom);
  const filterFieldOptions = useAtomValue(filterFieldOptionsAtom);
  const pathname = usePathname() || '';
  const { searchScope } = useSearchScope();
  const { selectedFilterText, selectedRoomText, isActiveChip } = useFilterStatePresenter(filterState);

  const resetDataFilter = () => {
    setFilterState({});
    setLocalFilterState({});
  };

  const copyFilterStatesToLocalByFieldId = (fieldNames: Array<FilterFieldName>) => {
    let values: Record<string, A> = {};
    fieldNames?.forEach((fieldName) => {
      if (fieldName == FilterFieldName.Locations || fieldName == FilterFieldName.ProfileLocations) {
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
        values[fieldName] =
          (filterState as Record<string, A>)[fieldName] || localFilterState[fieldName];
      }
    });
    setLocalFilterState(values);
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
    // If case that finalOption is undefined, canot set checked value on Checbox with value is 'all'
    // const finalOption = option?.value != 'all' ? option : undefined;
    setLocalFilterState({
      ...localFilterState,
      [fieldId]: option,
    });
  };

  const removeFilterValue = (fieldId: FilterFieldName) => {
    // Create a new state object starting with current state
    const newFilterState: FilterState = { ...filterState };

    // Handle special cases for composite filters
    switch (fieldId) {
      case FilterFieldName.Locations:
      case FilterFieldName.ProfileLocations:
        newFilterState.city = undefined;
        newFilterState.district = undefined;
        newFilterState.ward = undefined;
        break;

      case FilterFieldName.Rooms:
        newFilterState.bath = undefined;
        newFilterState.bed = undefined;
        break;
      case FilterFieldName.AggProjects:
        newFilterState.aggProjects = undefined;
        newFilterState.project = undefined;
        newFilterState.city = undefined;
        newFilterState.district = undefined;
        newFilterState.ward = undefined;
        break;

      default:
        // For simple filters, just set the field to undefined
        (newFilterState as any)[fieldId] = undefined;
    }

    // Update both states
    setFilterState(newFilterState);
    setLocalFilterState(newFilterState);

    // Sync URL params
    syncSelectedParamsToUrl(newFilterState);

    return newFilterState;
  };

  const applyAllFilters = (filters?: A) => {
    const allFilterState = {
      ...filterState,
      ...filters,
    };

    setFilterState(allFilterState);
    syncSelectedParamsToUrl(allFilterState);
    return allFilterState;
  };

  const buildFilterParams = ({
    withLocal = true,
    overrideStates = {},
  }: {
    withLocal?: boolean;
    overrideStates?: Record<string, A>;
  }): Record<string, A> => {
    let results: Record<string, A> = {};
    let allCurrentFilters: Record<string, A> = {
      ...filterState,
      ...overrideStates,
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

  const applySingleFilter = (filterOption: FilterChipOption): FilterState => {
    let localValue: Record<string, A> = {};

    if (
      filterOption.id == FilterFieldName.Locations ||
      filterOption.id == FilterFieldName.ProfileLocations
    ) {
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
    } else if (filterOption.id == FilterFieldName.BusCatType) {
      localValue = {
        busCatType: localFilterState.busCatType,
        city: undefined,
        district: undefined,
        ward: undefined,
      };
    } else if (filterOption.id == FilterFieldName.AggProjects) {
      localValue = {
        aggProjects: localFilterState.aggProjects,
        project: localFilterState.aggProjects,
        city: undefined,
        district: undefined,
        ward: undefined,
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
    return allFilterState;
  };

  const syncSelectedParamsToUrl = async (filterParams: Record<string, A>) => {
    // disable auto sync state to url for manage post page
    if (searchScope == SearchScopeEnums.ManagePosts) {
      return;
    }

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
    if (searchScope == SearchScopeEnums.Profile) {
      return {
        search_scope: searchScope,
        author_slug: pathname.split('profile/')[1],
        aggs_for: 'profile',
      };
    } else if (searchScope == SearchScopeEnums.ManagePosts) {
      return {
        search_scope: searchScope,
        author_slug: AuthUtils.getCurrentUser()?.slug,
      };
    } else {
      return {
        search_scope: searchScope,
      };
    }
  }, [pathname, searchScope]);

  // handle apply filter by sort in mobile
  const applySortFilter = () => {
    applySingleFilter(SORT_CHIP_OPTION);
  };

  const selectedSortText = useMemo((): string | undefined => {
    return filterState.sort?.text as string | undefined;
  }, [filterState.sort?.text]);



  return {
    filterState,
    setFilterState,
    localFilterState,
    filterFieldOptions,
    getLocalFieldValue,
    setLocalFieldValue,
    setLocalFilterState,
    applyAllFilters,
    buildFilterParams,
    applySingleFilter,
    copyFilterStatesToLocal,
    resetDataFilter,
    applySortFilter,
    selectedSortText,
    removeFilterValue,
    extraSearchParams,
    selectedFilterText,
    selectedRoomText,
    isActiveChip,
  };
}
