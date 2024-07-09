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
} from '@mbcom/filter_bds/types';

import ListOptions from './ListOptions';
import {
  openBottomSheetFilterAtom,
  filterStateAtom,
  defaultFilterOption,
  applyFieldBtsFilterAtom,
  clearFieldBtsFilterAtom,
} from '@mbcom/filter_bds/states';
import cloneDeep from 'lodash.clonedeep';
import BottomActions from './BottomActions';

export default function PriceBts() {
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
          <strong>Giá BĐS</strong>
        </div>
        <div className='right'>
          <Link toolbar onClick={() => setIsOpen(false)}>
            Đóng
          </Link>
        </div>
      </Toolbar>

      <div className='c-bottomSheetFilter__body'>
        <List strongIos>
          <ListInput
            outline
            label='Giá từ'
            type='number'
            placeholder='Giá thấp nhất'
            value={selectedOption.params?.min_price || ''}
            colors={{
              outlineBorderIos:
                'border-black border-opacity-30 dark:border-white dark:border-opacity-30',
            }}
            onChange={(e) => {
              const newOption = cloneDeep(selectedOption);
              newOption.params.min_price = e.target.value;
              setSelectedOption(newOption);
            }}
          />
          <div className='h-px'></div>

          <ListInput
            outline
            label='Giá đến'
            type='number'
            value={selectedOption.params?.max_price || ''}
            placeholder='Giá cao nhất'
            onChange={(e) => {
              const newOption = cloneDeep(selectedOption);
              newOption.params.max_price = e.target.value;
              setSelectedOption(newOption);
            }}
          />
        </List>

        <BlockTitle>Khoảng giá phổ biến</BlockTitle>

        <ListOptions
          options={filterState.priceOptions}
          onSelect={(option: FilterOption) => {
            setSelectedOption(cloneDeep(option));
          }}
        ></ListOptions>
      </div>

      <BottomActions
        fieldName={FilterFieldName.price}
        selectedOption={selectedOption}
      />
    </Sheet>
  );
}
