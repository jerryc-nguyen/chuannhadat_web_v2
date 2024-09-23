import React from 'react';
import { filterStateAtom } from './states';
import { useAtom } from 'jotai';
import { FilterFieldName } from '@models';
import Price from './bts/Price';
import Area from './bts/Area';
import FooterBtsButton from './FooterBtsButton';
import Locations from './bts/Locations';

import useModals from '@mobile/modals/hooks';
import { useFilterLocations } from '@mobile/locations/hooks';
import FilterModal from './FilterModal';
import FooterOverviewBtsButton from './FooterOverviewBtsButton';
import BusinessTypeButtons from './bts/BusinessTypeButtons';
import CategoryType from './bts/CategoryType';
import Rooms from './bts/Rooms';
import { DEFAULT_MODAL_HEIGHTS } from './FilterModal';
import Direction from './bts/Direction';
import useFilterState from './hooks/useFilterState';
import { cn } from '@common/utils';

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
  {
    id: FilterFieldName.categoryType,
    text: 'Loại nhà đất',
  },
  // { id: FilterFieldName.locations, text: 'Khu vực' },
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

export default function FilterChips() {
  const [filterState] = useAtom(filterStateAtom);
  const { copyFilterStatesToLocal } = useFilterState();

  const { openModal } = useModals();
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
        return (
          <div className="bg-white p-4">
            <BusinessTypeButtons />
          </div>
        );
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
    if (filterOption.id == FilterFieldName.filterOverview) {
      copyFilterStatesToLocal();
    } else {
      copyFilterStatesToLocal([filterOption.id as FilterFieldName]);
    }

    openModal({
      name: filterOption.id,
      title: filterOption.text,
      content: buildContent(filterOption),
      footer: buildBtsFooter(filterOption),
      maxHeightPercent: buildMaxHeightPercent(filterOption),
      defaultContentHeight:
        //@ts-ignore: read value
        DEFAULT_MODAL_HEIGHTS[filterOption.id],
    });
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
    return isActiveChip(filterOption)
      ? 'bg-black text-white hover:opacity-80'
      : 'bg-white text-black hover:bg-slate-100';
  };

  return (
    <div className="p-4">
      {FILTER_ITEMS.map((item) => (
        <button
          key={item.id}
          className={cn(
            'shadow-2 relative mb-2 mr-2 cursor-pointer rounded-xl px-4 py-2 font-medium transition-all duration-400 focus:animate-pulse',
            activeChipClass(item),
          )}
          onClick={() => {
            showFilterBts(item);
          }}
        >
          {selectedFilterText(item)}
        </button>
      ))}
    </div>
  );
}
