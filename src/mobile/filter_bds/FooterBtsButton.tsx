import { useAtom } from 'jotai';
import { Button } from 'konsta/react';
import { filterStateAtom, localFilterStateAtom } from './states';
import { FilterChipOption } from './FilterChips';
import useModals from '@mobile/modals/hooks';
import { FilterFieldName } from '@app/types';
import useFilterState from './hooks/useFilterState';

export default function FooterBtsButton({
  filterOption,
}: {
  filterOption: FilterChipOption;
}) {
  const { closeModals } = useModals();
  const { applySingleFilter } = useFilterState();

  const onApplyFilter = (filterOption: FilterChipOption) => {
    applySingleFilter(filterOption);
    closeModals();
  };

  return (
    <Button onClick={() => onApplyFilter(filterOption)}>
      Xem kết quả
    </Button>
  );
}
