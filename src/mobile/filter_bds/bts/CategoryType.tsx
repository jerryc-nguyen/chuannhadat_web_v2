import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@models';

export default function CategoryType({
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
    FilterFieldName.categoryType,
  );

  return (
    <>
      <ListCheckOptions
        options={filterFieldOptions.categoryTypeOptions!}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(
            FilterFieldName.categoryType,
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
