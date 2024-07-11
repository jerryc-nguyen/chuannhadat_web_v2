import { useAtom } from 'jotai';
import { Button } from 'konsta/react';
import { filterStateAtom, localFilterStateAtom } from './states';
import { FilterChipOption } from './FilterChips';

export default function FooterBtsButton({
  filterOption,
}: {
  filterOption: FilterChipOption;
}) {
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const onApplyFilter = (filterOption: FilterChipOption) => {
    console.log('localFilterState', localFilterState);
    const localValue = {
      [filterOption.id]: localFilterState[filterOption.id],
    };
    console.log('localValue', localValue);
    setFilterState({ ...filterState, ...localValue });
  };

  return (
    <Button onClick={() => onApplyFilter(filterOption)}>
      Xem kết quả
    </Button>
  );
}
