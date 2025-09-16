import React from 'react';

import FilterChip from '../../features/search/filter-conditions/desktop/FilterChip';
import { FilterChipOption, IPagination, OptionForSelect } from '@common/types';
import { cn } from '@common/utils';

type PostControlsProps = {
  chipOptions: FilterChipOption[];
  pagination: IPagination;
  isShowListChips?: boolean;
  className?: string;
  onFilterChange?: (filterState: Record<string, OptionForSelect>) => void;
};

const PostControls: React.FC<PostControlsProps> = ({
  chipOptions = [],
  pagination,
  isShowListChips = true,
  className,
  onFilterChange
}) => {

  return (
    <div
      id="post-control-desktop"
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
            <FilterChip filterChipItem={item} key={item.id} onChange={onFilterChange} />
          ))}
        </div>
      )}
    </div>
  );
};
export default PostControls;
