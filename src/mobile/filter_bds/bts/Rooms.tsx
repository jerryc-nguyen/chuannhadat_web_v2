import { useState } from 'react';
import { useAtom } from 'jotai';

import {
  FilterOption,
  FilterFieldName,
} from '@mobile/filter_bds/types';

import ListCheckOptions from './ListCheckOptions';
import {
  filterStateAtom,
  localFilterStateAtom,
} from '@mobile/filter_bds/states';
import ListChips from '@mobile/ui/ListChips';
import { Block, BlockTitle } from 'konsta/react';
import { BasicOption } from '@app/types';
import useFilterState from '../hooks/useFilterState';

export const ROOMS = [
  {
    id: 1,
    text: '1',
  },
  {
    id: 2,
    text: '2',
  },
  {
    id: 3,
    text: '3',
  },
  {
    id: 4,
    text: '4',
  },
  {
    id: 5,
    text: '5',
  },
  {
    id: 6,
    text: '6',
  },
  {
    id: 7,
    text: '7',
  },
  {
    id: 8,
    text: '8',
  },
];

export default function Rooms() {
  const [filterState] = useAtom(filterStateAtom);
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
