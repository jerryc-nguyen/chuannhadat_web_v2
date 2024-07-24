import { useAtom } from 'jotai';
import { Button } from 'konsta/react';
import { filterStateAtom, localFilterStateAtom } from './states';
import useModals from '@mobile/modals/hooks';

export default function FooterOverviewBtsButton() {
  const { closeModals } = useModals();
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const onApplyFilter = () => {
    setFilterState({ ...filterState, ...localFilterState });
    closeModals();
  };

  return (
    <Button onClick={onApplyFilter}>Xem kết quả overview</Button>
  );
}
