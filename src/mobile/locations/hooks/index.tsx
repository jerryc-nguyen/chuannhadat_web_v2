import cities from 'src/configs/locations/cities.json';
import citiesDistricts from 'src/configs/locations/cities_districts.json';

import { BasicOption } from '@app/types';
import { FilterOption } from '@mobile/filter_bds/types';
import { useEffect } from 'react';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { useAtom } from 'jotai';

export default function useLocations() {
  const [filterState, setFilterState] = useAtom(filterStateAtom);

  const buildLocationOptions = (
    type: string,
    options: Array<BasicOption>
  ): Array<FilterOption> => {
    return options.map((item) => {
      return {
        text: item.text,
        params: {
          [type]: item.id,
        },
      };
    });
  };

  useEffect(() => {
    const cityOptions = cities.map((item: any) => {
      return {
        text: item.text,
        params: {
          city_id: item.id,
        },
      };
    });
    filterState.cityOptions = cityOptions;

    setFilterState(filterState);
  }, [filterState, setFilterState]);

  return {
    buildLocationOptions: buildLocationOptions,
  };
}
