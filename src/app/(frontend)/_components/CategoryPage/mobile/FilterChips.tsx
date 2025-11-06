'use client';
import React from 'react';
import { FilterChipOption } from '@common/types';
import { AggregationData, FilterState } from '@app/(frontend)/_components/features/search/types';
import FilterChipFactoryMobile from '@frontend/features/search/filters-v2/FilterChipFactoryMobile';
import HorizontalScroller from '@components/mobile-ui/HorizontalScroller';

type FilterChipsMobileProps = {
  chipOptions: FilterChipOption[];
  aggregationData?: AggregationData;
  onFiltersChanged?: (newFilterState: FilterState) => void;
};

export default function FilterChipsMobile({
  chipOptions,
  aggregationData,
  onFiltersChanged
}: FilterChipsMobileProps) {
  return (
    <HorizontalScroller className="relative my-2 flex gap-2">
      {chipOptions.map((item, index) => (
        <div
          key={item.id}
          className={index === 0 ? 'ml-4' : ''}
        >
          <FilterChipFactoryMobile
            filterChipItem={item}
            aggregationData={aggregationData}
            onFiltersChanged={onFiltersChanged}
          />
        </div>
      ))}
    </HorizontalScroller>
  );
}
