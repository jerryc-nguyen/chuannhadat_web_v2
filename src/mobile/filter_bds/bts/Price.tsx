import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { OptionForSelect } from '@commons/interfaces';
import { FilterFieldName } from '@commons/interfaces/searchs';

export default function Price({ onSelect }: { onSelect?: Function }) {
  const {
    getLocalFieldValue,
    setLocalFieldValue,
    filterFieldOptions,
  } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.price);

  return (
    <>
      <ListCheckOptions
        options={filterFieldOptions.priceOptions!}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.price, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
