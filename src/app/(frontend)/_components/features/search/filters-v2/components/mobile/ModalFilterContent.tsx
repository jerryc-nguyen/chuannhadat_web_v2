import React from 'react';
import { FilterChipOption, FilterFieldName } from '@common/types';
import { FilterState } from '@app/(frontend)/_components/features/search/filter-conditions/types';
import { FilterChangeEvent } from '../../types/pure-ui-types';
import { useFilterOperation } from '../../hooks/useFilterOperation';
import FilterContentOptionsFactory from '../FilterContentOptionsFactory';
import FooterBtsButton from './FooterBtsButton';

export type ModalFilterContentProps = {
  filterChipItem: FilterChipOption;
  selectedFilterState: FilterState;
  onFiltersChanged?: (filterState: FilterState) => void;
  onFieldChanged: (event: FilterChangeEvent) => void;
  onClearFilter: (filterFieldName: FilterFieldName) => void;
};

const ModalFilterContent: React.FC<ModalFilterContentProps> = ({
  filterChipItem,
  selectedFilterState,
  onFiltersChanged,
  onFieldChanged,
  onClearFilter,
}) => {

  // Use the filter operation hook within the modal context
  const {
    localFilterState: _localFilterState,
    setLocalFilterState: _setLocalFilterState,
    currentFilterState,
    selectedFilterText: _selectedFilterText,
    isActiveChip: _isActiveChip,
    data: _data,
    isPreviewLoading,
    previewCount,
    handleLocalFilterChange,
    handleLocalLocationChange,
    onApplyFilter,
    handleRemoveFilter: _handleRemoveFilterFromHook,
  } = useFilterOperation({
    selectedFilterState,
    onFieldChanged,
    onClearFilter,
    onFiltersChanged,
    setIsOpenPopover: () => undefined, // Not used in mobile
  });

  return (
    <div className="space-y-4">
      <FilterContentOptionsFactory
        filterState={currentFilterState}
        onChange={handleLocalFilterChange}
        onLocationChange={handleLocalLocationChange}
        filterType={filterChipItem.id as FilterFieldName}
      />
      
      <div className="mt-4">
        <FooterBtsButton
          filterOption={filterChipItem}
          onApplyFilter={onApplyFilter}
          previewCount={previewCount}
          isLoading={isPreviewLoading}
        />
      </div>
    </div>
  );
};

export default ModalFilterContent;