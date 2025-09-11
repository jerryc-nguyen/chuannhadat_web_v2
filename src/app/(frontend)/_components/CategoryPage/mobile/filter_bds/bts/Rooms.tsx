import ListChips from '@components/mobile-ui/ListChips';
import { OptionForSelect, FilterFieldName } from '@common/models';
import useFilterState from '../hooks/useFilterState';

export default function Rooms() {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const curBed = getLocalFieldValue(FilterFieldName.Bed);
  const curBath = getLocalFieldValue(FilterFieldName.Bath);

  const onSelectBed = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.Bed, item);
  };

  const onSelectBath = (item: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.Bath, item);
  };

  return (
    <div>
      <p className="mb-2 font-bold">Phòng ngủ</p>

      <ListChips
        options={filterFieldOptions.roomOptions || []}
        onSelect={onSelectBed}
        value={curBed as OptionForSelect}
      />
      <br />
      <p className="mb-2 font-bold">Nhà tắm</p>

      <ListChips
        options={filterFieldOptions.roomOptions || []}
        onSelect={onSelectBath}
        value={curBath as OptionForSelect}
      />
    </div>
  );
}
