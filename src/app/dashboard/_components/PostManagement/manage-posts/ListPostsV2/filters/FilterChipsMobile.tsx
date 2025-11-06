import React from 'react';
import { cn } from '@common/utils';
import { FilterChipOption } from '@common/types';
import { FilterState, AggregationData } from '@app/(frontend)/_components/features/search/types';
import FilterChipFactoryMobile from '@app/(frontend)/_components/features/search/filters-v2/FilterChipFactoryMobile';
import HorizontalScroller from '@components/mobile-ui/HorizontalScroller';

type FilterChipsMobileProps = {
  chipOptions: FilterChipOption[];
  className?: string;
  filterState?: FilterState;
  aggregationData?: AggregationData;
  onFiltersChanged?: (newFilterState: FilterState) => void;
};

const FilterChipsMobile: React.FC<FilterChipsMobileProps> = ({
  chipOptions = [],
  className,
  aggregationData,
  onFiltersChanged
}) => {

  return (
    <div
      className={cn(
        'z-10 flex flex-col',
        className,
      )}
    >
      <HorizontalScroller className="relative mb-4 flex gap-2">
        {chipOptions.map((item: FilterChipOption) => (
          <FilterChipFactoryMobile
            key={item.id}
            filterChipItem={item}
            onFiltersChanged={onFiltersChanged}
            aggregationData={aggregationData}
          />
        ))}
      </HorizontalScroller>
    </div>
  );
};
export default FilterChipsMobile;
