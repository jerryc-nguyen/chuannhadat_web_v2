import { FilterFieldName, OptionForSelect } from '@common/models';

import useFilterState from '../hooks/useFilterState';
import ListChips from '@components/mobile-ui/ListChips';

export default function Bath({ onSelect }: { onSelect?: (option: OptionForSelect) => void }) {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Bath);

  const onSelectOption = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.Bath, item);
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
