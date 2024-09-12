import useModals from '@mobile/modals/hooks';
import useFilterState from './hooks/useFilterState';
import { Button } from '@components/ui/button';

export default function FooterSortBtsButton() {
  const { closeModals } = useModals();
  const { applySort } = useFilterState();

  const onApplySort = () => {
    applySort();
    closeModals();
  };

  return (
    <Button className="w-full" onClick={() => onApplySort()}>
      Áp dụng
    </Button>
  );
}
