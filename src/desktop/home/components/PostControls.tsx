import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { SORT_OPTIONS } from '@common/constants';

import React from 'react';
import { listFilterDesktop } from '@mobile/filter_bds/constants';
import FilterChip from './FilterChip';
import { cn } from '@common/utils';
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
  const { selectedSortValue, onSelectSortOption, setIsRedirect } = useFilterState();
  const handleChangeSortOption = (value: string) => {
    onSelectSortOption(value);
  };
  React.useEffect(() => {
    setIsRedirect(isRedirectAfterApplyFilter);
  }, []);
  return (
    <div className="my-2">
      {isShowListChips && (
        <Select>
          <div className="relative my-2 flex flex-wrap gap-2">
            {listFilterDesktop.map((item) => (
              <FilterChip
                isRedirectAfterApplyFilter={isRedirectAfterApplyFilter}
                filterChipItem={item}
                key={item.id}
              />
            ))}
          </div>
        </Select>
      )}
      <div className="filter-sort flex w-full items-center justify-between">
        <span className="font-semibold text-black">Có {pagination?.total_count} tin đăng</span>
        <Select
          defaultValue={undefined}
          value={selectedSortValue}
          onValueChange={handleChangeSortOption}
        >
          <SelectTrigger className="right-0 w-[180px] bg-black text-white shadow-sm">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SORT_OPTIONS.map((item) => (
                <SelectItem key={item.value} className="cursor-pointer" value={item.value}>
                  {item.text}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
export default PostControls;
