import { useAtom } from 'jotai';

import {
  FilterOption,
  FilterFieldName,
} from '@mobile/filter_bds/types';

import ListCheckOptions from './ListCheckOptions';
import { filterStateAtom } from '@mobile/filter_bds/states';
import useFilterState from '../hooks/useFilterState';

export default function Direction() {
  const [filterState] = useAtom(filterStateAtom);
  const { getFieldValue, setLocalFieldValue } = useFilterState();
  const value = getFieldValue(FilterFieldName.direction);

  return (
    <>
      <ListCheckOptions
        options={filterState.directionOptions!}
        selectedOption={value}
        onSelect={(option: FilterOption) => {
          setLocalFieldValue(FilterFieldName.direction, option);
        }}
      ></ListCheckOptions>
    </>
  );
}
