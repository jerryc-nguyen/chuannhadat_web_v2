import { useAtom } from 'jotai';
import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import { filterStateAtom } from '@mobile/filter_bds/states';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@app/types';

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
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.categoryType, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
