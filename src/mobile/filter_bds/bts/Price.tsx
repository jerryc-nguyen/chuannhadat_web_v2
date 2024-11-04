import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@models';
import useSearchAggs from '@components/search-aggs/hooks';

export default function Price({ onSelect }: { onSelect?: (option: OptionForSelect) => void }) {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Price);
  const { priceOptions, isUseAggOptions } = useSearchAggs();
  const options = isUseAggOptions ? priceOptions : filterFieldOptions.priceOptions

  return (
    <>
      <ListCheckOptions
        options={options}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.Price, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
