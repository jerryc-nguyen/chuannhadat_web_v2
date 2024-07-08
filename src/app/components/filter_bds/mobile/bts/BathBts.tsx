import { useState } from 'react';
import { useAtom } from 'jotai';

import {
  Sheet,
  Button,
  Toolbar,
  Link,
  List,
  ListInput,
  BlockTitle,
} from 'konsta/react';

import {
  FilterOption,
  FilterFieldName,
} from '@app/components/filter_bds/types';

import ListOptions from './ListOptions';
import {
  openBottomSheetFilterAtom,
  filterStateAtom,
  defaultFilterOption,
  applyFieldBtsFilterAtom,
  clearFieldBtsFilterAtom,
} from '@app/components/filter_bds/states';
import BottomActions from './BottomActions';

export default function BedBts() {
  const [isOpen, setIsOpen] = useAtom(openBottomSheetFilterAtom);
  const [filterState] = useAtom(filterStateAtom);
  const [selectedOption, setSelectedOption] = useState<FilterOption>(
    defaultFilterOption
  );
  const [, applySelectedField] = useAtom(applyFieldBtsFilterAtom);
  const [, clearSelectedField] = useAtom(clearFieldBtsFilterAtom);

  return (
    <Sheet
      className='c-bottomSheetFilter pb-safe w-full'
      opened={isOpen}
      onBackdropClick={() => setIsOpen(false)}
    >
      <Toolbar top>
        <div className='left'>
          <strong>Phòng tắm</strong>
        </div>
        <div className='right'>
          <Link toolbar onClick={() => setIsOpen(false)}>
            Đóng
          </Link>
        </div>
      </Toolbar>

      <div className='c-bottomSheetFilter__body'>
        <ListOptions
          options={filterState.bathOptions}
          onSelect={(option: FilterOption) => {
            setSelectedOption(option);
          }}
        ></ListOptions>
      </div>

      <BottomActions
        fieldName={FilterFieldName.baths}
        selectedOption={selectedOption}
      />
    </Sheet>
  );
}
