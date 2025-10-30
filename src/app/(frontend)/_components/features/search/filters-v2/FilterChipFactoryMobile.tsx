import React from 'react';
import { Button } from '@components/ui/button';
import { FilterChipOption, FilterFieldName, OptionForSelect } from '@common/types';
import { FilterState } from '@app/(frontend)/_components/features/search/filter-conditions/types';
import { FilterChangeEvent } from './types/pure-ui-types';
import useModals from '@frontend/features/layout/mobile-modals/hooks';

import { X } from 'lucide-react';
import { cn } from '@common/utils';
import { Modal } from '@frontend/features/layout/mobile-modals/states/types';
import ModalFilterContent from './components/mobile/ModalFilterContent';

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

  // Simple helper functions for the chip display
  const selectedFilterText = (filterChipItem: FilterChipOption) => {
    // This is a simplified version - you may need to adjust based on your logic
    return filterChipItem.text;
  };

  const isActiveChip = (filterChipItem: FilterChipOption) => {
    // This is a simplified version - you may need to adjust based on your logic
    const fieldName = filterChipItem.id as FilterFieldName;
    return selectedFilterState[fieldName] !== undefined && selectedFilterState[fieldName] !== null;
  };

  const showFilterModal = () => {
    const modalContent = (
      <ModalFilterContent
        filterChipItem={filterChipItem}
        selectedFilterState={selectedFilterState}
        onFiltersChanged={onFiltersChanged}
        onFieldChanged={onFieldChanged}
        onClearFilter={onClearFilter}
      />
    );

    const modalOptions: Modal = {
      name: filterChipItem.id,
      title: filterChipItem.text,
      content: modalContent,
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
