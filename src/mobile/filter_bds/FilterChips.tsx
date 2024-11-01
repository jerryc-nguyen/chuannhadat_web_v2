'use client';
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
import { listFilterMobile } from './constants';
import { FilterChipOption } from './types';
import { Button } from '@components/ui/button';
type FilterChipsProp = {
  isRedirectWhenApplyFilter?: boolean;
};
export default function FilterChips({ isRedirectWhenApplyFilter = true }: FilterChipsProp) {
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
    const fieldName = filterOption.id;

    if (filterOption.id == FilterFieldName.Locations) {
      return selectedLocationText ?? 'Khu vực';
    } else if (filterOption.id == FilterFieldName.Rooms) {
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
      case FilterFieldName.BusinessType:
        return (
          <div className="bg-white p-4">
            <BusinessTypeButtons />
          </div>
        );
      case FilterFieldName.CategoryType:
        return <CategoryType />;
      case FilterFieldName.Price:
        return <Price />;
      case FilterFieldName.Area:
        return <Area />;
      case FilterFieldName.FilterOverview:
        return <FilterModal />;
      case FilterFieldName.Locations:
        return <Locations />;
      case FilterFieldName.Rooms:
        return <Rooms />;
      case FilterFieldName.Direction:
        return <Direction />;
      default:
        return undefined;
    }
  };

  const buildMaxHeightPercent = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case FilterFieldName.FilterOverview:
        return 1;

      default:
        return undefined;
    }
  };

  const buildBtsFooter = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case FilterFieldName.FilterOverview:
        return <FooterOverviewBtsButton isRedirect={isRedirectWhenApplyFilter} />;
      default:
        return <FooterBtsButton filterOption={filterOption} />;
    }
  };

  const showFilterBts = (filterOption: FilterChipOption) => {
    if (filterOption.id == FilterFieldName.FilterOverview) {
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
      supportPushState: false
    });
  };

  const isActiveChip = (filterOption: FilterChipOption): boolean => {
    const fieldName = filterOption.id;

    if (filterOption.id == FilterFieldName.Locations) {
      return isSelectedLocation;
    } else if (filterOption.id == FilterFieldName.Rooms) {
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
    <div className="mt-5">
      {listFilterMobile.map((item) => (
        <Button
          key={item.id}
          className={cn(
            'duration-400 relative mb-2 mr-2 cursor-pointer rounded-xl border px-4 py-2 font-medium shadow-md transition-all focus:animate-pulse',
            activeChipClass(item),
          )}
          onClick={() => {
            showFilterBts(item);
          }}
        >
          {selectedFilterText(item)}
        </Button>
      ))}
    </div>
  );
}
