import { OptionForSelect } from '@/common/types/search';
import { RoomFilterProps } from '../types/pure-ui-types';
import ChipFilter from './ChipFilter';

/**
 * Pure UI component for room filtering (bed + bath)
 * Receives all state via props and communicates changes via callbacks
 */
export default function RoomFilter({
  bed,
  bath,
  bedOptions,
  bathOptions,
  onRoomChange,
}: RoomFilterProps) {
  const handleBedChange = (value: OptionForSelect | undefined) => {
    onRoomChange({
      bed: value,
      bath,
    });
  };

  const handleBathChange = (value: OptionForSelect | undefined) => {
    onRoomChange({
      bed,
      bath: value,
    });
  };

  return (
    <div className="space-y-4">
      {/* Bed filter */}
      <div>
        <h4 className="text-sm font-medium mb-2">Phòng ngủ</h4>
        <ChipFilter
          value={bed}
          options={bedOptions}
          onValueChange={handleBedChange}
        />
      </div>

      {/* Bath filter */}
      <div>
        <h4 className="text-sm font-medium mb-2">Nhà tắm</h4>
        <ChipFilter
          value={bath}
          options={bathOptions}
          onValueChange={handleBathChange}
        />
      </div>
    </div>
  );
}