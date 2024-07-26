import { useAtom } from 'jotai';

import { FilterOption } from '@mobile/filter_bds/types';

import ListCheckOptions from './ListCheckOptions';
import { filterStateAtom } from '@mobile/filter_bds/states';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName } from '@app/types';

export default function CategoryType({
  onSelect,
}: {
  onSelect?: Function;
}) {
  const [filterState] = useAtom(filterStateAtom);
  const { getFieldValue, setLocalFieldValue } = useFilterState();
  const value = getFieldValue(FilterFieldName.categoryType);

  return (
    <>
      <ListCheckOptions
        options={filterState.categoryTypeOptions!}
        selectedOption={value}
        onSelect={(option: FilterOption) => {
          setLocalFieldValue(FilterFieldName.categoryType, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
