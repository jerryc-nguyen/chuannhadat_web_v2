import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@common/models';
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';

export default function Direction({ onSelect }: { onSelect?: (option: OptionForSelect) => void }) {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Direction);
  const { directionsOptions, isUseAggOptions } = useSearchAggs();
  const options = isUseAggOptions ? directionsOptions : filterFieldOptions.directionOptions

  return (
    <>
      <ListCheckOptions
        options={options}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.Direction, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
