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

export default function Area() {
  const [isOpen, setIsOpen] = useAtom(openBottomSheetFilterAtom);
  const [filterState] = useAtom(filterStateAtom);
  const [selectedOption, setSelectedOption] = useState<FilterOption>(
    defaultFilterOption
  );
  const [, applySelectedField] = useAtom(applyFieldBtsFilterAtom);
  const [, clearSelectedField] = useAtom(clearFieldBtsFilterAtom);

  return (
    <>
      <ListOptions
        options={filterState.areaOptions}
        onSelect={(option: FilterOption) => {
          setSelectedOption(option);
        }}
      ></ListOptions>
    </>
  );
}
