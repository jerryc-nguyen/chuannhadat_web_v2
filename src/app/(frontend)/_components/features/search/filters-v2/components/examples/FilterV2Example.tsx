import React, { useState } from 'react';
import { FilterFieldName, OptionForSelect } from '@common/types';
import { FilterState } from '../../../filter-conditions/types';
import FilterContentOptionsFactory from '../FilterContentOptionsFactory';
import useFilterOptions from '../../hooks/useFilterOptions';

/**
 * Example component demonstrating the new v2 filter architecture
 * 
 * This shows how to use the separated hooks:
 * - useFilterOptions: Handles filter options loading
 * - FilterContentOptionsFactory: Pure UI factory component
 * 
 * Benefits of v2 architecture:
 * - Separated concerns (no fat hook)
 * - Reusable hooks
 * - Better testability
 * - Cleaner component interfaces
 */
export default function FilterV2Example() {
  // Local state for demonstration
  const [filterState, setFilterState] = useState<FilterState>({
    businessType: undefined,
    categoryType: undefined,
    bed: undefined,
    bath: undefined,
    direction: undefined,
  });

  // Use the separated hook for filter options
  const { hasOptionsForField } = useFilterOptions({
    dynamicOptions: {
      // Example dynamic options that could come from API
      projects: [
        { value: 1, text: 'Vinhomes Central Park' },
        { value: 2, text: 'Landmark 81' },
      ],
      busCatTypes: [
        { value: 'apartment', text: 'Căn hộ' },
        { value: 'house', text: 'Nhà riêng' },
      ],
    }
  });

  // Example selected options for the builder
  const selectedOptions: OptionForSelect[] = [
    { value: 'sell', text: 'Bán' },
    { value: 'can_ho_chung_cu', text: 'Căn hộ chung cư' },
  ];

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
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Filter V2 Architecture Example</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Business Type Filter */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Business Type</h3>
          {hasOptionsForField(FilterFieldName.BusinessType) && (
            <FilterContentOptionsFactory
              filterState={filterState}
              filterOptions={selectedOptions}
              onChange={handleFilterChange}
              onLocationChange={handleLocationChange}
              filterType={FilterFieldName.BusinessType}
            />
          )}
        </div>

        {/* Category Type Filter */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Category Type</h3>
          {hasOptionsForField(FilterFieldName.CategoryType) && (
            <FilterContentOptionsFactory
              filterState={filterState}
              filterOptions={selectedOptions}
              onChange={handleFilterChange}
              onLocationChange={handleLocationChange}
              filterType={FilterFieldName.CategoryType}
            />
          )}
        </div>

        {/* Bedrooms Filter */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Bedrooms</h3>
          {hasOptionsForField(FilterFieldName.Bed) && (
            <FilterContentOptionsFactory
              filterState={filterState}
              filterOptions={selectedOptions}
              onChange={handleFilterChange}
              onLocationChange={handleLocationChange}
              filterType={FilterFieldName.Bed}
            />
          )}
        </div>

        {/* Direction Filter */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Direction</h3>
          {hasOptionsForField(FilterFieldName.Direction) && (
            <FilterContentOptionsFactory
              filterState={filterState}
              filterOptions={selectedOptions}
              onChange={handleFilterChange}
              onLocationChange={handleLocationChange}
              filterType={FilterFieldName.Direction}
            />
          )}
        </div>
      </div>

      {/* Current Filter State Display */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current Filter State:</h3>
        <pre className="text-sm">{JSON.stringify(filterState, null, 2)}</pre>
      </div>

      {/* Architecture Benefits */}
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">V2 Architecture Benefits:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Separated Concerns:</strong> useFilterOptions handles only option loading</li>
          <li><strong>No Fat Hook:</strong> Logic is distributed across focused hooks</li>
          <li><strong>Reusable:</strong> Hooks can be used independently in different components</li>
          <li><strong>Testable:</strong> Each hook can be tested in isolation</li>
          <li><strong>Flexible:</strong> Can override options via props or use hook defaults</li>
          <li><strong>Type Safe:</strong> Full TypeScript support with proper interfaces</li>
        </ul>
      </div>
    </div>
  );
}
