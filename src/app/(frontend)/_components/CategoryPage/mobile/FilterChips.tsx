'use client';
import React from 'react';
import { FilterChipOption, FilterFieldName } from '@common/types';
import { FilterState, AggregationData } from '@app/(frontend)/_components/features/search/types';
import { FilterChangeEvent } from '@frontend/features/search/filters-v2/types/pure-ui-types';
import FilterChipFactoryMobile from '@frontend/features/search/filters-v2/FilterChipFactoryMobile';
import HorizontalScroller from '@components/mobile-ui/HorizontalScroller';

type FilterChipsMobileProps = {
  chipOptions: FilterChipOption[];
  selectedFilterState: FilterState;
  onFiltersChanged?: (filterState: FilterState) => void;
  // Functions from useFilterState hook
  onFieldChanged: (event: FilterChangeEvent) => void;
  onClearFilter: (filterFieldName: FilterFieldName) => void;
  // Aggregation data from useSearchAggs (for pure UI)
  aggregationData?: AggregationData;
};

export default function FilterChipsMobile({
  chipOptions,
  selectedFilterState,
  onFiltersChanged,
  onFieldChanged,
  onClearFilter,
  aggregationData
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
            selectedFilterState={selectedFilterState}
            onFiltersChanged={onFiltersChanged}
            onFieldChanged={onFieldChanged}
            onClearFilter={onClearFilter}
            aggregationData={aggregationData}
          />
        </div>
      ))}
    </HorizontalScroller>
  );
}
