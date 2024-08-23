import { FilterFieldName, OptionForSelect } from '@models';

import useFilterState from '../hooks/useFilterState';
import ListChips from '@mobile/ui/ListChips';
import { Block } from 'konsta/react';

export default function Bath({
  onSelect,
}: {
  onSelect?: (option: OptionForSelect) => void;
}) {
  const {
    getLocalFieldValue,
    setLocalFieldValue,
    filterFieldOptions,
  } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.bath);

  const onSelectOption = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.bath, item);
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
