import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { SORT_OPTIONS } from '@commons/constants/searchs';
import { OptionForSelect } from '@commons/interfaces';
import { FilterFieldName } from '@commons/interfaces/searchs';

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
