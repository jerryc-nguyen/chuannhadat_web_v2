import ListChips from '@mobile/ui/ListChips';
import { OptionForSelect, FilterFieldName } from '@models';
import useFilterState from '../hooks/useFilterState';

export default function Rooms() {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const curBed = getLocalFieldValue(FilterFieldName.bed);
  const curBath = getLocalFieldValue(FilterFieldName.bath);

  const onSelectBed = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.bed, item);
  };

  const onSelectBath = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.bath, item);
  };

  return (
    <div>
      <p className="mb-2 font-bold">Phòng ngủ</p>

      <ListChips
        options={filterFieldOptions.roomOptions || []}
        onSelect={onSelectBed}
        value={curBed}
      />
      <br />
      <p className="mb-2 font-bold">Nhà tắm</p>

      <ListChips
        options={filterFieldOptions.roomOptions || []}
        onSelect={onSelectBath}
        value={curBath}
      />
    </div>
  );
}
