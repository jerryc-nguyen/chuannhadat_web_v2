# Refactoring excludeIncludedFields: From useCallback to Helper Function

## When to Use useCallback vs Helper Functions

Understanding when to use `useCallback` versus helper functions is crucial for React performance optimization and code organization.

### Use useCallback When:

```typescript
// ✅ Function passed as prop to child component
const handleClick = useCallback(
  (id: string) => {
    setSelectedId(id);
  },
  [setSelectedId],
);
```

**Why this needs useCallback:**

- Child components re-render when props change
- Without `useCallback`, a new function is created on every parent render
- This causes unnecessary child re-renders even when the function logic hasn't changed
- `useCallback` ensures the same function reference is passed unless dependencies change

```typescript
// ✅ Function used in dependency array
useEffect(() => {
  fetchData();
}, [fetchData]);
```

**Why this needs useCallback:**

- `useEffect` compares dependencies by reference, not by value
- Without `useCallback`, `fetchData` is a new function on every render
- This causes `useEffect` to run on every render, potentially causing infinite loops
- `useCallback` stabilizes the function reference so `useEffect` only runs when actual dependencies change

```typescript
// ✅ Function depends on props/state that change frequently
const processData = useCallback(
  (data) => {
    return data.filter((item) => item.category === selectedCategory);
  },
  [selectedCategory],
);
```

**Why this needs useCallback:**

- The function's behavior depends on `selectedCategory` state
- Without `useCallback`, a new function is created even when `selectedCategory` hasn't changed
- If this function is passed to child components or used in dependency arrays, it prevents unnecessary re-renders/re-executions
- `useCallback` only creates a new function when `selectedCategory` actually changes

### Use Helper Functions When:

```typescript
// ✅ Pure utility function with no external dependencies
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price);
}

// ✅ Business logic that doesn't depend on React state
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Data transformation utilities
export function excludeIncludedFields(
  params: Record<string, any>,
  includedFields: string[],
): Record<string, any> {
  // ... transformation logic
}
```

**Why these should be helper functions:**

- **No React dependencies**: These functions don't use state, props, or other React features
- **Pure functions**: Same input always produces same output, no side effects
- **Reusability**: Can be used across different components without React context
- **Testability**: Easy to unit test in isolation
- **Performance**: No React overhead, created once at module level

## Overview

This document explains the refactoring of the `excludeIncludedFields` function from an inline `useCallback` implementation within `useSyncFilterParamsToUrl` hook to a standalone utility function in the helpers directory.

## Problem with Previous Implementation

### Original Code (Anti-pattern)

```typescript
// ❌ BAD: Unnecessary useCallback for pure function
const excludeIncludedFields = useCallback(
  (params: Record<string, any>, includedFields: string[]) => {
    // ... pure function logic
  },
  [],
);
```

### Issues with useCallback Approach

1. **Unnecessary Complexity**: Added React-specific optimization for a pure utility function
2. **No Performance Benefit**: Function wasn't passed as props or used in dependency arrays
3. **Poor Separation of Concerns**: Business logic mixed with React hook concerns
4. **Reduced Testability**: Harder to unit test when embedded in a hook
5. **Code Readability**: Made the hook more complex and harder to understand

## Refactored Solution

### New Helper Function

```typescript
// ✅ GOOD: Pure utility function in helpers directory
export function excludeIncludedFields(
  params: Record<string, any>,
  includedFields: string[],
): Record<string, any> {
  // ... pure function logic
}
```

### Updated Hook

```typescript
// ✅ GOOD: Clean hook that imports and uses utility
import { excludeIncludedFields } from '../helpers/excludeIncludedFieldsHelper';

export function useSyncFilterParamsToUrl() {
  const { searchScope } = useSearchScope();

  const syncCategoryParamsToUrl = useCallback(
    async (filterParams: Record<string, any>) => {
      // ... hook logic using excludeIncludedFields directly
      const filteredParams = excludeIncludedFields(filterParams, path_included || []);
    },
    [searchScope],
  );
}
```

## Benefits of Refactoring

### 1. Better Separation of Concerns

- **Helper Function**: Pure business logic for parameter filtering
- **Hook**: React-specific state management and side effects

### 2. Improved Testability

- Can unit test `excludeIncludedFields` independently
- Easier to mock in hook tests
- Clear input/output contract

### 3. Enhanced Reusability

- Function can be imported and used in other components/hooks
- No React dependency for pure logic
- Follows single responsibility principle

### 4. Better Performance

- No unnecessary React overhead for pure functions
- Function is created once at module level, not on every render
- Simpler code execution path

### 5. Improved Code Readability

- Clear function name and purpose
- Comprehensive JSDoc documentation
- Easier to understand hook's main responsibilities
