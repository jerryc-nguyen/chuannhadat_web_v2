# Reusable Filter Components

This document explains the new reusable filter components that can replace the repetitive patterns found in the BTS directory components.

## Overview

After analyzing all components in `/bts/`, we identified two main patterns that were repeated across multiple components:

1. **ListCheckOptions pattern** - Used in 7 components
2. **ListChips pattern** - Used in 3 components

## Reusable Components

### 1. SelectFilter.tsx

**Purpose**: Replaces all `ListCheckOptions` usage patterns

**Replaces these BTS components**:
- `CategoryType.tsx` (27 lines → reusable component)
- `BusCatType.tsx` (37 lines → reusable component)  
- `Direction.tsx` (26 lines → reusable component)
- `SortOptions.tsx` (27 lines → reusable component)
- `AggProjects.tsx` (28 lines → reusable component)
- Parts of `Area.tsx` and `Price.tsx`

**Usage**:
```tsx
import SelectFilter from './SelectFilter';

<SelectFilter
  value={currentValue}
  options={availableOptions}
  onValueChange={(value) => handleChange(value)}
  isLoading={false}
  disabled={false}
  className="custom-class"
/>
```

### 2. ChipFilter.tsx

**Purpose**: Replaces all `ListChips` usage patterns

**Replaces these BTS components**:
- `Bed.tsx` (26 lines → reusable component)
- `Bath.tsx` (26 lines → reusable component)
- Parts of `Rooms.tsx`

**Usage**:
```tsx
import ChipFilter from './ChipFilter';

<ChipFilter
  value={currentValue}
  options={availableOptions}
  onValueChange={(value) => handleChange(value)}
  isLoading={false}
  disabled={false}
  className="custom-class"
/>
```

## Benefits

### Code Reduction
- **Before**: ~200 lines of repetitive code across 10+ components
- **After**: ~50 lines in 2 reusable components
- **Reduction**: 75% less code to maintain

### Consistency
- All filter components now behave identically
- Consistent loading states, disabled states, and error handling
- Uniform styling and interaction patterns

### Maintainability
- Bug fixes in one place affect all filter components
- Easy to add new features (e.g., keyboard navigation, accessibility)
- Clear separation of concerns

### Testability
- Pure UI components are easy to unit test
- Mock props instead of complex state management
- Isolated component behavior testing

## Migration Examples

### Before (BTS/CategoryType.tsx)
```tsx
import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@common/types';

export default function CategoryType({ onSelect }: { onSelect?: (option: OptionForSelect) => void }) {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.CategoryType);

  return (
    <>
      <ListCheckOptions
        options={filterFieldOptions.categoryTypeOptions}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.CategoryType, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      />
    </>
  );
}
```

### After (Pure UI)
```tsx
import SelectFilter from '../components/SelectFilter';

interface CategoryTypeProps {
  value?: OptionForSelect;
  options: OptionForSelect[];
  onValueChange: (value: OptionForSelect | undefined) => void;
  onSelect?: (option: OptionForSelect) => void;
}

export default function CategoryType({ value, options, onValueChange, onSelect }: CategoryTypeProps) {
  return (
    <SelectFilter
      value={value}
      options={options}
      onValueChange={onValueChange}
      onSelect={onSelect}
    />
  );
}
```

## Usage with State Management

### With useFilterState

```tsx
import { useFilterState } from '../hooks/useFilterState';
import SelectFilter from '../components/SelectFilter';

function MyFilterComponent() {
  const { filterState, filterOptions, onFilterChange } = useFilterState();
  
  return (
    <SelectFilter
      value={filterState.categoryType}
      options={filterOptions.categoryTypeOptions}
      onValueChange={(value) => onFilterChange('categoryType', value)}
    />
  );
}
```

### With FilterComponentFactory

import FilterComponentFactory from '../components/FilterComponentFactory';

function MyFilterComponent() {
  const { filterState, filterOptions, onFilterChange, onLocationChange } = useFilterState();
  
  return (
    <FilterComponentFactory
      filterState={filterState}
      filterOptions={filterOptions}
      onFilterChange={onFilterChange}
      onLocationChange={onLocationChange}
      filterType={FilterFieldName.CategoryType}
    />
  );
}
```

## Next Steps

1. **Gradual Migration**: Start replacing BTS components one by one
2. **Testing**: Add unit tests for the reusable components
3. **Documentation**: Update component documentation
4. **Performance**: Monitor bundle size and performance improvements
5. **Accessibility**: Add ARIA labels and keyboard navigation

## File Structure

```
components/
├── SelectFilter.tsx          # Reusable ListCheckOptions wrapper
├── ChipFilter.tsx           # Reusable ListChips wrapper  
├── FilterComponentFactory.tsx # Factory for creating filter components
├── examples/
│   ├── CategoryTypeRefactored.tsx
│   └── BedRefactored.tsx
└── REUSABLE_COMPONENTS.md   # This documentation
```

## Conclusion

These reusable components provide a clean, maintainable solution to the repetitive patterns found in the BTS directory. They follow the pure UI architecture principles and can significantly reduce code duplication while improving consistency and testability.