import { FilterFieldName, OptionForSelect } from '@models';

import ListChips from '@mobile/ui/ListChips';
import { Block } from 'konsta/react';
import useFilterState from '../hooks/useFilterState';

export default function Bed({
  onSelect,
}: {
  onSelect?: (option: OptionForSelect) => void;
}) {
  const {
    getLocalFieldValue,
    setLocalFieldValue,
    filterFieldOptions,
  } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.bed);

  const onSelectOption = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.bed, item);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <>
      <Block>
        <ListChips
          options={filterFieldOptions.roomOptions || []}
          onSelect={onSelectOption}
          value={value}
        />
      </Block>
    </>
  );
}
