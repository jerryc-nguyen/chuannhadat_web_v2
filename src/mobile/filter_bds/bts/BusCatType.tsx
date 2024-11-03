import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@models';
import useSearchAggs from '@components/search-aggs/hooks';

export default function BusCatType({
  onSelect,
}: {
  onSelect?: (option: OptionForSelect) => void;
}) {
  const { getLocalFieldValue, localFilterState, setLocalFilterState } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.BusCatType);
  const { busCatTypeOptions } = useSearchAggs();

  return (
    <>
      <ListCheckOptions
        options={busCatTypeOptions}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          const newStates = {
            ...localFilterState,
            busCatType: option,
            city: undefined,
            district: undefined,
            ward: undefined
          }

          setLocalFilterState({ ...newStates });
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
