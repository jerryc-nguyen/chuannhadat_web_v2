import { useAtom } from 'jotai';
import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import { filterStateAtom } from '@mobile/filter_bds/states';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@app/types';

export default function Direction({
  onSelect,
}: {
  onSelect?: Function;
}) {
  const [filterState] = useAtom(filterStateAtom);
  const { getLocalFieldValue, setLocalFieldValue } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.direction);

  return (
    <>
      <ListCheckOptions
        options={filterState.directionOptions!}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.direction, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
