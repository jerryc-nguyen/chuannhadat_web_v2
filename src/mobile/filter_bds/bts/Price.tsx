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

export default function Price() {
  const [filterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const [selectedOption, setSelectedOption] = useState<FilterOption>(
    defaultFilterOption
  );

  return (
    <>
      <ListCheckOptions
        options={filterState.priceOptions!}
        selectedOption={localFilterState.price}
        onSelect={(option: FilterOption) => {
          setLocalFilterState({ ...localFilterState, price: option });
        }}
      ></ListCheckOptions>
    </>
  );
}
