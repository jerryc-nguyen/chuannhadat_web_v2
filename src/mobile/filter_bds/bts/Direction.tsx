import { useAtom } from 'jotai';

import { FilterOption } from '@mobile/filter_bds/types';

import ListCheckOptions from './ListCheckOptions';
import { filterStateAtom } from '@mobile/filter_bds/states';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName } from '@app/types';

export default function Direction({
  onSelect,
}: {
  onSelect?: Function;
}) {
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
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
