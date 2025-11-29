# Duplicate Console Logs Issue - FilterChipFactoryDesktop

## Problem Description

The `FilterChipFactoryDesktop` component is logging `filterParams` multiple times with identical values:

```
filterParams {hinh_thuc: 'mua_ban', city_id: 1, district_id: 55, ward_id: '8637'}
filterParams {hinh_thuc: 'mua_ban', city_id: 1, district_id: 55, ward_id: '8637'}
filterParams {hinh_thuc: 'mua_ban', city_id: 1, district_id: 55, ward_id: '8637'}
...
```

## Root Cause Analysis

### Why This Happens

1. **Multiple Component Instances**: `FilterChipFactoryDesktop` is rendered in a loop in `PostControlsV2.tsx`:

   ```tsx
   {
     chipOptions.map((item: FilterChipOption) => (
       <FilterChipFactoryDesktop
         key={item.id}
         filterChipItem={item}
         selectedFilterState={filterState}
         // ... other props
       />
     ));
   }
   ```

2. **Each Instance Logs**: Every chip component calculates and logs the same `filterParams` because they all share the same `selectedFilterState`.

3. **Normal Behavior**: This is actually expected behavior - each chip needs to know the current filter state to determine if it should be active and what data to fetch.

## Solution Approaches

### Approach 1: Move Logging to Parent Component (Recommended)

**Pros:**

- Single source of truth for logging
- Eliminates duplicate logs
- Maintains current architecture

**Implementation:**

```tsx
// In PostControlsV2.tsx
const filterParams = React.useMemo(() => {
  return buildFriendlyParams(filterState);
}, [filterState]);

// Log only once in parent
React.useEffect(() => {
  console.log('filterParams', filterParams);
}, [filterParams]);
```

### Approach 2: Conditional Logging in Child Components

**Pros:**

- Minimal changes to existing code
- Keeps logging close to where data is used

**Implementation:**

```tsx
// In FilterChipFactoryDesktop.tsx
React.useEffect(() => {
  // Only log for the first chip (e.g., BusinessType)
  if (filterChipItem.id === FilterFieldName.BusinessType) {
    console.log('filterParams', filterParams);
  }
}, [filterParams, filterChipItem.id]);
```

### Approach 3: Global State Management

**Pros:**

- Centralized filter state management
- Better performance
- Eliminates redundant calculations

**Implementation:**

- Use Context or Redux to manage filter state globally
- Components subscribe to changes
- Single calculation and logging point

## Current Implementation Status

We implemented **Approach 1** with the following optimizations:

1. **Memoized filterParams calculation**:

   ```tsx
   const filterParams = React.useMemo(() => {
     return buildFriendlyParams(currentFilterState);
   }, [currentFilterState]);
   ```

2. **Deep comparison for logging**:

   ```tsx
   const prevFilterParamsRef = React.useRef<Record<string, string>>({});
   React.useEffect(() => {
     const hasChanged =
       JSON.stringify(prevFilterParamsRef.current) !== JSON.stringify(filterParams);
     if (hasChanged) {
       console.log('filterParams', filterParams);
       prevFilterParamsRef.current = filterParams;
     }
   }, [filterParams]);
   ```

3. **Optimized state merging**:
   ```tsx
   const currentFilterState = React.useMemo(() => {
     if (Object.keys(localFilterState).length === 0) {
       return selectedFilterState;
     }
     return { ...selectedFilterState, ...localFilterState };
   }, [selectedFilterState, localFilterState]);
   ```

## Performance Considerations

- **Memoization**: Prevents unnecessary recalculations
- **Deep Comparison**: Ensures logging only when actual values change
- **Reference Optimization**: Avoids creating new objects when not needed

## Similar Issue: useQueryPostsV2 Hook

### Problem
The `useQueryPostsV2` hook was also logging duplicate messages:
```
🔍 useQueryPostsV2 - Called with filterParams: {hinh_thuc: 'mua_ban', city_id: 1, ...}
🔍 useQueryPostsV2 - Called with filterParams: {hinh_thuc: 'mua_ban', city_id: 1, ...}
🔍 useQueryPostsV2 - Called with filterParams: {hinh_thuc: 'mua_ban', city_id: 1, ...}
```

### Root Cause
- The hook was logging on every function call
- Component re-renders caused the hook to be called multiple times with the same parameters
- No conditional logging was implemented

### Solution Applied
Implemented conditional logging using `useRef` and `useEffect` with deep comparison:

```typescript
// Use ref to track previous filterParams for deep comparison
const prevFilterParamsRef = useRef<string>('');

// Only log when filterParams actually change (deep comparison)
useEffect(() => {
  const currentFilterParamsStr = JSON.stringify(filterParams);
  if (prevFilterParamsRef.current !== currentFilterParamsStr) {
    console.log('🔍 useQueryPostsV2 - Called with filterParams:', filterParams);
    prevFilterParamsRef.current = currentFilterParamsStr;
  }
}, [filterParams]);
```

This ensures the hook only logs when the `filterParams` object content actually changes, not just when the component re-renders.

## Alternative Solutions for Future

1. **React Query Integration**: Cache filter results at a higher level
2. **Debounced Logging**: Only log after a delay to batch rapid changes
3. **Development-only Logging**: Remove logs in production builds
4. **Structured Logging**: Use a proper logging library with levels and filtering

## Conclusion

The "duplicate" logs are actually normal behavior due to the component architecture. Each filter chip needs access to the current filter state. The solution focuses on optimizing when and how we log, rather than changing the fundamental architecture.
