import { useAtom } from 'jotai';
import { Button } from 'konsta/react';
import { filterStateAtom, localFilterStateAtom } from './states';
import { FilterChipOption } from './FilterChips';
import useModals from '@mobile/modals/hooks';

export default function FooterBtsButton({
  filterOption,
}: {
  filterOption: FilterChipOption;
}) {
  const { closeModal } = useModals();
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const onApplyFilter = (filterOption: FilterChipOption) => {
    const localValue = {
      // @ts-ignore
      [filterOption.id]: localFilterState[filterOption.id],
    };
    setFilterState({ ...filterState, ...localValue });
    closeModal();
  };

  return (
    <Button onClick={() => onApplyFilter(filterOption)}>
      Xem kết quả
    </Button>
  );
}
