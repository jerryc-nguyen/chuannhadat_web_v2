import { useMemo } from 'react';
import { filterStateAtom, localFilterStateAtom } from '@frontend/CategoryPage/mobile/filter_bds/states';
import { useAtom, useAtomValue } from 'jotai';
import { FilterFieldName } from '@common/types';

export function useFilterLocations() {
  const [filterState] = useAtom(filterStateAtom);
  const localFilterState = useAtomValue(localFilterStateAtom);

  const selectedLocationText = useMemo((): string | undefined => {
    return filterState?.ward?.text ?? filterState?.district?.text ?? filterState?.city?.text;
  }, [filterState?.city, filterState?.district, filterState?.ward]);

  const selectedLocationFullText = useMemo((): string | undefined => {
    const results = [];
    if (filterState?.ward) {
      results.push(filterState?.ward.text);
    }
    if (filterState?.district) {
      results.push(filterState?.district.text);
    }
    if (filterState?.city) {
      results.push(filterState?.city.text);
    }
    return results.join(', ');
  }, [filterState?.city, filterState?.district, filterState?.ward]);

  const getLocalFieldValue = (fieldName: FilterFieldName) => {
    return localFilterState[fieldName as keyof typeof localFilterState];
  };

  const currentCity = getLocalFieldValue(FilterFieldName.City);
  const currentDistrict = getLocalFieldValue(FilterFieldName.District);
  const currentWard = getLocalFieldValue(FilterFieldName.Ward);

  const isSelectedLocation = useMemo((): boolean => {
    return !!(filterState?.city || filterState?.district || filterState?.ward);
  }, [filterState?.city, filterState?.district, filterState?.ward]);

  return {
    isSelectedLocation: isSelectedLocation,
    selectedLocationText: selectedLocationText,
    selectedLocationFullText: selectedLocationFullText,
    currentCity: currentCity,
    currentDistrict: currentDistrict,
    currentWard: currentWard,
  };
}
