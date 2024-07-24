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
import ListChips from './ListChips';

export default function Rooms() {
  const [filterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  return (
    <>
      <strong>Rooms</strong>
      <div className='hidden-scrollbar'>
        <ListChips />
      </div>
    </>
  );
}
