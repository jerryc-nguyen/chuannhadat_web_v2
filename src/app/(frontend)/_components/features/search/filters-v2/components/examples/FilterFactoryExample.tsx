import React from 'react';
import { FilterFieldName, OptionForSelect } from '@common/types';
import { FilterState, FilterFieldOptions } from '../../../filter-conditions/types';
import FilterContentOptionsFactory from '../FilterContentOptionsFactory';

/**
 * Example component demonstrating type-safe usage of FilterContentOptionsFactory
 * with FilterFieldName enum values instead of string literals.
 */
export default function FilterFactoryExample() {
  const [filterState, setFilterState] = React.useState<FilterState>({});
  const [filterOptions] = React.useState<FilterFieldOptions>({
    businessTypeOptions: [
      { value: 'sale', text: 'Bán' },
      { value: 'rent', text: 'Cho thuê' },
    ],
    categoryTypeOptions: [
      { value: 'apartment', text: 'Căn hộ' },
      { value: 'house', text: 'Nhà riêng' },
    ],
    bedOptions: [
      { value: '1', text: '1 phòng ngủ' },
      { value: '2', text: '2 phòng ngủ' },
      { value: '3', text: '3 phòng ngủ' },
    ],
    bathOptions: [
      { value: '1', text: '1 phòng tắm' },
      { value: '2', text: '2 phòng tắm' },
      { value: '3', text: '3 phòng tắm' },
    ],
    priceOptions: [
      { value: 'under-1b', text: 'Dưới 1 tỷ' },
      { value: '1b-3b', text: '1-3 tỷ' },
      { value: 'over-3b', text: 'Trên 3 tỷ' },
    ],
    areaOptions: [
      { value: 'under-50', text: 'Dưới 50m²' },
      { value: '50-100', text: '50-100m²' },
      { value: 'over-100', text: 'Trên 100m²' },
    ],
    directionOptions: [
      { value: 'north', text: 'Bắc' },
      { value: 'south', text: 'Nam' },
      { value: 'east', text: 'Đông' },
      { value: 'west', text: 'Tây' },
    ],
    roomOptions: [
      { value: '1', text: '1 phòng' },
      { value: '2', text: '2 phòng' },
      { value: '3', text: '3 phòng' },
    ],
  });

  const handleFilterChange = (fieldName: FilterFieldName, value: OptionForSelect | undefined) => {
    setFilterState(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleLocationChange = (location: {
    city?: OptionForSelect;
    district?: OptionForSelect;
    ward?: OptionForSelect;
  }) => {
    setFilterState(prev => ({
      ...prev,
      city: location.city,
      district: location.district,
      ward: location.ward,
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Filter Factory Examples</h3>
      
      {/* Type-safe enum usage - TypeScript will catch typos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Category Type Filter */}
        <div className="border p-4 rounded">
          <h4 className="font-medium mb-2">Category Type</h4>
          <FilterContentOptionsFactory
            filterState={filterState}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onLocationChange={handleLocationChange}
            filterType={FilterFieldName.CategoryType} // ✅ Type-safe
          />
        </div>

        {/* Bed Filter */}
        <div className="border p-4 rounded">
          <h4 className="font-medium mb-2">Bedrooms</h4>
          <FilterContentOptionsFactory
            filterState={filterState}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onLocationChange={handleLocationChange}
            filterType={FilterFieldName.Bed} // ✅ Type-safe
          />
        </div>

        {/* Business Type Filter */}
        <div className="border p-4 rounded">
          <h4 className="font-medium mb-2">Business Type</h4>
          <FilterContentOptionsFactory
            filterState={filterState}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onLocationChange={handleLocationChange}
            filterType={FilterFieldName.BusinessType} // ✅ Type-safe
          />
        </div>

        {/* 
        This would cause a TypeScript error:
        <FilterContentOptionsFactory
          filterType="invalidType" // ❌ TypeScript error
          ...
        />
        */}
      </div>

      {/* Display current filter state */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h4 className="font-medium mb-2">Current Filter State:</h4>
        <pre className="text-sm">
          {JSON.stringify(filterState, null, 2)}
        </pre>
      </div>
    </div>
  );
}