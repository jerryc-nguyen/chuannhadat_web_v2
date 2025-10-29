import React from 'react';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { FilterChipOption, OptionForSelect, FilterFieldName } from '@common/types';
import FilterContentOptionsFactory from './components/FilterContentOptionsFactory';
import { FilterState } from '@app/(frontend)/_components/features/search/filter-conditions/types';
import { FilterChangeEvent } from './types/pure-ui-types';
import { useFilterOperation } from './hooks/useFilterOperation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUp as SortUpIcon,
  Building,
  Loader2,
  X,
  DollarSign
} from 'lucide-react';
import { useFilterStatePresenter } from './hooks/useFilterStatePresenter';
import { buildFriendlyParams } from '@app/(frontend)/_components/features/search/filters-v2/helpers/friendlyParamsHelper';

export type FilterChipProps = {
  filterChipItem: FilterChipOption;
  selectedFilterState: FilterState;
  onFiltersChanged?: (filterState: FilterState) => void;
  // Functions from useFilterState hook
  onFieldChanged: (event: FilterChangeEvent) => void;
  onClearFilter: (filterFieldName: FilterFieldName) => void;
  getFilterValue: (filterFieldName: FilterFieldName) => OptionForSelect | undefined;
};

const FilterChipFactoryDesktop: React.FC<FilterChipProps> = ({
  filterChipItem,
  selectedFilterState,
  onFiltersChanged,
  onFieldChanged,
  onClearFilter,
}) => {

  const [isOpenPopover, setIsOpenPopover] = React.useState<boolean>(false);
  const [localFilterState, setLocalFilterState] = React.useState<FilterState>({});
  const { selectedFilterText, isActiveChip } = useFilterStatePresenter(selectedFilterState);

  const containerChipsRef = React.useRef(null);

  // Initialize local state from global state when dropdown opens
  React.useEffect(() => {
    if (isOpenPopover) {
      setLocalFilterState({ ...selectedFilterState });
    }
  }, [isOpenPopover, selectedFilterState]);

  // Reset local state when dropdown closes without applying
  const handlePopoverOpenChange = (open: boolean) => {
    setIsOpenPopover(open);
    if (!open) {
      // Reset local state when closing
      setLocalFilterState({});
    }
  };

  // Build filter params for API call
  const currentFilterState = React.useMemo(() => {
    // Only merge if localFilterState has actual values
    if (Object.keys(localFilterState).length === 0) {
      return selectedFilterState;
    }
    return { ...selectedFilterState, ...localFilterState };
  }, [selectedFilterState, localFilterState]);

  const filterParams = React.useMemo(() => {
    return buildFriendlyParams(currentFilterState);
  }, [currentFilterState]);

  const { data, isLoading } = useQuery({
    queryKey: ['FooterBtsButton', filterParams],
    queryFn: () => searchApiV2(filterParams),
  });

  // Use the extracted filter state operations hook
  const {
    handleLocalFilterChange,
    handleLocalLocationChange,
    onApplyFilter,
    handleRemoveFilter,
  } = useFilterOperation({
    localFilterState,
    setLocalFilterState,
    selectedFilterState,
    onFieldChanged,
    onClearFilter,
    onFiltersChanged,
    setIsOpenPopover,
  });

  const onRenderIconChip = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case FilterFieldName.Project:
        return <Building className="text-xl" />;
      case FilterFieldName.Price:
        return <DollarSign className="text-xl" />;
      case FilterFieldName.Sort:
        return <SortUpIcon className="text-xl" />;
      default:
        break;
    }
  };

  const contentWidth = () => {
    switch (filterChipItem.id) {
      case FilterFieldName.Locations:
        return 'w-[350px] c-locationPC';
      case FilterFieldName.ProfileLocations:
        return 'w-[350px] c-profileLocationPC';
      case FilterFieldName.Rooms:
        return 'w-80';
      default:
        return 'min-w-80 w-fit';
    }
  };

  // Check if the current filter chip is active
  const isChipActive = isActiveChip(filterChipItem);

  return (
    <div ref={containerChipsRef}>
      <Popover open={isOpenPopover} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <Button
            onClick={() => {
              setIsOpenPopover(true);
            }}
            className={cn(
              'w-fit cursor-pointer gap-x-4 rounded-full border px-4 font-semibold transition-all',
              isChipActive
                ? 'bg-black text-white hover:bg-black'
                : 'bg-white text-black hover:bg-slate-50',
            )}
          >
            <div
              className={cn(
                'flex items-center gap-x-1',
                isChipActive ? '' : 'text-secondary hover:text-black',
              )}
            >
              {onRenderIconChip(filterChipItem)}
              {selectedFilterText(filterChipItem)}
            </div>
            {isChipActive && (
              <X
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFilter(filterChipItem);
                }}
                className="cursor-pointer text-xl"
              />
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          container={containerChipsRef.current}
          sideOffset={5}
          align="center"
          side="bottom"
          className={cn(`!relative z-20 mt-4 ${contentWidth()}`)}
        >
          <h2 className="text-left text-lg font-semibold">{filterChipItem.text}</h2>
          <section className="content-filter my-3 max-h-[20rem] overflow-y-auto">
            <FilterContentOptionsFactory
              filterState={currentFilterState}
              onChange={handleLocalFilterChange}
              onLocationChange={handleLocalLocationChange}
              filterType={filterChipItem.id}
            />
          </section>
          <Button disabled={isLoading} className="w-full" onClick={() => onApplyFilter(filterChipItem)}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Đang tải' : `Xem ${data?.pagination?.total_count} kết quả`}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterChipFactoryDesktop;
