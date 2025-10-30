import React from 'react';
import ModalLayoutWithFooter from '@components/mobile-ui/ModalLayoutWithFooter';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { useFilterState } from '../../features/search/filters-v2/hooks/useFilterState';
import { useFilterOperation } from '../../features/search/filters-v2/hooks/useFilterOperation';
import FilterContentOptionsFactory from '../../features/search/filters-v2/components/FilterContentOptionsFactory';
import { Button } from '@components/ui/button';
import { FilterFieldName } from '@common/types';

export type SortOptionsModalContentResult = {
  content: React.ReactNode;
  footer: React.ReactNode;
};

/**
 * Hook that provides the content and footer for the sort options modal.
 * This follows the v2 pattern using useFilterOperation for local state management.
 */
export const useModalSortContent = (): SortOptionsModalContentResult => {
  const { closeModals } = useModals();
  const { filterState: selectedFilterState, onFieldChanged, onClearFilter } = useFilterState();

  // Use v2 filter operation for local state management and preview
  const {
    currentFilterState,
    handleLocalFilterChange,
    handleLocalLocationChange
  } = useFilterOperation({
    selectedFilterState,
    onFieldChanged,
    onClearFilter,
  });

  const handleApplySort = () => {
    // Apply the local sort state to the global filter state
    if (currentFilterState.sort) {
      onFieldChanged({
        fieldName: FilterFieldName.Sort,
        value: currentFilterState.sort,
      });
    }
    closeModals();
  };

  const content = (
    <div className="space-y-4">
      <FilterContentOptionsFactory
        filterState={currentFilterState}
        onChange={handleLocalFilterChange}
        onLocationChange={handleLocalLocationChange}
        filterType={FilterFieldName.Sort}
      />
    </div>
  );

  const footer = (
    <Button
      className="w-full"
      onClick={handleApplySort}
    >
      Áp dụng
    </Button>
  );

  return { content, footer };
};

/**
 * Modal content component for sort options that provides a consistent layout
 * with scrollable content and a fixed footer button.
 * 
 * This component follows the same pattern as ModalFilterContent but is specifically
 * designed for sort functionality.
 */
const SortOptionsModalContent: React.FC = () => {
  const { content, footer } = useModalSortContent();

  return (
    <ModalLayoutWithFooter
      content={content}
      footer={footer}
    />
  );
};

export default SortOptionsModalContent;
