import { OptionForSelect } from '@common/types';
import ChipFilter from '../ChipFilter';

interface BedRefactoredProps {
  /** Current selected value */
  value?: OptionForSelect;
  /** Available room options */
  options: OptionForSelect[];
  /** Callback when bed selection changes */
  onValueChange: (value: OptionForSelect | undefined) => void;
  /** Legacy callback for backward compatibility */
  onSelect?: (option: OptionForSelect) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Refactored Bed component using the reusable ChipFilter
 * This demonstrates how the original BTS Bed can be simplified
 * by using the pure UI ChipFilter component.
 * 
 * BEFORE (original BTS/Bed.tsx):
 * - 26 lines of code
 * - Direct useFilterState hook usage
 * - Tightly coupled to global state
 * 
 * AFTER (this refactored version):
 * - Pure UI component
 * - Receives state via props
 * - Reuses ChipFilter logic
 * - Much cleaner and testable
 */
export default function BedRefactored({
  value,
  options,
  onValueChange,
  onSelect,
  isLoading = false,
  disabled = false,
}: BedRefactoredProps) {
  return (
    <ChipFilter
      value={value}
      options={options}
      onValueChange={onValueChange}
      onSelect={onSelect}
      isLoading={isLoading}
      disabled={disabled}
    />
  );
}