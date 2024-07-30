import { FilterFieldName, OptionForSelect } from '@app/types';

import ListChips from '@mobile/ui/ListChips';
import { Block } from 'konsta/react';
import useFilterState from '../hooks/useFilterState';

export default function Bed({ onSelect }: { onSelect?: Function }) {
  const { getLocalFieldValue, setLocalFieldValue, filterState } =
    useFilterState();
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
          options={filterState.roomOptions || []}
          onSelect={onSelectOption}
          value={value}
        />
      </Block>
    </>
  );
}
