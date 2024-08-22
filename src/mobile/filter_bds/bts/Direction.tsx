import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@models';

export default function Direction({
  onSelect,
}: {
  onSelect?: (option: OptionForSelect) => void;
}) {
  const {
    getLocalFieldValue,
    setLocalFieldValue,
    filterFieldOptions,
  } = useFilterState();
  const value = getLocalFieldValue(
    FilterFieldName.direction,
  );

  return (
    <>
      <ListCheckOptions
        options={filterFieldOptions.directionOptions!}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(
            FilterFieldName.direction,
            option,
          );
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
