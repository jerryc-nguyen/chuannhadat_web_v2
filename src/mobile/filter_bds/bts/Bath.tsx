import useFilterState from '../hooks/useFilterState';
import ListChips from '@mobile/ui/ListChips';
import { Block } from 'konsta/react';
import { OptionForSelect } from '@commons/interfaces';
import { FilterFieldName } from '@commons/interfaces/searchs';

export default function Bath({ onSelect }: { onSelect?: Function }) {
  const {
    getLocalFieldValue,
    setLocalFieldValue,
    filterFieldOptions,
  } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.bath);

  const onSelectOption = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.bath, item);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <>
      <Block>
        <ListChips
          options={filterFieldOptions.roomOptions || []}
          onSelect={onSelectOption}
          value={value}
        />
      </Block>
    </>
  );
}
