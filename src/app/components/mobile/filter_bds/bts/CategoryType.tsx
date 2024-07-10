import { useState } from 'react';
import { useAtom } from 'jotai';

import {
  FilterOption,
  FilterFieldName,
} from '@mbcom/filter_bds/types';

import ListCheckOptions from './ListCheckOptions';
import {
  filterStateAtom,
  defaultFilterOption,
} from '@mbcom/filter_bds/states';

export default function Area() {
  const [filterState] = useAtom(filterStateAtom);
  const [selectedOption, setSelectedOption] = useState<FilterOption>(
    defaultFilterOption
  );

  return (
    <>
      <ListCheckOptions
        options={filterState.categoryTypeOptions!}
        onSelect={(option: FilterOption) => {
          setSelectedOption(option);
        }}
      ></ListCheckOptions>
    </>
  );
}
