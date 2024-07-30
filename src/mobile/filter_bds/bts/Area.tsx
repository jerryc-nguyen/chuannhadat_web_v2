import { FilterFieldName, OptionForSelect } from '@app/types';

import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';

export default function Area({ onSelect }: { onSelect?: Function }) {
  const { getLocalFieldValue, setLocalFieldValue, filterState } =
    useFilterState();
  const value = getLocalFieldValue(FilterFieldName.area);

  return (
    <>
      <ListCheckOptions
        options={filterState.areaOptions!}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.area, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      ></ListCheckOptions>
    </>
  );
}
