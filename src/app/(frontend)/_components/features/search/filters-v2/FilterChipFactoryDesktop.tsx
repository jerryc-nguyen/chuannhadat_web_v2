import React from 'react';
import { searchApi } from '@frontend/features/search/api/searchApi';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { FilterChipOption, OptionForSelect, FilterFieldName } from '@common/types';
import FilterContentOptionsFactory from './components/FilterContentOptionsFactory';
import { FilterState, FilterFieldOptions } from '@app/(frontend)/_components/features/search/filter-conditions/types';
import { useFilterState } from './hooks/useFilterState';
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
  filterState: FilterState;
  filterOptions: FilterFieldOptions;
  onFilterChange?: (filterState: Record<string, OptionForSelect>) => void;
};

const FilterChipFactoryDesktop: React.FC<FilterChipProps> = ({
  filterChipItem,
  filterState: propFilterState,
  filterOptions: propFilterOptions,
  onFilterChange
}) => {
  const {
    filterState,
    filterFieldOptions,
    onFilterChange: _handleFilterChange,
    onClearFilter,
    isFilterActive,
    getFilterValue,
  } = useFilterState();

  const [isOpenPopover, setIsOpenPopover] = React.useState<boolean>(false);
  const containerChipsRef = React.useRef(null);

  // Use prop filterState if provided, otherwise use hook filterState
  const currentFilterState = propFilterState || filterState;
  const _currentFilterOptions = propFilterOptions || filterFieldOptions;

  // Build filter params for API call
  const filterParams = React.useMemo(() => {
    const params: Record<string, any> = {};
    Object.entries(currentFilterState).forEach(([key, value]) => {
      if (value && value.value !== 'all' && value.value !== undefined) {
        params[key] = value.value;
      }
    });
    return params;
  }, [currentFilterState]);

  const { data, isLoading } = useQuery({
    queryKey: ['FooterBtsButton', filterParams],
    queryFn: () => searchApi(filterParams),
  });

  const onApplyFilter = () => {
    setIsOpenPopover(false);
    if (typeof onFilterChange === 'function') {
      // Convert FilterState to the expected format
      const convertedState: Record<string, OptionForSelect> = {};
      Object.entries(currentFilterState).forEach(([key, value]) => {
        if (value) {
          convertedState[key] = value;
        }
      });
      onFilterChange(convertedState);
    }
  };

  const handleRemoveFilter = (filterOption: FilterChipOption) => {
    const fieldName = filterOption.id as FilterFieldName;
    onClearFilter(fieldName);

    if (typeof onFilterChange === 'function') {
      // Convert FilterState to the expected format after clearing
      const newFilterState = { ...currentFilterState };
      delete newFilterState[fieldName];

      const convertedState: Record<string, OptionForSelect> = {};
      Object.entries(newFilterState).forEach(([key, value]) => {
        if (value) {
          convertedState[key] = value;
        }
      });
      onFilterChange(convertedState);
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
      <Popover open={isOpenPopover} onOpenChange={setIsOpenPopover}>
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
              onFilterChange={(_fieldName: FilterFieldName, _value: OptionForSelect | undefined) => {
                // Handle filter changes within the popover
              }}
              onLocationChange={(_location: {
                city?: OptionForSelect;
                district?: OptionForSelect;
                ward?: OptionForSelect;
              }) => {
                // Handle location changes within the popover
              }}
              filterType={filterChipItem.id}
            />
          </section>
          <Button disabled={isLoading} className="w-full" onClick={() => onApplyFilter()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Đang tải' : `Xem ${data?.pagination?.total_count} kết quả`}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterChipFactoryDesktop;
