import { useAtom } from 'jotai';
import { Button } from 'konsta/react';
import { localFilterStateAtom } from './states';
import useModals from '@mobile/modals/hooks';
import useFilterState from './hooks/useFilterState';

export default function FooterOverviewBtsButton() {
  const { closeModals } = useModals();
  const { applyAllFilters } = useFilterState();
  const onApplyFilter = () => {
    applyAllFilters();

    closeModals();
  };

  return (
    <Button onClick={onApplyFilter}>Xem kết quả overview</Button>
  );
}
