import useFilterState from '@mobile/filter_bds/hooks/useFilterState';

import React from 'react';

import FilterChip from './FilterChip';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import { FilterChipOption } from '@mobile/filter_bds/types';

type PostControlsProps = {
  chipOptions: FilterChipOption[],
  pagination: A;
  isShowListChips?: boolean;
};

const PostControls: React.FC<PostControlsProps> = ({
  chipOptions = [],
  pagination,
  isShowListChips = true,
}) => {
  useSyncParamsToState();

  return (
    <div className="my-2 flex flex-col gap-x-3 lg:flex-row lg:items-center">
      <span className="font-semibold text-black">Có {pagination?.total_count} tin đăng</span>
      <div className="hidden h-8 w-[2px] bg-[#f0f0f0] lg:block" />
      {isShowListChips && (
        <div className="relative my-2 flex flex-wrap gap-2">
          {chipOptions.map((item: FilterChipOption) => (
            <FilterChip filterChipItem={item} key={item.id} />
          ))}
        </div>
      )}
    </div>
  );
};
export default PostControls;
