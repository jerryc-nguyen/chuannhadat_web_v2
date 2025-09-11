import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@common/models';
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';

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
