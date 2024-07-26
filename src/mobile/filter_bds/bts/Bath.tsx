import { FilterFieldName, OptionForSelect } from '@app/types';

import ListChips from '@mobile/ui/ListChips';
import { Block, BlockTitle } from 'konsta/react';

import useFilterState from '../hooks/useFilterState';

export default function Bath({ onSelect }: { onSelect?: Function }) {
  const { getFieldValue, setLocalFieldValue, filterState } =
    useFilterState();
  const value = getFieldValue(FilterFieldName.bath);

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
          options={filterState.roomOptions || []}
          onSelect={onSelectOption}
          value={value}
        />
      </Block>
    </>
  );
}
