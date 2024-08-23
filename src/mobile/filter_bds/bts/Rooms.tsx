import ListChips from '@mobile/ui/ListChips';
import { Block, BlockTitle } from 'konsta/react';
import { OptionForSelect, FilterFieldName } from '@models';
import useFilterState from '../hooks/useFilterState';

export default function Rooms() {
  const {
    getLocalFieldValue,
    setLocalFieldValue,
    filterFieldOptions,
  } = useFilterState();
  const curBed = getLocalFieldValue(FilterFieldName.bed);
  const curBath = getLocalFieldValue(FilterFieldName.bath);

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
          options={filterFieldOptions.roomOptions || []}
          onSelect={onSelectBed}
          value={curBed}
        />
      </Block>

      <BlockTitle>Nhà tắm</BlockTitle>
      <Block>
        <ListChips
          options={filterFieldOptions.roomOptions || []}
          onSelect={onSelectBath}
          value={curBath}
        />
      </Block>
    </>
  );
}
