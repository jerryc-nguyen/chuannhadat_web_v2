import { useState } from 'react';
import { useAtom } from 'jotai';

import {
  FilterOption,
  FilterFieldName,
} from '@mobile/filter_bds/types';

import ListCheckOptions from './ListCheckOptions';
import {
  filterStateAtom,
  defaultFilterOption,
  localFilterStateAtom,
} from '@mobile/filter_bds/states';

export default function DistrictOptions() {
  const [filterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  return (
    <>
      <ListCheckOptions
        options={filterState.districtOptions!}
        selectedOption={localFilterState.district}
        onSelect={(option: FilterOption) => {
          setLocalFilterState({
            ...localFilterState,
            district: option,
          });
        }}
      ></ListCheckOptions>
    </>
  );
}
