import React from 'react';
import { cn } from '@common/utils';
import { FilterChipOption } from '@common/types';
import FilterChipFactoryDesktop from '@app/(frontend)/_components/features/search/filters-v2/FilterChipFactoryDesktop';
import { FilterState, AggregationData } from '@app/(frontend)/_components/features/search/types';
import { useFormFilterContext } from '@app/dashboard/_contexts/FormFilterContext';

type FilterChipsDesktopProps = {
  chipOptions: FilterChipOption[];
  className?: string;
  filterState?: FilterState;
  aggregationData?: AggregationData;
  onFiltersChanged?: (newFilterState: FilterState) => void;
};

const FilterChipsDesktop: React.FC<FilterChipsDesktopProps> = ({
  chipOptions = [],
  className,
  aggregationData,
  onFiltersChanged
}) => {
  const { counterFetcher } = useFormFilterContext();

  return (
    <div
      className={cn(
        'z-10 flex flex-col gap-x-3 lg:flex-row lg:items-center',
        className,
      )}
    >
      <div className="relative my-2 flex flex-wrap gap-2">
        {chipOptions.map((item: FilterChipOption) => (
          <FilterChipFactoryDesktop
            key={item.id}
            filterChipItem={item}
            onFiltersChanged={onFiltersChanged}
            aggregationData={aggregationData}
            counterFetcher={counterFetcher}
          />
        ))}
      </div>
    </div>
  );
};
export default FilterChipsDesktop;
