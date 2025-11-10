import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import { OptionForSelect } from '@common/types';
import { FilterComponentProps } from '../types/pure-ui-types';

interface CategoryTypeProps extends FilterComponentProps {
  /** Additional callback for legacy compatibility */
  onSelect?: (option: OptionForSelect) => void;
}

/**
 * Pure UI component for category type selection
 * Receives all state via props and communicates changes via callbacks
 */
export default function CategoryType({
  value,
  options,
  onValueChange,
  onSelect,
  isLoading = false,
  disabled = false,
}: CategoryTypeProps) {
  const handleSelect = (option: OptionForSelect) => {
    onValueChange(option);
    
    // Call legacy callback if provided
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
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