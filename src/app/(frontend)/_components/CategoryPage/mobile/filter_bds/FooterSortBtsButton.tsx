import useModals from '@frontend/features/layout/mobile-modals/hooks';
import useFilterState from './hooks/useFilterState';
import { Button } from '@components/ui/button';

export default function FooterSortBtsButton() {
  const { closeModals } = useModals();
  const { applySortFilter } = useFilterState();

  const onApplySort = () => {
    applySortFilter();
    closeModals();
  };

  return (
    <Button className="w-full" onClick={() => onApplySort()}>
      Áp dụng
    </Button>
  );
}
