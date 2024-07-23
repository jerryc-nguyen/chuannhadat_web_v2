import cities from 'src/configs/locations/cities.json';
import citiesDistricts from 'src/configs/locations/cities_districts.json';

import { BasicOption } from '@app/types';
import { FilterOption } from '@mobile/filter_bds/types';
import { useEffect, useMemo } from 'react';
import {
  filterStateAtom,
  localFilterStateAtom,
} from '@mobile/filter_bds/states';
import { useAtom } from 'jotai';

export function useFilterLocations() {
  const [filterState] = useAtom(filterStateAtom);
  const [localFilterState] = useAtom(localFilterStateAtom);

  const selectedLocationText = useMemo((): string | undefined => {
    return (
      filterState.ward?.text ??
      filterState.district?.text ??
      filterState.city?.text
    );
  }, [filterState.city, filterState.district, filterState.ward]);

  const currentCity = localFilterState.city ?? filterState.city;
  const currentDistrict =
    localFilterState.district ?? filterState.district;
  const currentWard = localFilterState.ward ?? filterState.ward;

  return {
    selectedLocationText: selectedLocationText,
    currentCity: currentCity,
    currentDistrict: currentDistrict,
    currentWard: currentWard,
  };
}
