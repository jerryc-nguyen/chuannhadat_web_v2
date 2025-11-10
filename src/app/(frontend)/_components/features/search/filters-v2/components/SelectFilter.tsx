import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import { OptionForSelect } from '@common/types';
import { SelectFilterProps } from '../types/pure-ui-types';

/**
 * Reusable SelectFilter component that uses ListCheckOptions
 * This component can replace all the repetitive ListCheckOptions usage patterns
 * found in CategoryType, BusCatType, Direction, SortOptions, AggProjects, etc.
 */
export default function SelectFilter({
  value,
  options,
  onValueChange,
  onSelect,
  isLoading = false,
  disabled = false,
  className,
}: SelectFilterProps) {
  const handleSelect = (option: OptionForSelect) => {
    onValueChange(option);
    
    // Call legacy callback if provided for backward compatibility
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className={`${disabled ? 'opacity-50 pointer-events-none' : ''} ${className || ''}`}>
      <ListCheckOptions
        options={options}
        selectedOption={value}
        onSelect={handleSelect}
      />
      {isLoading && (
        <div className="flex justify-center p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}