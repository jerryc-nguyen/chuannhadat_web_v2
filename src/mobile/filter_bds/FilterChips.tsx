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
import BusinessTypeButtons from './BusinessTypeButtons';
import CategoryType from './bts/CategoryType';
import Rooms from './bts/Rooms';

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
    id: FilterFieldName.businessType,
    text: 'Loại tin',
  },
  { id: FilterFieldName.categoryType, text: 'Loại nhà đất' },
  { id: FilterFieldName.locations, text: 'Khu vực' },
  {
    id: FilterFieldName.price,
    text: 'Mức giá',
  },
  {
    id: FilterFieldName.area,
    text: 'Diện tích',
  },
  {
    id: FilterFieldName.rooms,
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
      case FilterFieldName.businessType:
        return <BusinessTypeButtons />;
      case FilterFieldName.categoryType:
        return <CategoryType />;
      case FilterFieldName.price:
        return <Price />;
      case FilterFieldName.area:
        return <Area />;
      case FilterFieldName.filterOverview:
        return <FilterModal />;
      case FilterFieldName.locations:
        return <Locations />;
      case FilterFieldName.rooms:
        return <Rooms />;
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
