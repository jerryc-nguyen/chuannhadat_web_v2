import { useMemo } from 'react';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { useAtom } from 'jotai';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { FilterFieldName } from '@models';

export function useFilterLocations() {
  const [filterState] = useAtom(filterStateAtom);
  const { getLocalFieldValue } = useFilterState();

  const selectedLocationText = useMemo(():
    | string
    | undefined => {
    return (
      filterState?.ward?.text ??
      filterState?.district?.text ??
      filterState?.city?.text
    );
  }, [
    filterState?.city,
    filterState?.district,
    filterState?.ward,
  ]);

  const currentCity = getLocalFieldValue(
    FilterFieldName.city,
  );
  const currentDistrict = getLocalFieldValue(
    FilterFieldName.district,
  );
  const currentWard = getLocalFieldValue(
    FilterFieldName.ward,
  );

  return {
    selectedLocationText: selectedLocationText,
    currentCity: currentCity,
    currentDistrict: currentDistrict,
    currentWard: currentWard,
  };
}
