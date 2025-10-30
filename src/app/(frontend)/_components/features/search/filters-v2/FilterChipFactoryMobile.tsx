import React from 'react';
import { Button } from '@components/ui/button';
import { FilterChipOption, FilterFieldName, OptionForSelect } from '@common/types';
import { FilterState } from '@app/(frontend)/_components/features/search/filter-conditions/types';
import { FilterChangeEvent } from './types/pure-ui-types';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { useFilterOperation } from './hooks/useFilterOperation';
import FilterContentOptionsFactory from './components/FilterContentOptionsFactory';
import { X } from 'lucide-react';
import { cn } from '@common/utils';
import { Modal } from '@frontend/features/layout/mobile-modals/states/types';
import FooterBtsButton from '@frontend/features/search/filter-conditions/mobile/FooterBtsButton';

export type FilterChipProps = {
  filterChipItem: FilterChipOption;
  selectedFilterState: FilterState;
  onFiltersChanged?: (filterState: FilterState) => void;
  onFieldChanged: (event: FilterChangeEvent) => void;
  onClearFilter: (filterFieldName: FilterFieldName) => void;
  getFilterValue: (filterFieldName: FilterFieldName) => OptionForSelect | undefined;
};

const FilterChipFactoryMobile: React.FC<FilterChipProps> = ({
  filterChipItem,
  selectedFilterState,
  onFiltersChanged,
  onFieldChanged,
  onClearFilter,
}) => {
  const { openModal } = useModals();

  // Use the extracted filter state operations hook
  const {
    localFilterState: _localFilterState,
    setLocalFilterState,
    currentFilterState,
    selectedFilterText,
    isActiveChip,
    data: _data,
    isLoading: _isLoading,
    handleLocalFilterChange,
    handleLocalLocationChange,
    onApplyFilter: _onApplyFilter,
    handleRemoveFilter: _handleRemoveFilterFromHook,
  } = useFilterOperation({
    selectedFilterState,
    onFieldChanged,
    onClearFilter,
    onFiltersChanged,
    setIsOpenPopover: () => undefined, // Not used in mobile
  });

  const buildContent = (filterChipItem: FilterChipOption) => {
    return (
      <FilterContentOptionsFactory
        filterState={currentFilterState}
        onChange={handleLocalFilterChange}
        onLocationChange={handleLocalLocationChange}
        filterType={filterChipItem.id as FilterFieldName}
      />
    );
  };

  const showFilterModal = () => {
    // Copy current filter states to local before opening modal
    setLocalFilterState({ ...selectedFilterState });

    const modalOptions: Modal = {
      name: filterChipItem.id,
      title: filterChipItem.text,
      content: buildContent(filterChipItem),
      footer: <FooterBtsButton filterOption={filterChipItem} onChange={onFiltersChanged} />,
      supportPushState: false,
    };

    openModal(modalOptions);
  };



  return (
    <Button
      className={cn(
        'w-fit cursor-default gap-x-4 rounded-full border font-semibold transition-all',
        isActiveChip(filterChipItem)
          ? 'bg-black text-white hover:bg-black'
          : 'bg-white text-black hover:bg-slate-50',
      )}
      onClick={showFilterModal}
    >
      {selectedFilterText(filterChipItem)}

      {isActiveChip(filterChipItem) && (
        <X
          onClick={(e) => {
            e.stopPropagation();
            onClearFilter(filterChipItem.id as FilterFieldName);
          }}
          className="cursor-pointer text-xl"
        />
      )}
    </Button>
  );
};

export default FilterChipFactoryMobile;
