import ListChips from '@components/mobile-ui/ListChips';
import { OptionForSelect } from '@common/types';
import { ChipFilterProps } from '../types/pure-ui-types';

/**
 * Reusable ChipFilter component that uses ListChips
 * This component can replace all the repetitive ListChips usage patterns
 * found in Bed, Bath, and Rooms components.
 */
export default function ChipFilter({
  value,
  options,
  onValueChange,
  onSelect,
  isLoading = false,
  disabled = false,
  className,
}: ChipFilterProps) {
  const handleSelect = (option: OptionForSelect) => {
    onValueChange(option);
    
    // Call legacy callback if provided for backward compatibility
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className={`${disabled ? 'opacity-50 pointer-events-none' : ''} ${className || ''}`}>
      <ListChips
        options={options}
        onSelect={handleSelect}
        value={value}
      />
      {isLoading && (
        <div className="flex justify-center p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}