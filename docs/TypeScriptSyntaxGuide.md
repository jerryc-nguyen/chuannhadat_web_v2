# TypeScript Syntax Guide (Tailored to This Repo)

This guide explains key TypeScript syntax and patterns used across the codebase, with practical examples drawn from real files. It’s focused on React hooks/components, URL/state sync, and common utility types.

## Quick Reference

- `type` vs `interface`
  - `type` creates aliases and supports unions/intersections.
  - `interface` is best for object shapes and can be extended/merged.
- Optional properties: `prop?: T` means the property may be missing or `undefined`.
- Default parameter values: `function fn(params: P = {}) {}` lets callers omit arguments.
- Generics: `function f<T>(arg: T): T` keeps types flexible and precise.
- Utility types: `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`.
- Union types: `A | B` — a value can be one of several types.
- Intersection types: `A & B` — a value must satisfy multiple types.
- Narrowing: runtime checks to refine types (e.g., `typeof`, `!== null`).

## Common Patterns in This Repo

- React hooks with typed params and returns
  - Example: `useFilterOperation` accepts an options object and returns methods/state.
  - Use default params so callers can pass nothing.

```ts
export interface UseFilterOperationProps {
  onFiltersChanged?: (filterState: FilterState) => void;
  setIsOpenPopover?: (open: boolean) => void;
}

// Allow calling without arguments
export const useFilterOperation = ({
  onFiltersChanged,
  setIsOpenPopover,
}: UseFilterOperationProps = {}) => {
  // ...
};
```

- Optional chaining and nullish checks

```ts
const finalOption = option?.value !== 'all' ? option : undefined;
// If option is absent, finalOption becomes undefined
```

- Typed local state with partials

```ts
type PaginationState = { pageIndex: number; pageSize: number };
const [localFilterState, setLocalFilterState] = React.useState<FilterState>({});
// `FilterState` is an object type where most fields are optional
```

- Derived state with `useMemo`

```ts
const currentFilterState = React.useMemo(() => {
  if (Object.keys(localFilterState).length === 0) {
    return selectedFilterState;
  }
  return { ...selectedFilterState, ...localFilterState };
}, [selectedFilterState, localFilterState]);
```

- Typed callbacks with `useCallback`

```ts
const handleLocalFilterChange = React.useCallback(
  (fieldName: FilterFieldName, value: OptionForSelect | undefined) => {
    setLocalFilterState((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  },
  [],
);
```

- `Record` and maps

```ts
// A map of string keys to values of type A (domain type)
const options: Record<string, A> = {};
options.content_type = contentType?.value || POSTS_TYPE_OPTION.value;
```

- Using generics in React Query

```ts
const { data, isLoading } = useQuery({
  queryKey: ['FooterBtsButton', filterParams],
  queryFn: () => searchApiV2(filterParams),
});
// `data` is typed by the return type of `searchApiV2`
```

- Typing `useRef`

```ts
const prevSearchRef = useRef<string>('');
// Ref starts as empty string and stays a string through its lifetime
```

## URL ↔ State Sync Types

- Numbers in URL params need parsing into numbers for state

```ts
const pageRaw = searchParams.get('page');
const pageNum = pageRaw !== null ? Number(pageRaw) : NaN;
const nextPageIndex = Number.isFinite(pageNum) && pageNum > 0 ? pageNum - 1 : 0;
```

- Nullable URL params

```ts
const syncObject = {
  page: pagination.pageIndex + 1,
  per_page: pagination.pageSize,
};

// Omit defaults from URL by using null (not undefined)
if (syncObject.page === 1) syncObject.page = null;
```

## Utility Types You’ll See Often

- `OptionForSelect`

  - Represents a selection value with `label`/`value` and sometimes metadata.
  - Commonly used for filters and pickers.

- `FilterState`

  - A map of optional fields: `city?: OptionForSelect`, `sort?: OptionForSelect`, etc.
  - Designed to be partially updated and merged.

- `FilterFieldName`
  - An enum-like union of string constants for filter fields.

## Component Props and Hook Signatures

- Component props are typed with interfaces or types

```ts
type LocationsListProps = {
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  onChangeCity?: (city?: OptionForSelect) => void;
  // ...
};

function LocationsList(props: LocationsListProps) {
  // ...
}
```

- Hook signatures return structured objects

```ts
export function useSearchAggs() {
  const busCatTypeOptions = useMemo(() => {
    return (searchAggs.bus_cat_types || []).map((option: A) => option);
  }, [searchAggs]);

  return { busCatTypeOptions /* ... */ };
}
```

## Common Errors and Fixes

- “Expected 1 arguments, but got 0.”
  - Cause: A hook/function was declared with a required parameter but called without one.
  - Fix: Make the parameter optional via a default: `({ ... }: Props = {})`.

```ts
// Before
export const useFilterOperation = (props: UseFilterOperationProps) => {
  /* ... */
};

// After (fix)
export const useFilterOperation = (props: UseFilterOperationProps = {}) => {
  /* ... */
};
```

- “Object is possibly ‘undefined’.”

  - Cause: Accessing properties of optional values without checking.
  - Fix: Use optional chaining or guard clauses: `value?.prop` or `if (!value) return;`.

- “Type ‘string’ is not assignable to type ‘number’.”
  - Cause: URL params are strings by default.
  - Fix: Convert with `Number()` and validate via `Number.isFinite(...)`.

## Style Tips

- Prefer explicit types for public APIs (props/returns) and inferred types for locals.
- Use union types for constrained values (e.g., `'asc' | 'desc'`).
- Avoid `any`; use generics or `unknown` with proper narrowing.
- Keep hook/object return shapes stable for ease of consumption.

## References

- TypeScript Handbook: https://www.typescriptlang.org/docs/
- React + TS Cheatsheets: https://react-typescript-cheatsheet.netlify.app/
