import { Block, Button, Chip } from 'konsta/react';
import React, { useState } from 'react';
import { filterStateAtom, localFilterStateAtom } from './states';
import { useAtom } from 'jotai';
import { FilterOption } from './types';
import Price from './bts/Price';
import Area from './bts/Area';
import FooterBtsButton from './FooterBtsButton';
import Locations from './bts/Locations';
import { innerBtsLocationAtom } from '@mobile/modals/states/inner_view';
import useModals from '@mobile/modals/hooks';

export interface FilterChipOption {
  id: string;
  text: string;
}

const FILTER_ITEMS: Array<FilterChipOption> = [
  {
    id: 'filterOverview',
    text: 'Bộ Lọc',
  },
  {
    id: 'businessType',
    text: 'Loại tin',
  },
  { id: 'categoryType', text: 'Loại nhà đất' },
  { id: 'locations', text: 'Khu vực' },
  {
    id: 'price',
    text: 'Mức giá',
  },
  {
    id: 'area',
    text: 'Diện tích',
  },
  {
    id: 'room',
    text: 'Số Phòng',
  },
  {
    id: 'direction',
    text: 'Hướng',
  },
];

export default function FilterChips() {
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );
  const { openModal } = useModals();

  const selectedFilterText = (filterOption: FilterChipOption) => {
    // @ts-ignore
    return filterState[filterOption.id]?.text ?? filterOption.text;
  };
  const [, setInnerBtsLocation] = useAtom(innerBtsLocationAtom);

  const buildContent = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case 'price':
        return <Price />;
      case 'area':
        return <Area />;
      case 'locations':
        return <Locations />;
      default:
        return undefined;
    }
  };

  const showFilterBts = (filterOption: FilterChipOption) => {
    openModal({
      name: filterOption.id,
      title: filterOption.text,
      content: buildContent(filterOption),
      footer: <FooterBtsButton filterOption={filterOption} />,
      onClosed: () => {
        setInnerBtsLocation(undefined);
      },
    });
  };

  return (
    <Block strongIos outlineIos>
      {FILTER_ITEMS.map((item) => (
        <Chip
          key={item.id}
          className='m-0.5'
          onClick={() => {
            showFilterBts(item);
          }}
        >
          {selectedFilterText(item)}
        </Chip>
      ))}
    </Block>
  );
}
