import { useAtom } from 'jotai';
import { Button } from 'konsta/react';
import { filterStateAtom, localFilterStateAtom } from './states';
import { FilterChipOption } from './FilterChips';
import useModals from '@mobile/modals/hooks';
import { FilterFieldName } from './types';

export default function FooterBtsButton({
  filterOption,
}: {
  filterOption: FilterChipOption;
}) {
  const { closeModals } = useModals();
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const onApplyFilter = (filterOption: FilterChipOption) => {
    let localValue: Record<string, any> = {};

    if (filterOption.id == FilterFieldName.locations) {
      localValue = {
        city: localFilterState.city,
        district: localFilterState.district,
        ward: localFilterState.ward,
      };
    } else if (filterOption.id == FilterFieldName.rooms) {
      if (localFilterState.bed) {
        localValue.bed = localFilterState.bed;
      }
      if (localFilterState.bath) {
        localValue.bath = localFilterState.bath;
      }
    } else {
      localValue = {
        // @ts-ignore
        [filterOption.id]: localFilterState[filterOption.id],
      };
    }

    setFilterState({ ...filterState, ...localValue });
    closeModals();
  };

  return (
    <Button onClick={() => onApplyFilter(filterOption)}>
      Xem kết quả
    </Button>
  );
}
