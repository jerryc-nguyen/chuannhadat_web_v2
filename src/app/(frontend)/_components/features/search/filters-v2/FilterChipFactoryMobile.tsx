import React from 'react';
import { Button } from '@components/ui/button';
import { FilterChipOption, FilterFieldName } from '@common/types';
import { FilterState, AggregationData } from '@app/(frontend)/_components/features/search/types';
import useModals from '@frontend/features/layout/mobile-modals/hooks';

import { X } from 'lucide-react';
import { cn } from '@common/utils';
import { Modal } from '@frontend/features/layout/mobile-modals/states/types';
import ModalFilterContent from './components/mobile/ModalFilterContent';
import { useFilterOperation } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useFilterOperation';

export type FilterChipProps = {
  filterChipItem: FilterChipOption;
  onFiltersChanged?: (filterState: FilterState) => void;
  aggregationData?: AggregationData;
};

const FilterChipFactoryMobile: React.FC<FilterChipProps> = ({
  filterChipItem,
  onFiltersChanged,
  aggregationData,
}) => {
  const { openModal } = useModals();
  const { selectedFilterText, isActiveChip, clearFilter } = useFilterOperation({
    onFiltersChanged
  });

  const showFilterModal = () => {
    const modalContent = (
      <ModalFilterContent
        filterChipItem={filterChipItem}
        onFiltersChanged={onFiltersChanged}
        aggregationData={aggregationData}
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
        'w-fit cursor-pointer gap-x-4 rounded-full border px-4 font-semibold transition-all',
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
            clearFilter(filterChipItem.id as FilterFieldName);
          }}
          className="cursor-pointer text-xl"
        />
      )}
    </Button>
  );
};

export default FilterChipFactoryMobile;
