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

export default function CategoryType() {
  const [filterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  return (
    <>
      <ListCheckOptions
        options={filterState.categoryTypeOptions!}
        selectedOption={localFilterState.categoryType}
        onSelect={(option: FilterOption) => {
          setLocalFilterState({
            ...localFilterState,
            categoryType: option,
          });
        }}
      ></ListCheckOptions>
    </>
  );
}
