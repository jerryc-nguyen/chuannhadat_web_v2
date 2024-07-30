import { useAtom } from 'jotai';

import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import { filterStateAtom } from '@mobile/filter_bds/states';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@app/types';

export default function Price({ onSelect }: { onSelect?: Function }) {
  const [filterState] = useAtom(filterStateAtom);
  const { getLocalFieldValue, setLocalFieldValue } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.price);

  return (
    <>
      <ListCheckOptions
        options={filterState.priceOptions!}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.price, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
