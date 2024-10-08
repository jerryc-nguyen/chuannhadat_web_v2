import { FilterFieldName, OptionForSelect } from '@models';
import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';

export default function Area({ onSelect }: { onSelect?: (option: OptionForSelect) => void }) {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Area);

  return (
    <>
      <ListCheckOptions
        options={filterFieldOptions?.areaOptions}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.Area, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
