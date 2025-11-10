import { FilterFieldName, OptionForSelect } from '@common/types';
import { FilterState, AggregationData } from '../../types';
import SelectFilter from './SelectFilter';
import ChipFilter from './ChipFilter';
import BusinessTypeButtons from './BusinessTypeButtons';
import LocationFilter from './LocationFilter';
import RangeFilter from './RangeFilter';
import RoomFilter from './RoomFilter';
import useFilterOptions from '../hooks/useFilterOptions';
import { formatPriceFilterChip, formatRangeText, formatAreaText } from '@common/utils';
import ProjectPicker from '@components/ajax-pickers/ProjectPicker';
import useMainContentNavigator from '@app/(frontend)/_components/features/navigation/main-content-navigator/hooks';
import AggLocationsFilter from '@app/(frontend)/_components/features/search/filters-v2/components/AggLocationsFilter';

interface FilterContentOptionsFactoryProps {
  /** Current filter state */
  filterState: FilterState;
  /** Selected options for the builder (optional - will use hook if not provided) */
  filterOptions?: OptionForSelect[];
  /** Callback when any filter changes */
  onChange: (fieldName: FilterFieldName, value: OptionForSelect | undefined) => void;
  /** Callback for location changes */
  onLocationChange: (location: {
    city?: OptionForSelect;
    district?: OptionForSelect;
    ward?: OptionForSelect;
  }) => void;
  /** Loading states */
  loading?: {
    [key: string]: boolean;
  };
  /** Which filter to render */
  filterType: FilterFieldName;
  /** Aggregation data from useSearchAggs (for pure UI) */
  aggregationData?: AggregationData;
}

/**
 * Factory component that creates appropriate filter components based on type.
 * 
 * This implements the Factory Pattern to centralize filter component creation:
 * - FilterFieldName.CategoryType, BusCatType, Direction, Sort, AggProjects → SelectFilter
 * - FilterFieldName.Bed, Bath → ChipFilter  
 * - FilterFieldName.BusinessType → BusinessTypeButtons (already pure)
 * - FilterFieldName.Locations → LocationFilter (already pure)
 * 
 * Benefits:
 * - Centralizes component creation logic
 * - Reduces code duplication from ~200 lines to ~50 lines
 * - Consistent behavior across all filter types
 * - Easy to test and maintain
 * - Pure UI components with clear interfaces
 */
