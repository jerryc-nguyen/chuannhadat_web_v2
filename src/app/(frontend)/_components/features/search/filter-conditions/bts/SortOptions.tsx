import { FilterFieldName, OptionForSelect } from '@common/types';
import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { SORT_OPTIONS } from '@common/constants';
export default function SortOptions({
  onSelect,
}: {
  onSelect?: (option: OptionForSelect) => void;
}) {
  const { getLocalFieldValue, setLocalFieldValue } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Sort);

  return (
    <>
      <ListCheckOptions
        options={SORT_OPTIONS}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.Sort, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
