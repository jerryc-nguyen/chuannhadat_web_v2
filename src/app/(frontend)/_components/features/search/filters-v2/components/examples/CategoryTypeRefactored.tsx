import { OptionForSelect } from '@common/types';
import SelectFilter from '../SelectFilter';

interface CategoryTypeRefactoredProps {
  /** Current selected value */
  value?: OptionForSelect;
  /** Available category options */
  options: OptionForSelect[];
  /** Callback when category changes */
  onValueChange: (value: OptionForSelect | undefined) => void;
  /** Legacy callback for backward compatibility */
  onSelect?: (option: OptionForSelect) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Refactored CategoryType component using the reusable SelectFilter
 * This demonstrates how the original BTS CategoryType can be simplified
 * by using the pure UI SelectFilter component.
 * 
 * BEFORE (original BTS/CategoryType.tsx):
 * - 27 lines of code
 * - Direct useFilterState hook usage
 * - Tightly coupled to global state
 * 
 * AFTER (this refactored version):
 * - Pure UI component
 * - Receives state via props
 * - Reuses SelectFilter logic
 * - Much cleaner and testable
 */
export default function CategoryTypeRefactored({
  value,
  options,
  onValueChange,
  onSelect,
  isLoading = false,
  disabled = false,
}: CategoryTypeRefactoredProps) {
  return (
    <SelectFilter
      value={value}
      options={options}
      onValueChange={onValueChange}
      onSelect={onSelect}
      isLoading={isLoading}
      disabled={disabled}
    />
  );
}