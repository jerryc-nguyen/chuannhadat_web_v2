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

export default function Area() {
  const [filterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  return (
    <>
      <ListCheckOptions
        options={filterState.areaOptions!}
        selectedOption={localFilterState.area}
        onSelect={(option: FilterOption) => {
          setLocalFilterState({ ...localFilterState, area: option });
        }}
      ></ListCheckOptions>
    </>
  );
}
