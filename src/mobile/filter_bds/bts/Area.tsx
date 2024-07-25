import { useAtom } from 'jotai';

import {
  FilterOption,
  FilterFieldName,
} from '@mobile/filter_bds/types';

import ListCheckOptions from './ListCheckOptions';
import { filterStateAtom } from '@mobile/filter_bds/states';
import useFilterState from '../hooks/useFilterState';

export default function Area() {
  const [filterState] = useAtom(filterStateAtom);
  const { getFieldValue, setLocalFieldValue } = useFilterState();
  const value = getFieldValue(FilterFieldName.area);

  return (
    <>
      <ListCheckOptions
        options={filterState.areaOptions!}
        selectedOption={value}
        onSelect={(option: FilterOption) => {
          setLocalFieldValue(FilterFieldName.area, option);
        }}
      ></ListCheckOptions>
    </>
  );
}
