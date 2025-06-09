'use client';
import React from 'react';
import { FilterFieldName } from '@models';
import Price from './bts/Price';
import Area from './bts/Area';
import FooterBtsButton from './FooterBtsButton';
import Locations from './bts/Locations';
import useModals from '@mobile/modals/hooks';
import FilterModal from './FilterModal';
import FooterOverviewBtsButton from './FooterOverviewBtsButton';
import BusinessTypeButtons from './bts/BusinessTypeButtons';
import CategoryType from './bts/CategoryType';
import Rooms from './bts/Rooms';
import { DEFAULT_MODAL_HEIGHTS } from './FilterModal';
import Direction from './bts/Direction';
import useFilterState from './hooks/useFilterState';
import { cn } from '@common/utils';
import { FilterChipOption } from './types';
import { Button } from '@components/ui/button';
import { Modal } from '@mobile/modals/states/types';
import Projects from './bts/desktop/Projects';
import HorizontalScroller from '@mobile/ui/HorizontalScroller';
import { LuX } from 'react-icons/lu';
import ProfileLocationsV2 from '@views/product-filters/ProfileLocationsV2';
import BusCatType from './bts/BusCatType';
import SortOptions from './bts/SortOptions';
import AggProjects from '@mobile/filter_bds/bts/AggProjects';

type FilterChipsProps = {
  chipOptions: FilterChipOption[];
  onFilterChipsChanged?: (filterState: Record<string, A>) => void;
}

export default function FilterChips({ chipOptions, onFilterChipsChanged }: FilterChipsProps) {
  const {
    copyFilterStatesToLocal,
    removeFilterValue,
    selectedFilterText,
    isActiveChip
  } = useFilterState();
  const { openModal } = useModals();

  const buildContent = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case FilterFieldName.BusinessType:
        return (
          <div className="bg-white p-4">
            <BusinessTypeButtons />
          </div>
        );
      case FilterFieldName.ProfileLocations:
        return <ProfileLocationsV2 />;
      case FilterFieldName.BusCatType:
        return <BusCatType />;
      case FilterFieldName.CategoryType:
        return <CategoryType />;
      case FilterFieldName.Project:
        return <Projects />;
      case FilterFieldName.AggProjects:
        return <AggProjects />;
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
      case FilterFieldName.Sort:
        return <SortOptions />;
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
        return <FooterOverviewBtsButton onChange={onFilterChipsChanged} />;
      default:
        return <FooterBtsButton filterOption={filterOption} onChange={onFilterChipsChanged} />;
    }
  };

  const showFilterBts = (filterOption: FilterChipOption) => {
    if (filterOption.id == FilterFieldName.FilterOverview) {
      copyFilterStatesToLocal();
    } else {
      copyFilterStatesToLocal([filterOption.id as FilterFieldName]);
    }

    let modalOptions: Modal = {
      name: filterOption.id,
      title: filterOption.text,
      content: buildContent(filterOption),
      footer: buildBtsFooter(filterOption),
      maxHeightPercent: buildMaxHeightPercent(filterOption),
      defaultContentHeight:
        //@ts-ignore: read value
        DEFAULT_MODAL_HEIGHTS[filterOption.id],
      supportPushState: false,
    };

    if (filterOption.id == FilterFieldName.FilterOverview) {
      modalOptions = { ...modalOptions, headerHeight: 58, footerHeight: 67 };
    }

    openModal(modalOptions);
  };

  const handleRemoveFilter = (filterOption: FilterChipOption) => {
    const fieldName = filterOption.id;
    const filterState = removeFilterValue(fieldName);
    if (onFilterChipsChanged) {
      onFilterChipsChanged(filterState);
    }
  };

  return (
    <HorizontalScroller className="relative my-2 flex gap-2">
      {chipOptions.map((item, index) => (
        <Button
          key={item.id}
          className={cn(
            'w-fit cursor-default gap-x-4 rounded-full border font-semibold transition-all',
            isActiveChip(item)
              ? 'bg-black text-white hover:bg-black'
              : 'bg-white text-black hover:bg-slate-50',
            index == 0 ? 'ml-4' : '',
          )}
          onClick={() => {
            showFilterBts(item);
          }}
        >
          {selectedFilterText(item)}

          {isActiveChip(item) && (
            <LuX
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFilter(item);
              }}
              className="cursor-pointer text-xl"
            />
          )}
        </Button>
      ))}
    </HorizontalScroller>
  );
}
