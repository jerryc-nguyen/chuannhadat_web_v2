# Filter State in Map Callbacks Issue

## The Problem

When using filter state with map event callbacks, we encountered a "stale closure" issue:

```typescript
// Read filter state from Jotai atoms
const businessType = useAtomValue(businessTypeFilterAtom);
const categoryType = useAtomValue(categoryTypeFilterAtom);

// This callback captures the initial values of businessType and categoryType
const queryAndUpdateMarkers = useCallback(async () => {
  // These values are "stale" - they don't update when filters change
  console.log('Using filters:', { businessType, categoryType });
  // ... fetch markers with stale filter values
}, [map]); // Missing dependencies warning!

// Used by map event
map.on('moveend', () => queryAndUpdateMarkers());
```

### What Happened:

1. Initial render: `businessType = null`
2. User selects filter: `businessType = 'sell'`
3. Map moves → callback still has `businessType = null` (stale)

## ❌ Non-Standard Solutions (Avoid):

1. **Using Refs to Track State** (what we initially tried)

```typescript
const filtersRef = useRef({ businessType, categoryType });
useEffect(() => {
  filtersRef.current = { businessType, categoryType };
}, [businessType, categoryType]);
```

Problems:

- Bypasses React's state management
- Makes code harder to understand
- Not reactive by design

## ✅ Standard Solution:

Simply include the state in the callback dependencies:

```typescript
const queryAndUpdateMarkers = useCallback(async () => {
  const markers = await fetchMarkers(bounds, { businessType, categoryType });
  // ... update map
}, [map, businessType, categoryType]); // Include all dependencies!
```

### Why This Works:

1. React's dependency system ensures the callback is recreated when filters change
2. Map always gets latest filter values
3. ESLint warns about missing dependencies
4. Follows React's data flow principles

### Best Practices:

1. Always include state values in dependency arrays
2. Let React handle reactivity instead of manual tracking
3. Trust the hooks dependency system
4. Use ESLint's exhaustive-deps rule

## Key Learnings:

1. **Follow React's Flow**: State changes → Callback recreates → Latest values used
2. **Trust the System**: React's dependency system is designed for this
3. **Keep It Simple**: Standard patterns are easier to maintain
4. **Use Lint Rules**: They catch these issues early

## Further Reading:

- [React Hooks FAQ - Stale Closures](https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function)
- [React useCallback Documentation](https://reactjs.org/docs/hooks-reference.html#usecallback)
