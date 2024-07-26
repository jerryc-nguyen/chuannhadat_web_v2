import { useAtom } from 'jotai';

import {
  FilterOption,
  FilterFieldName,
} from '@mobile/filter_bds/types';

import ListCheckOptions from './ListCheckOptions';
import { filterStateAtom } from '@mobile/filter_bds/states';
import useFilterState from '../hooks/useFilterState';

export default function Price({ onSelect }: { onSelect?: Function }) {
  const [filterState] = useAtom(filterStateAtom);
  const { getFieldValue, setLocalFieldValue } = useFilterState();
  const value = getFieldValue(FilterFieldName.price);

  return (
    <>
      <ListCheckOptions
        options={filterState.priceOptions!}
        selectedOption={value}
        onSelect={(option: FilterOption) => {
          setLocalFieldValue(FilterFieldName.price, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
