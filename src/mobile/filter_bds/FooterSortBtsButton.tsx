import { Button } from 'konsta/react';
import useModals from '@mobile/modals/hooks';
import useFilterState from './hooks/useFilterState';

export default function FooterSortBtsButton() {
  const { closeModals } = useModals();
  const { applySort } = useFilterState();

  const onApplySort = () => {
    applySort();
    closeModals();
  };

  return <Button onClick={() => onApplySort()}>Áp dụng</Button>;
}
