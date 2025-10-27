import { OptionForSelect, FilterFieldName } from '@common/types';
import { FilterState, FilterFieldOptions } from '../../filter-conditions/types';

/**
 * Props for pure UI filter components
 */
export interface FilterComponentProps {
  /** Current selected value for this filter */
  value?: OptionForSelect;
  /** Available options for this filter */
  options: OptionForSelect[];
  /** Callback when user selects a new value */
  onValueChange: (value: OptionForSelect | undefined) => void;
  /** Whether the component is in loading state */
  isLoading?: boolean;
  /** Whether the component is disabled */
  disabled?: boolean;
}

/**
 * Props for filter chips (both mobile and desktop)
 */
export interface FilterChipProps {
  /** Current filter state */
  filterState: FilterState;
  /** Available options for all filters */
  filterOptions: FilterFieldOptions;
  /** Callback when any filter value changes */
  onFilterChange: (fieldName: FilterFieldName, value: OptionForSelect | undefined) => void;
  /** Callback when filter is applied */
  onApplyFilter?: (filterState: FilterState) => void;
  /** Callback when filter is cleared */
  onClearFilter?: (fieldName: FilterFieldName) => void;
  /** Callback when all filters are cleared */
  onClearAllFilters?: () => void;
  /** Whether to show loading state */
  isLoading?: boolean;
}

/**
 * Props for location-based filters (city, district, ward)
 */
export interface LocationFilterProps {
  /** Current city selection */
  city?: OptionForSelect;
  /** Current district selection */
  district?: OptionForSelect;
  /** Current ward selection */
  ward?: OptionForSelect;
  /** Available city options */
  cityOptions: OptionForSelect[];
  /** Available district options */
  districtOptions: OptionForSelect[];
  /** Available ward options */
  wardOptions: OptionForSelect[];
  /** Callback when location changes */
  onLocationChange: (location: {
    city?: OptionForSelect;
    district?: OptionForSelect;
    ward?: OptionForSelect;
  }) => void;
  /** Loading states for each level */
  loading?: {
    cities?: boolean;
    districts?: boolean;
    wards?: boolean;
  };
}

/**
 * Props for room-based filters (bed, bath)
 */
export interface RoomFilterProps {
  /** Current bed selection */
  bed?: OptionForSelect;
  /** Current bath selection */
  bath?: OptionForSelect;
  /** Available bed options */
  bedOptions: OptionForSelect[];
  /** Available bath options */
  bathOptions: OptionForSelect[];
  /** Callback when room selection changes */
  onRoomChange: (rooms: {
    bed?: OptionForSelect;
    bath?: OptionForSelect;
  }) => void;
}

/**
 * Props for range-based filters (price, area)
 */
export interface RangeFilterProps {
  /** Current selected range */
  value?: OptionForSelect;
  /** Available predefined options */
  options: OptionForSelect[];
  /** Minimum value for custom range */
  min?: number;
  /** Maximum value for custom range */
  max?: number;
  /** Callback when range changes */
  onRangeChange: (value: OptionForSelect | undefined) => void;
  /** Format function for displaying values */
  formatValue?: (value: number) => string;
}

/**
 * Props for reusable SelectFilter component (uses ListCheckOptions)
 */
export interface SelectFilterProps extends FilterComponentProps {
  /** Additional callback for legacy compatibility */
  onSelect?: (option: OptionForSelect) => void;
  /** Custom className for styling */
  className?: string;
}

/**
 * Props for reusable ChipFilter component (uses ListChips)
 */
export interface ChipFilterProps extends FilterComponentProps {
  /** Additional callback for legacy compatibility */
  onSelect?: (option: OptionForSelect) => void;
  /** Custom className for styling */
  className?: string;
}

/**
 * Event types for filter state changes
 */
export type FilterChangeEvent = {
  fieldName: FilterFieldName;
  value: OptionForSelect | undefined;
  previousValue?: OptionForSelect;
};

export type FilterApplyEvent = {
  filterState: FilterState;
  changedFields: FilterFieldName[];
};

export type FilterClearEvent = {
  fieldName: FilterFieldName;
  previousValue?: OptionForSelect;
};