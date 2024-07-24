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
];

export default function Rooms() {
  const [filterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );
  const onSelectBed = (item: BasicOption) => {
    setLocalFilterState({ ...localFilterState, bed: item });
  };

  const onSelectBath = (item: BasicOption) => {
    setLocalFilterState({ ...localFilterState, bath: item });
  };

  return (
    <>
      <BlockTitle>Phòng ngủ</BlockTitle>
      <Block>
        <div className='hidden-scrollbar'>
          <ListChips
            options={ROOMS}
            onSelect={onSelectBed}
            value={localFilterState.bed ?? filterState.bed}
          />
        </div>
      </Block>

      <BlockTitle>Nhà tắm</BlockTitle>
      <Block>
        <div className='hidden-scrollbar'>
          <ListChips
            options={ROOMS}
            onSelect={onSelectBath}
            value={localFilterState.bath ?? filterState.bath}
          />
        </div>
      </Block>
    </>
  );
}
