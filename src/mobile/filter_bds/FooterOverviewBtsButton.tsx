import { useAtom } from 'jotai';
import { Button } from 'konsta/react';
import { localFilterStateAtom } from './states';
import useModals from '@mobile/modals/hooks';
import useFilterState from './hooks/useFilterState';

export default function FooterOverviewBtsButton() {
  const { closeModals } = useModals();
  const [localFilterState] = useAtom(localFilterStateAtom);
  const { applyAllFilters } = useFilterState();
  const onApplyFilter = () => {
    applyAllFilters({ ...localFilterState });
    closeModals();
  };

  return (
    <Button onClick={onApplyFilter}>Xem kết quả overview</Button>
  );
}
