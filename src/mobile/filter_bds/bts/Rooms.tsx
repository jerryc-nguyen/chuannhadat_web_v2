import { FilterFieldName } from '@mobile/filter_bds/types';

import ListChips from '@mobile/ui/ListChips';
import { Block, BlockTitle } from 'konsta/react';
import { BasicOption } from '@app/types';
import useFilterState from '../hooks/useFilterState';
import { ROOMS } from '@app/constants';

export default function Rooms() {
  const { getFieldValue, setLocalFieldValue } = useFilterState();
  const curBed = getFieldValue(FilterFieldName.bed);
  const curBath = getFieldValue(FilterFieldName.bath);

  const onSelectBed = (item: BasicOption) => {
    setLocalFieldValue(FilterFieldName.bed, item);
  };

  const onSelectBath = (item: BasicOption) => {
    setLocalFieldValue(FilterFieldName.bath, item);
  };

  return (
    <>
      <BlockTitle>Phòng ngủ</BlockTitle>
      <Block>
        <ListChips
          options={ROOMS}
          onSelect={onSelectBed}
          value={curBed}
        />
      </Block>

      <BlockTitle>Nhà tắm</BlockTitle>
      <Block>
        <ListChips
          options={ROOMS}
          onSelect={onSelectBath}
          value={curBath}
        />
      </Block>
    </>
  );
}
