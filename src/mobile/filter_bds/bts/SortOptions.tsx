import { FilterFieldName, OptionForSelect } from '@models';
import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { SORT_OPTIONS } from '@common/constants';
export default function SortOptions({
  onSelect,
}: {
  onSelect?: (option: OptionForSelect) => void;
}) {
  const { getLocalFieldValue, setLocalFieldValue } =
    useFilterState();
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
