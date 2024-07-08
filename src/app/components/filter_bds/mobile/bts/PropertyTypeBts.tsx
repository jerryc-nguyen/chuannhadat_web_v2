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

export default function PropertyTypeBts() {
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
          <strong>Loại BĐS</strong>
        </div>
        <div className='right'>
          <Link toolbar onClick={() => setIsOpen(false)}>
            Đóng
          </Link>
        </div>
      </Toolbar>

      <div className='c-bottomSheetFilter__body'>
        <ListOptions
          options={filterState.propertyTypeOptions}
          onSelect={(option: FilterOption) => {
            setSelectedOption(option);
          }}
        ></ListOptions>
      </div>

      <BottomActions
        fieldName={FilterFieldName.propertyType}
        selectedOption={selectedOption}
      />
    </Sheet>
  );
}
