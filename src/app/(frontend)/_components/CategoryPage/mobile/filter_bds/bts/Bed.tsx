import { FilterFieldName, OptionForSelect } from '@common/types';

import ListChips from '@components/mobile-ui/ListChips';
import useFilterState from '../hooks/useFilterState';

export default function Bed({ onSelect }: { onSelect?: (option: OptionForSelect) => void }) {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Bed);

  const onSelectOption = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.Bed, item);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <>
      <ListChips
        options={filterFieldOptions.roomOptions || []}
        onSelect={onSelectOption}
        value={value}
      />
    </>
  );
}
