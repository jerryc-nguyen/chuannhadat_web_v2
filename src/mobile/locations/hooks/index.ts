import { useMemo } from 'react';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { useAtom } from 'jotai';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { FilterFieldName } from '@models';

export function useFilterLocations() {
  const [filterState] = useAtom(filterStateAtom);
  const { getLocalFieldValue } = useFilterState();

  const selectedLocationText = useMemo((): string | undefined => {
    return filterState?.ward?.text ?? filterState?.district?.text ?? filterState?.city?.text;
  }, [filterState?.city, filterState?.district, filterState?.ward]);

  const selectedLocationFullText = useMemo((): string | undefined => {
    let results = [];
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


  const currentCity = getLocalFieldValue(FilterFieldName.city);
  const currentDistrict = getLocalFieldValue(FilterFieldName.district);
  const currentWard = getLocalFieldValue(FilterFieldName.ward);

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
