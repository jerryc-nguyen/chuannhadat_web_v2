import { FilterFieldName } from '@mobile/filter_bds/types';

import ListChips from '@mobile/ui/ListChips';
import { Block, BlockTitle } from 'konsta/react';
import { BasicOption } from '@app/types';
import useFilterState from '../hooks/useFilterState';
import { ROOMS } from './Rooms';

export default function Bath({ onSelect }: { onSelect?: Function }) {
  const { getFieldValue, setLocalFieldValue } = useFilterState();
  const value = getFieldValue(FilterFieldName.bath);

  const onSelectOption = (item: BasicOption) => {
    setLocalFieldValue(FilterFieldName.bath, item);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <>
      <Block>
        <ListChips
          options={ROOMS}
          onSelect={onSelectOption}
          value={value}
        />
      </Block>
    </>
  );
}
