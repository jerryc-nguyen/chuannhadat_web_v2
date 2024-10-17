import useFilterState from '@mobile/filter_bds/hooks/useFilterState';

import React from 'react';
import { listFilterDesktop } from '@mobile/filter_bds/constants';
import FilterChip from './FilterChip';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';

type PostControlsProps = {
  pagination: A;
  isRedirectAfterApplyFilter?: boolean;
  isShowListChips?: boolean;
};

const PostControls: React.FC<PostControlsProps> = ({
  pagination,
  isRedirectAfterApplyFilter = true,
  isShowListChips = true,
}) => {
  useSyncParamsToState();
  const { setIsRedirect } = useFilterState();

  React.useEffect(() => {
    setIsRedirect(isRedirectAfterApplyFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="my-2 flex flex-col gap-x-3 lg:flex-row lg:items-center">
      <span className="font-semibold text-black">Có {pagination?.total_count} tin đăng</span>
      <div className="hidden h-8 w-[2px] bg-[#f0f0f0] lg:block" />
      {isShowListChips && (
        <div className="relative my-2 flex flex-wrap gap-2">
          {listFilterDesktop.map((item) => (
            <FilterChip filterChipItem={item} key={item.id} />
          ))}
        </div>
      )}
    </div>
  );
};
export default PostControls;
