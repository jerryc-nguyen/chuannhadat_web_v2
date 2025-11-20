# Filters V2 Architecture

## Overview

This document describes the v2 filter architecture that addresses the "fat hook" problem from the original implementation by separating concerns into focused, reusable hooks.

## Problem with V1 (Old Flow)

The original `useFilterState` hook was doing too much:
- Managing filter state (current + local)
- Loading filter options
- URL synchronization
- API calls
- Filter actions (apply, clear, remove)
- Location handling
- Search scope management

This created a "fat hook" that was:
- Hard to test
- Difficult to maintain
- Not reusable
- Tightly coupled

## V2 Solution: Separated Concerns

### 1. `useFilterOptions` Hook

**Responsibility**: Handle loading and managing filter options

```typescript
// Static options from constants (learned from old flow)
// Dynamic options support (projects, locations, etc.)
// Helper functions to get options for specific fields
```

**Benefits**:
- Single responsibility: only handles options
- Reusable across different components
- Supports both static and dynamic options
- Type-safe with proper interfaces

### 2. `FilterContentOptionsFactory` Component

**Responsibility**: Pure UI factory for creating filter components

```typescript
// Uses useFilterOptions hook internally
// Can accept options via props or use hook defaults
// Factory pattern for different filter types
// Pure UI with clear interfaces
```

**Benefits**:
- Separation of UI and logic
- Flexible option sources (props or hook)
- Consistent behavior across filter types
- Easy to test and maintain

### 3. Future Hooks (Planned)

- `useFilterState`: Handle filter state management only
- `useFilterActions`: Handle filter actions (apply, clear, etc.)
- `useFilterSync`: Handle URL synchronization

## Architecture Comparison

### V1 (Old Flow)
```
useFilterState (Fat Hook)
├── Filter State Management
├── Filter Options Loading  
├── URL Synchronization
├── API Calls
├── Filter Actions
└── Location Handling
```

### V2 (New Architecture)
```
useFilterOptions (Focused)
├── Static Options Loading
├── Dynamic Options Support
└── Option Helper Functions

FilterContentOptionsFactory (Pure UI)
├── Component Factory Pattern
├── Props/Hook Option Sources
└── Type-Safe Interfaces

useFilterState (Planned - Focused)
├── Current State Management
└── Local State Management

useFilterActions (Planned - Focused)
├── Apply Filters
├── Clear Filters
└── Remove Filters

useFilterSync (Planned - Focused)
├── URL Synchronization
└── Search Params Management
```

## Key Improvements

1. **Single Responsibility**: Each hook has one clear purpose
2. **Reusability**: Hooks can be used independently
3. **Testability**: Each hook can be tested in isolation
4. **Maintainability**: Easier to understand and modify
5. **Type Safety**: Full TypeScript support
6. **Flexibility**: Can override behavior via props

## Usage Example

```typescript
// Using the separated architecture
function MyFilterComponent() {
  // Get filter options (static + dynamic)
  const { filterFieldOptions } = useFilterOptions({
    dynamicOptions: {
      projects: projectsFromAPI,
      cities: citiesFromAPI,
    }
  });

  // Use the factory for UI
  return (
    <FilterContentOptionsFactory
      filterState={filterState}
      filterOptions={filterFieldOptions}
      onFilterChange={handleFilterChange}
      filterType={FilterFieldName.CategoryType}
    />
  );
}
```

## Migration Path

1. ✅ **Phase 1**: Create `useFilterOptions` hook
2. ✅ **Phase 2**: Update `FilterContentOptionsFactory` to use new hook
3. 🔄 **Phase 3**: Create `useFilterState` hook (state management only)
4. 🔄 **Phase 4**: Create `useFilterActions` hook (actions only)
5. 🔄 **Phase 5**: Create `useFilterSync` hook (URL sync only)
6. 🔄 **Phase 6**: Migrate existing components to use separated hooks

## Files Structure

```
filters-v2/
├── hooks/
│   ├── useFilterOptions.ts     ✅ (Completed)
│   ├── useFilterState.ts       🔄 (Existing, needs refactor)
│   ├── useFilterActions.ts     🔄 (Planned)
│   └── useFilterSync.ts        🔄 (Planned)
├── components/
│   ├── FilterContentOptionsFactory.tsx  ✅ (Updated)
│   └── examples/
│       └── FilterV2Example.tsx          ✅ (Demo)
└── types/
    └── pure-ui-types.ts        ✅ (Existing)
```

## Benefits Achieved

- **No More Fat Hook**: Logic is distributed across focused hooks
- **Better Testing**: Each hook can be unit tested independently
- **Improved Reusability**: Hooks can be used in different contexts
- **Cleaner Interfaces**: Clear separation between UI and logic
- **Type Safety**: Full TypeScript support with proper interfaces
- **Maintainability**: Easier to understand and modify individual pieces