import React from 'react';
import { cn } from '@common/utils';
import { FilterChipOption, IPagination, OptionForSelect } from '@common/types';
import FilterChipFactoryDesktop from '@app/(frontend)/_components/features/search/filters-v2/FilterChipFactoryDesktop';
import { FilterState, FilterFieldOptions } from '@app/(frontend)/_components/features/search/filter-conditions/types';

type PostControlsV2Props = {
  chipOptions: FilterChipOption[];
  pagination: IPagination;
  isShowListChips?: boolean;
  className?: string;
  onFilterChange?: (filterState: Record<string, OptionForSelect>) => void;
  filterState?: FilterState;
  filterOptions?: FilterFieldOptions;
};



const PostControlsV2: React.FC<PostControlsV2Props> = ({
  chipOptions = [],
  pagination,
  isShowListChips = true,
  className,
  onFilterChange,
  filterState = {} as FilterState,
  filterOptions = {} as FilterFieldOptions
}) => {

  return (
    <div
      id="post-control-desktop-v2"
      className={cn(
        'sticky top-16 z-10 flex flex-col gap-x-3 bg-white/70 backdrop-blur-sm lg:flex-row lg:items-center',
        className,
      )}
    >
      <span className="font-semibold text-black">Có {pagination?.total_count} tin đăng</span>
      <div className="hidden h-8 w-[2px] bg-[#f0f0f0] lg:block" />
      {isShowListChips && (
        <div className="relative my-2 flex flex-wrap gap-2">
          {chipOptions.map((item: FilterChipOption) => (
            <FilterChipFactoryDesktop
              key={item.id}
              filterChipItem={item}
              filterState={filterState}
              filterOptions={filterOptions}
              onFilterChange={onFilterChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default PostControlsV2;
