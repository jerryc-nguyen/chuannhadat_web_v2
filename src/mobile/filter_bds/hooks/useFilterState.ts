import { useAtom } from 'jotai';
import {
  filterFieldOptionsAtom,
  filterStateAtom,
  localFilterStateAtom,
} from '../states';
import { OptionForSelect } from '@models';
import {
  FilterFieldName,
  FILTER_FIELDS_TO_PARAMS,
  FILTER_FIELDS_PARAMS_MAP,
} from '@models';
import { FilterChipOption } from '../FilterChips';
import { searchApi } from '@api/searchApi';
import { useMemo } from 'react';

export default function useFilterState() {
  console.log('calling in server');

  const [filterState, setFilterState] =
    useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom,
  );
  const [filterFieldOptions] = useAtom(
    filterFieldOptionsAtom,
  );

  const copyFilterStatesToLocalByFieldId = (
    fieldIds: Array<FilterFieldName>,
  ) => {
    let values: Record<string, A> = {};
    fieldIds?.forEach((fieldId) => {
      const fieldName = FilterFieldName[fieldId];
      if (fieldId == FilterFieldName.locations) {
        values = {
          city: filterState.city,
          district: filterState.district,
          ward: filterState.ward,
        };
      } else if (fieldId == FilterFieldName.rooms) {
        values = {
          bath: filterState.bath,
          bed: filterState.bed,
        };
      } else {
        values[fieldName] = (
          filterState as Record<string, A>
        )[fieldName];
      }
    });
    setLocalFilterState({ ...values });
  };

  const copyFilterStatesToLocal = (
    fieldIds: Array<FilterFieldName> = [],
  ) => {
    if (fieldIds.length > 0) {
      copyFilterStatesToLocalByFieldId(fieldIds);
    } else {
      setLocalFilterState({ ...filterState });
    }
  };

  const getLocalFieldValue = (fieldId: FilterFieldName) => {
    const fieldName = FilterFieldName[fieldId];
    // @ts-ignore: read value
    return localFilterState[fieldName];
  };

  const setLocalFieldValue = (
    fieldId: FilterFieldName,
    option: OptionForSelect | undefined,
  ) => {
    const fieldName = FilterFieldName[fieldId];
    const finalOption =
      option?.value != 'all' ? option : undefined;

    setLocalFilterState({
      ...localFilterState,
      [fieldName]: finalOption,
    });
  };

  const applyAllFilters = (filters?: A) => {
    console.log('localFilterState', localFilterState);
    setFilterState({
      ...localFilterState,
      ...filters,
    });
    syncSelectedParamsToUrl();
    console.log('buildFilterParams', buildFilterParams());
  };

  const buildFilterParams = ({
    withLocal = true,
  }: { withLocal?: boolean } = {}): Record<string, A> => {
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
      const option = allCurrentFilters[
        fieldName
      ] as OptionForSelect;

      if (
        !option?.value &&
        !option?.range &&
        !option?.params
      ) {
        return;
      } else if (option.value) {
        results[paramName] = option.value;
      } else if (option.params) {
        results = { ...results, ...option.params };
      } else {
        results[paramName] = [
          option?.range?.min,
          option?.range?.max,
        ].join(',');
      }
    });

    return results;
  };

  const applySingleFilter = (
    filterOption: FilterChipOption,
  ) => {
    let localValue: Record<string, A> = {};

    if (filterOption.id == FilterFieldName.locations) {
      localValue = {
        city: localFilterState.city,
        district: localFilterState.district,
        ward: localFilterState.ward,
      };
    } else if (filterOption.id == FilterFieldName.rooms) {
      localValue = {
        bed: localFilterState.bed,
        bath: localFilterState.bath,
      };
    } else {
      const fieldName =
        FilterFieldName[filterOption.id as A];

      localValue = {
        // @ts-ignore: read value
        [fieldName]: localFilterState[fieldName],
      };
    }

    setFilterState({ ...filterState, ...localValue });
    syncSelectedParamsToUrl();
  };

  const syncSelectedParamsToUrl = async () => {
    const filterParams = buildFilterParams();
    filterParams.only_url = true;

    const response = await searchApi(filterParams);

    const { listing_url } = response;
    window.history.pushState({}, '', listing_url);
  };

  const applySort = () => {
    setFilterState({
      ...filterState,
      sort: localFilterState.sort,
    });
    syncSelectedParamsToUrl();
  };

  const selectedSortText = useMemo((): string => {
    return filterState.sort?.text || 'Sắp xếp';
  }, [filterState]);

  return {
    filterState: filterState,
    localFilterState: localFilterState,
    filterFieldOptions: filterFieldOptions,
    getLocalFieldValue: getLocalFieldValue,
    setLocalFieldValue: setLocalFieldValue,
    applyAllFilters: applyAllFilters,
    buildFilterParams: buildFilterParams,
    applySingleFilter: applySingleFilter,
    copyFilterStatesToLocal: copyFilterStatesToLocal,
    applySort: applySort,
    selectedSortText: selectedSortText,
  };
}