export default function FilterContentOptionsFactory({
  filterState,
  filterOptions: propFilterOptions,
  onChange,
  onLocationChange,
  loading = {},
  filterType,
  aggregationData = {},
}: FilterContentOptionsFactoryProps) {
  // Use the hook to get filter options
  const { getOptionsForField } = useFilterOptions();

  // Use aggregation data for specific filter types, otherwise use provided options or hook options
  const getFilterOptions = (): OptionForSelect[] => {
    switch (filterType) {
      case FilterFieldName.BusCatType:
        return aggregationData.busCatTypeOptions || propFilterOptions || getOptionsForField(FilterFieldName.BusCatType);
      case FilterFieldName.ProfileLocations:
        // For locations, we'll handle this in the location-specific components
        return propFilterOptions || getOptionsForField(filterType);
      default:
        return propFilterOptions || getOptionsForField(filterType);
    }
  };

  const filterOptions = getFilterOptions();
  const { extraParams: mainLocationParams } = useMainContentNavigator();

  // Helper to get current value for a field
  const getValue = (fieldName: FilterFieldName) => {
    return filterState[fieldName as keyof FilterState] as OptionForSelect | undefined;
  };

  // Helper to handle filter changes
  const handleChange = (fieldName: FilterFieldName) => (value: OptionForSelect | undefined) => {
    onChange(fieldName, value);
  };

  switch (filterType) {
    case FilterFieldName.CategoryType:
      return (
        <SelectFilter
          value={getValue(FilterFieldName.CategoryType)}
          options={propFilterOptions || getOptionsForField(FilterFieldName.CategoryType)}
          onValueChange={handleChange(FilterFieldName.CategoryType)}
          isLoading={loading.categoryType}
        />
      );

    case FilterFieldName.BusCatType:
      return (
        <SelectFilter
          value={getValue(FilterFieldName.BusCatType)}
          options={filterOptions}
          onValueChange={handleChange(FilterFieldName.BusCatType)}
          isLoading={loading.busCatType}
        />
      );

    case FilterFieldName.Direction:
      return (
        <SelectFilter
          value={getValue(FilterFieldName.Direction)}
          options={propFilterOptions || getOptionsForField(FilterFieldName.Direction)}
          onValueChange={handleChange(FilterFieldName.Direction)}
          isLoading={loading.direction}
        />
      );

    case FilterFieldName.Sort:
      return (
        <SelectFilter
          value={getValue(FilterFieldName.Sort)}
          options={propFilterOptions || getOptionsForField(FilterFieldName.Sort)}
          onValueChange={handleChange(FilterFieldName.Sort)}
          isLoading={loading.sort}
        />
      );

    case FilterFieldName.AggProjects:
      return (
        <SelectFilter
          value={getValue(FilterFieldName.AggProjects) || getValue(FilterFieldName.Project)}
          options={aggregationData.projectsOptions || propFilterOptions || getOptionsForField(FilterFieldName.AggProjects)}
          onValueChange={handleChange(FilterFieldName.AggProjects)}
          isLoading={loading.aggProjects}
        />
      );

    case FilterFieldName.Bed:
      return (
        <ChipFilter
          value={getValue(FilterFieldName.Bed)}
          options={propFilterOptions || getOptionsForField(FilterFieldName.Bed)}
          onValueChange={handleChange(FilterFieldName.Bed)}
          isLoading={loading.bed}
        />
      );

    case FilterFieldName.Bath:
      return (
        <ChipFilter
          value={getValue(FilterFieldName.Bath)}
          options={propFilterOptions || getOptionsForField(FilterFieldName.Bath)}
          onValueChange={handleChange(FilterFieldName.Bath)}
          isLoading={loading.bath}
        />
      );

    case FilterFieldName.BusinessType:
      return (
        <BusinessTypeButtons
          value={getValue(FilterFieldName.BusinessType)}
          options={propFilterOptions || getOptionsForField(FilterFieldName.BusinessType)}
          onValueChange={handleChange(FilterFieldName.BusinessType)}
          isLoading={loading.businessType}
        />
      );

    case FilterFieldName.Locations:
      return (
        <LocationFilter
          city={getValue(FilterFieldName.City)}
          district={getValue(FilterFieldName.District)}
          ward={getValue(FilterFieldName.Ward)}
          cityOptions={getOptionsForField(FilterFieldName.City)}
          districtOptions={getOptionsForField(FilterFieldName.District)}
          wardOptions={getOptionsForField(FilterFieldName.Ward)}
          onLocationChange={onLocationChange}
          loading={{
            cities: loading.cities,
            districts: loading.districts,
            wards: loading.wards,
          }}
        />
      );

    case FilterFieldName.Price:
      return (
        <RangeFilter
          value={getValue(FilterFieldName.Price)}
          options={propFilterOptions || getOptionsForField(FilterFieldName.Price)}
          min={100_000_000} // 100 million VND
          max={20_000_000_000} // 20 billion VND
          step={100_000_000} // 100 million VND step
          onRangeChange={handleChange(FilterFieldName.Price)}
          formatValue={formatPriceFilterChip}
          formatRangeText={formatRangeText}
          isLoading={loading.price}
        />
      );

    case FilterFieldName.Area:
      return (
        <RangeFilter
          value={getValue(FilterFieldName.Area)}
          options={propFilterOptions || getOptionsForField(FilterFieldName.Area)}
          min={0}
          max={150} // 150 m²
          step={10} // 10 m² step
          onRangeChange={handleChange(FilterFieldName.Area)}
          formatValue={(area: number) => `${area} m²`}
          formatRangeText={formatAreaText}
          isLoading={loading.area}
        />
      );

    case FilterFieldName.Rooms:
      return (
        <RoomFilter
          bed={getValue(FilterFieldName.Bed)}
          bath={getValue(FilterFieldName.Bath)}
          bedOptions={getOptionsForField(FilterFieldName.Bed)}
          bathOptions={getOptionsForField(FilterFieldName.Bath)}
          onRoomChange={({ bed, bath }) => {
            if (bed !== undefined) {
              onChange(FilterFieldName.Bed, bed);
            }
            if (bath !== undefined) {
              onChange(FilterFieldName.Bath, bath);
            }
          }}
        />
      );

    case FilterFieldName.Project:
      return (
        <ProjectPicker
          value={getValue(FilterFieldName.Project)}
          onSelect={handleChange(FilterFieldName.Project)}
          extraParams={mainLocationParams}
        />
      );

    case FilterFieldName.ProfileLocations:
      return (
        <AggLocationsFilter
          city={getValue(FilterFieldName.City)}
          district={getValue(FilterFieldName.District)}
          ward={getValue(FilterFieldName.Ward)}
          cityOptions={getOptionsForField(FilterFieldName.City)}
          districtOptions={aggregationData.locationsList?.districtOptions || getOptionsForField(FilterFieldName.District)}
          wardOptions={aggregationData.locationsList?.wardOptions || getOptionsForField(FilterFieldName.Ward)}
          onLocationChange={onLocationChange}
          loading={{
            cities: loading.cities,
            districts: loading.districts,
            wards: loading.wards,
          }}
        />
      );

    default:
      // Log unsupported filter types in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`FilterContentOptionsFactory: Unsupported filterType "${filterType}". Supported types: CategoryType, BusCatType, Direction, Sort, AggProjects, Bed, Bath, BusinessType, Locations, Price, Area, Rooms, Project, ProfileLocations`);
      }
      return null;
  }
}
