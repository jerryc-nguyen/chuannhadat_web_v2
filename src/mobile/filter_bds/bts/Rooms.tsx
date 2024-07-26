import { FilterFieldName } from '@app/types';
import ListChips from '@mobile/ui/ListChips';
import { Block, BlockTitle } from 'konsta/react';
import { OptionForSelect } from '@app/types';
import useFilterState from '../hooks/useFilterState';

export default function Rooms() {
  const { getFieldValue, setLocalFieldValue, filterState } =
    useFilterState();
  const curBed = getFieldValue(FilterFieldName.bed);
  const curBath = getFieldValue(FilterFieldName.bath);

  const onSelectBed = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.bed, item);
  };

  const onSelectBath = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.bath, item);
  };

  return (
    <>
      <BlockTitle>Phòng ngủ</BlockTitle>
      <Block>
        <ListChips
          options={filterState.roomOptions || []}
          onSelect={onSelectBed}
          value={curBed}
        />
      </Block>

      <BlockTitle>Nhà tắm</BlockTitle>
      <Block>
        <ListChips
          options={filterState.roomOptions || []}
          onSelect={onSelectBath}
          value={curBath}
        />
      </Block>
    </>
  );
}
