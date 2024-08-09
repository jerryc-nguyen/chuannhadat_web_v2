import { FilterFieldName, OptionForSelect } from '@app/types';
import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { SORT_OPTIONS } from '@app/constants';

export default function SortOptions({
  onSelect,
}: {
  onSelect?: Function;
}) {
  const { getLocalFieldValue, setLocalFieldValue } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.sort);

  return (
    <>
      <ListCheckOptions
        options={SORT_OPTIONS}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.sort, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
