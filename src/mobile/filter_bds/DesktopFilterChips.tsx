import React, { useState } from 'react';
import { filterStateAtom } from './states';
import { useAtom } from 'jotai';
import { FilterFieldName } from '@models';
import Price from './bts/Price';
import Area from './bts/Area';
import FooterBtsButton from './FooterBtsButton';
import Locations from './bts/Locations';

import { useFilterLocations } from '@mobile/locations/hooks';
import FilterModal from './FilterModal';
import FooterOverviewBtsButton from './FooterOverviewBtsButton';
import BusinessTypeButtons from './bts/BusinessTypeButtons';
import CategoryType from './bts/CategoryType';
import Rooms from './bts/Rooms';

import Direction from './bts/Direction';
import useFilterState from './hooks/useFilterState';

import * as Popover from '@radix-ui/react-popover';

export interface FilterChipOption {
  id: string | FilterFieldName;
  text: string;
}

const FILTER_ITEMS: Array<FilterChipOption> = [
  // {
  //   id: FilterFieldName.filterOverview,
  //   text: 'Bộ Lọc',
  // },
  {
    id: FilterFieldName.businessType,
    text: 'Loại tin',
  },
  {
    id: FilterFieldName.categoryType,
    text: 'Loại nhà đất',
  },
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
    id: FilterFieldName.direction,
    text: 'Hướng',
  },
];

export default function DesktopFilterChips() {
  const [selectedChipOption, setSelectedChipOption] = useState<FilterChipOption>();
  const [filterState] = useAtom(filterStateAtom);
  const { copyFilterStatesToLocal } = useFilterState();

  const { selectedLocationText, isSelectedLocation } = useFilterLocations();

  const selectedRoomText = (): string => {
    const results = [];
    if (filterState.bed) {
      results.push(`${filterState.bed.text} PN`);
    }
    if (filterState.bath) {
      results.push(`${filterState.bath.text} WC`);
    }

    return results.join(' / ');
  };

  const selectedFilterText = (filterOption: FilterChipOption) => {
    const fieldName = FilterFieldName[filterOption.id as A] || filterOption.id;

    if (filterOption.id == FilterFieldName.locations) {
      return selectedLocationText ?? 'Khu vực';
    } else if (filterOption.id == FilterFieldName.rooms) {
      return selectedRoomText() || 'Số phòng';
    } else {
      return (
        //@ts-ignore: read value
        filterState[fieldName]?.text ?? filterOption.text
      );
    }
  };

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
      case FilterFieldName.direction:
        return <Direction />;
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

  const showFilterPopover = (filterOption: FilterChipOption) => {
    if (filterOption.id == FilterFieldName.filterOverview) {
      copyFilterStatesToLocal();
    } else {
      copyFilterStatesToLocal([filterOption.id as FilterFieldName]);
    }
    setSelectedChipOption(filterOption);
  };

  const isActiveChip = (filterOption: FilterChipOption): boolean => {
    const fieldName = FilterFieldName[filterOption.id as A] || filterOption.id;

    if (filterOption.id == FilterFieldName.locations) {
      return isSelectedLocation;
    } else if (filterOption.id == FilterFieldName.rooms) {
      return !!(filterState.bed || filterState.bath);
    } else {
      return (
        //@ts-ignore: read value
        !!filterState[fieldName]?.text
      );
    }
  };

  const activeChipClass = (filterOption: FilterChipOption): string => {
    return isActiveChip(filterOption) ? 'bg-black text-white' : 'bg-white text-black';
  };

  return (
    <>
      <div className="relative">
        {FILTER_ITEMS.map((item, itemIndex) => (
          <Popover.Root
            key={item.id}
            open={item?.id == selectedChipOption?.id}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setSelectedChipOption(undefined);
              }
            }}
          >
            <Popover.Trigger asChild>
              <button
                key={item.id}
                className={`shadow-2 ${activeChipClass(item)} relative mr-2 cursor-pointer rounded-full px-4 py-3 font-bold`}
                onClick={() => {
                  showFilterPopover(item);
                }}
              >
                {selectedFilterText(item)}
              </button>
            </Popover.Trigger>

            <Popover.Content className="w-[300px] bg-white p-0" align={'start'}>
              {buildContent(item)}
              {buildBtsFooter(item)}
            </Popover.Content>
          </Popover.Root>
        ))}
      </div>
    </>
  );
}
