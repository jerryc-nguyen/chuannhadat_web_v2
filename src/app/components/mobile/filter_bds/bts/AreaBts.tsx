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
  applyFieldBtsFilterAtom,
  clearFieldBtsFilterAtom,
  defaultFilterOption,
} from '@mbcom/filter_bds/states';
import BottomActions from './BottomActions';

export default function AreaBts() {
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
          <strong>Diện tích</strong>
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
            label='Diện tích từ'
            type='number'
            placeholder='Diện tích thấp nhất'
            value={selectedOption.params?.min_area || ''}
            colors={{
              outlineBorderIos:
                'border-black border-opacity-30 dark:border-white dark:border-opacity-30',
            }}
            onChange={(e) => {
              const newOption = { ...selectedOption };
              newOption.params.min_area = e.target.value;
              setSelectedOption(newOption);
            }}
          />
          <div className='h-px'></div>

          <ListInput
            outline
            label='Diện tích đến'
            type='number'
            value={selectedOption.params?.max_area || ''}
            placeholder='Diện tích cao nhất'
            onChange={(e) => {
              const newOption = { ...selectedOption };
              newOption.params.max_area = e.target.value;
              setSelectedOption(newOption);
            }}
          />
        </List>

        <BlockTitle>Khoảng diện tích phổ biến</BlockTitle>

        <ListOptions
          options={filterState.areaOptions}
          onSelect={(option: FilterOption) => {
            setSelectedOption(option);
          }}
        ></ListOptions>
      </div>

      <BottomActions
        fieldName={FilterFieldName.area}
        selectedOption={selectedOption}
      />
    </Sheet>
  );
}
