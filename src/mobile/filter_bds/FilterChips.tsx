import { Block, Button, Chip } from 'konsta/react';
import React, { useState } from 'react';
import { filterStateAtom, localFilterStateAtom } from './states';
import { useAtom } from 'jotai';
import { FilterFieldName, FilterOption } from './types';
import Price from './bts/Price';
import Area from './bts/Area';
import FooterBtsButton from './FooterBtsButton';
import Locations from './bts/Locations';
import { innerBtsLocationAtom } from '@mobile/modals/states/inner_view';
import useModals from '@mobile/modals/hooks';
import { useFilterLocations } from '@mobile/locations/hooks';
import FilterModal from './FilterModal';
import FooterOverviewBtsButton from './FooterOverviewBtsButton';

export interface FilterChipOption {
  id: string | FilterFieldName;
  text: string;
}

const FILTER_ITEMS: Array<FilterChipOption> = [
  {
    id: FilterFieldName.filterOverview,
    text: 'Bộ Lọc',
  },
  {
    id: 'businessType',
    text: 'Loại tin',
  },
  { id: 'categoryType', text: 'Loại nhà đất' },
  { id: FilterFieldName.locations, text: 'Khu vực' },
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
  const { selectedLocationText } = useFilterLocations();
  const selectedFilterText = (filterOption: FilterChipOption) => {
    if (filterOption.id == FilterFieldName.locations) {
      return selectedLocationText ?? 'Khu vực';
    } else {
      //@ts-ignore
      return filterState[filterOption.id]?.text ?? filterOption.text;
    }
  };
  const [, setInnerBtsLocation] = useAtom(innerBtsLocationAtom);

  const buildContent = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case 'price':
        return <Price />;
      case 'area':
        return <Area />;
      case FilterFieldName.filterOverview:
        return <FilterModal />;
      case FilterFieldName.locations:
        return <Locations />;
      default:
        return undefined;
    }
  };

  const buildMaxHeightPercent = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case FilterFieldName.filterOverview:
        return 1;

      default:
        return undefined;
    }
  };

  const buildBtsFooter = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case FilterFieldName.filterOverview:
        return <FooterOverviewBtsButton />;
      default:
        return <FooterBtsButton filterOption={filterOption} />;
    }
  };

  const showFilterBts = (filterOption: FilterChipOption) => {
    openModal({
      name: filterOption.id,
      title: filterOption.text,
      content: buildContent(filterOption),
      footer: buildBtsFooter(filterOption),
      maxHeightPercent: buildMaxHeightPercent(filterOption),
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
