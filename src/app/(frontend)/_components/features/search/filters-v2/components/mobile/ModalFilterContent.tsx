import React from 'react';
import { FilterChipOption, FilterFieldName } from '@common/types';
import { FilterState, AggregationData } from '@app/(frontend)/_components/features/search/types';
import { FilterChangeEvent } from '../../types/pure-ui-types';
import { useFilterOperation } from '../../hooks/useFilterOperation';
import FilterContentOptionsFactory from '../FilterContentOptionsFactory';
import ModalLayoutWithFooter from '@components/mobile-ui/ModalLayoutWithFooter';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { Button } from '@components/ui/button';
import { Loader2 } from 'lucide-react';


export type ModalFilterContentProps = {
  filterChipItem: FilterChipOption;
  selectedFilterState: FilterState;
  onFiltersChanged?: (filterState: FilterState) => void;
  onFieldChanged: (event: FilterChangeEvent) => void;
  onClearFilter: (filterFieldName: FilterFieldName) => void;
  // Aggregation data from useSearchAggs (for pure UI)
  aggregationData?: AggregationData;
};

export type ModalFilterContentResult = {
  content: React.ReactNode;
  footer: React.ReactNode;
};

export const useModalFilterContent = ({
  filterChipItem,
  selectedFilterState,
  onFiltersChanged,
  onFieldChanged,
  onClearFilter,
  aggregationData,
}: ModalFilterContentProps): ModalFilterContentResult => {

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

  const { closeModals } = useModals();

  const handleApplyFilter = () => {
    onApplyFilter(filterChipItem);
    closeModals();
  };

  const content = (
    <div className="space-y-4">
      <FilterContentOptionsFactory
        filterState={currentFilterState}
        onChange={handleLocalFilterChange}
        onLocationChange={handleLocalLocationChange}
        filterType={filterChipItem.id as FilterFieldName}
        aggregationData={aggregationData}
      />
    </div>
  );

  const footer = (
    <>
      <Button disabled={isPreviewLoading} className="w-full" onClick={handleApplyFilter}>
        {isPreviewLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPreviewLoading ? 'Đang tải' : `Xem ${previewCount} kết quả`}
      </Button>
    </>
  );

  return { content, footer };
};

// Keep the original component for backward compatibility
const ModalFilterContent: React.FC<ModalFilterContentProps> = (props) => {
  const { content, footer } = useModalFilterContent(props);

  return (
    <ModalLayoutWithFooter
      content={content}
      footer={footer}
    />
  );
};

export default ModalFilterContent;
