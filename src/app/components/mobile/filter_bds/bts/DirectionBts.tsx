import { useState } from 'react';
import { useAtom } from 'jotai';

import { Sheet, Button, Toolbar, Link } from 'konsta/react';

import {
  FilterOption,
  FilterFieldName,
} from '@mbcom/filter_bds/types';

import ListOptions from './ListOptions';
import {
  openBottomSheetFilterAtom,
  filterStateAtom,
  defaultFilterOption,
} from '@mbcom/filter_bds/states';
import BottomActions from './BottomActions';

export default function BedBts() {
  const [isOpen, setIsOpen] = useAtom(openBottomSheetFilterAtom);
  const [filterState] = useAtom(filterStateAtom);
  const [selectedOption, setSelectedOption] = useState<FilterOption>(
    defaultFilterOption
  );

  return (
    <Sheet
      className='c-bottomSheetFilter pb-safe w-full'
      opened={isOpen}
      onBackdropClick={() => setIsOpen(false)}
    >
      <Toolbar top>
        <div className='left'>
          <strong>Hướng</strong>
        </div>
        <div className='right'>
          <Link toolbar onClick={() => setIsOpen(false)}>
            Đóng
          </Link>
        </div>
      </Toolbar>

      <div className='c-bottomSheetFilter__body'>
        <ListOptions
          options={filterState.directionOptions}
          onSelect={(option: FilterOption) => {
            setSelectedOption(option);
          }}
        ></ListOptions>
      </div>

      <BottomActions
        fieldName={FilterFieldName.direction}
        selectedOption={selectedOption}
      />
    </Sheet>
  );
}
