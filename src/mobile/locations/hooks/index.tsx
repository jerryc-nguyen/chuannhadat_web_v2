import { useMemo } from 'react';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { useAtom } from 'jotai';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { FilterFieldName } from '@app/types';

export function useFilterLocations() {
  const [filterState] = useAtom(filterStateAtom);
  const { getFieldValue } = useFilterState();

  const selectedLocationText = useMemo((): string | undefined => {
    return (
      filterState.ward?.text ??
      filterState.district?.text ??
      filterState.city?.text
    );
  }, [filterState.city, filterState.district, filterState.ward]);

  const currentCity = getFieldValue(FilterFieldName.city);
  const currentDistrict = getFieldValue(FilterFieldName.district);
  const currentWard = getFieldValue(FilterFieldName.ward);

  return {
    selectedLocationText: selectedLocationText,
    currentCity: currentCity,
    currentDistrict: currentDistrict,
    currentWard: currentWard,
  };
}
