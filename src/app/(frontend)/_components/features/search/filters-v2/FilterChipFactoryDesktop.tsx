import React from 'react';
import { searchApi } from '@frontend/features/search/api/searchApi';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { FilterChipOption, OptionForSelect, FilterFieldName } from '@common/types';
import FilterContentOptionsFactory from './components/FilterContentOptionsFactory';
import { FilterState } from '@app/(frontend)/_components/features/search/filter-conditions/types';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUp as SortUpIcon,
  Building,
  Loader2,
  X,
  DollarSign
} from 'lucide-react';

export type FilterChipProps = {
  filterChipItem: FilterChipOption;
  selectedFilterState: FilterState;
  onFiltersChanged?: (filterState: FilterState) => void;
  // Functions from useFilterState hook
  onFieldChanged: (event: { fieldName: FilterFieldName; value: OptionForSelect | undefined }) => void;
  onClearFilter: (filterFieldName: FilterFieldName) => void;
  isFilterActive: (filterFieldName: FilterFieldName) => boolean;
  getFilterValue: (filterFieldName: FilterFieldName) => OptionForSelect | undefined;
};

const FilterChipFactoryDesktop: React.FC<FilterChipProps> = ({
  filterChipItem,
  selectedFilterState,
  onFiltersChanged,
  onFieldChanged,
  onClearFilter,
  isFilterActive,
  getFilterValue,
}) => {

  const [isOpenPopover, setIsOpenPopover] = React.useState<boolean>(false);
  const [localFilterState, setLocalFilterState] = React.useState<FilterState>({});

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
    return { ...selectedFilterState, ...localFilterState }
  }, [selectedFilterState, localFilterState]);

  const { data, isLoading } = useQuery({
    queryKey: ['FooterBtsButton', currentFilterState],
    queryFn: () => searchApi(currentFilterState),
  });

  // Handle local filter changes within the dropdown
  const handleLocalFilterChange = (fieldName: FilterFieldName, value: OptionForSelect | undefined) => {
    setLocalFilterState(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Handle local location changes within the dropdown
  const handleLocalLocationChange = (location: {
    city?: OptionForSelect;
    district?: OptionForSelect;
    ward?: OptionForSelect;
  }) => {
    setLocalFilterState(prev => ({
      ...prev,
      ...location
    }));
  };

  const onApplyFilter = (filterChipItem: FilterChipOption) => {
    setIsOpenPopover(false);

    // Sync local state to global state
    onFieldChanged({ fieldName: filterChipItem.id as FilterFieldName, value: localFilterState[filterChipItem.id as FilterFieldName] });

    if (typeof onFiltersChanged === 'function') {
      onFiltersChanged(currentFilterState);
    }
  };

  const handleRemoveFilter = (filterOption: FilterChipOption) => {
    const fieldName = filterOption.id as FilterFieldName;
    onClearFilter(fieldName);

    if (typeof onFiltersChanged === 'function') {
      // Convert FilterState to the expected format after clearing
      const newFilterState = { ...selectedFilterState };
      delete newFilterState[fieldName];

      const convertedState: Record<string, OptionForSelect> = {};
      Object.entries(newFilterState).forEach(([key, value]) => {
        if (value) {
          convertedState[key] = value;
        }
      });
      onFiltersChanged(convertedState);
    }
  };

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
  const isChipActive = isFilterActive(filterChipItem.id as FilterFieldName);

  // Get the display text for the filter chip
  const getFilterDisplayText = () => {
    const value = getFilterValue(filterChipItem.id as FilterFieldName);
    if (value && value.text) {
      return value.text;
    }
    return filterChipItem.text;
  };

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
              {getFilterDisplayText()}
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
