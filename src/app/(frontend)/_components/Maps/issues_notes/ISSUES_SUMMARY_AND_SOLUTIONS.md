# Map Component Issues Summary & Standard Solutions

## 🎯 Overview

This document summarizes the key issues encountered in the Maps component and provides standard React patterns to fix similar problems. These are **common React performance and state management issues** that many developers face.

---

## 🚨 Issue #1: Excessive API Requests on Hover

### **Problem:**

When hovering over listing items, each hover triggered multiple unnecessary API requests to fetch markers.

```typescript
// ❌ PROBLEMATIC FLOW
User hovers → setHoveredMarker → useHighlightSelectedMarker →
add/remove layers → Leaflet fires 'moveend' → handleMapMoveEnd →
queryAndUpdateMarkers → Unnecessary API request
```

### **Root Cause:**

Highlight layer operations (adding/removing markers) were triggering Leaflet's `moveend` events, which the map interaction hook interpreted as genuine map movements requiring marker refetching.

### **Standard Solution Pattern: Event Suppression Flags**

```typescript
// ✅ SOLUTION: Use flags to suppress events during operations
const isHighlightingRef = useRef(false);

const handleMapMoveEnd = useCallback(async () => {
  // Skip if highlighting operations are in progress
  if (isHighlightingRef.current) {
    isHighlightingRef.current = false;
    console.log('🎯 Skipping marker fetch during highlight operation');
    return;
  }

  await queryAndUpdateMarkers('MAP_MOVE');
}, [queryAndUpdateMarkers]);

// In highlight operations
const updateHighlight = async () => {
  isHighlightingRef.current = true; // Set flag

  try {
    // Perform highlight operations
    map.removeLayer(highlightLayer);
    map.addLayer(newHighlightLayer);
  } finally {
    // Reset flag after operations complete
    setTimeout(() => {
      isHighlightingRef.current = false;
    }, 50);
  }
};
```

### **When to Use This Pattern:**

- Third-party libraries (Leaflet, D3, etc.) trigger events during programmatic operations
- You need to distinguish between user-initiated and code-initiated events
- Multiple event sources can trigger the same handler

---

## 🚨 Issue #2: Stale Closures in Map Callbacks

### **Problem:**

Map event callbacks were capturing stale filter values, causing searches with outdated parameters.

```typescript
// ❌ PROBLEMATIC CODE
const businessType = useAtomValue(businessTypeFilterAtom);
const categoryType = useAtomValue(categoryTypeFilterAtom);

const queryAndUpdateMarkers = useCallback(async () => {
  // These values are "stale" - they don't update when filters change
  console.log('Using filters:', { businessType, categoryType });
  const markers = await fetchMarkers(bounds, { businessType, categoryType });
}, [map]); // Missing dependencies!

// Later: businessType changes but callback still has old value
```

### **Standard Solution Pattern: Proper Dependency Arrays**

```typescript
// ✅ SOLUTION: Include all dependencies
const queryAndUpdateMarkers = useCallback(async () => {
  const markers = await fetchMarkers(bounds, { businessType, categoryType });
  // Always uses latest filter values
}, [map, businessType, categoryType]); // Include all dependencies!
```

### **Why This Works:**

1. React recreates the callback when dependencies change
2. New callback captures latest state values
3. ESLint warns about missing dependencies
4. Follows React's data flow principles

### **When to Use This Pattern:**

- Any callback that uses component state/props
- Event handlers that need latest values
- Async operations that depend on current state

---

## 🚨 Issue #3: Component Re-render Causing Marker Disappearance

### **Problem:**

Clicking markers caused all other markers to disappear due to unnecessary hook re-initialization.

```typescript
// ❌ PROBLEMATIC CODE
const { buildThumbnailUrl } = useResizeImage(); // New function reference every render

const handleMapMoveEnd = useCallback(async () => {
  // ... marker logic
}, [map, buildThumbnailUrl]); // 🚨 buildThumbnailUrl changes → callback recreated

useEffect(() => {
  // Subscribe to map events
  return () => {
    // 🚨 CLEANUP: Removes all markers when hook re-initializes
    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
    }
  };
}, [map, handleMapMoveEnd]); // handleMapMoveEnd changes → cleanup runs
```

### **Standard Solution Pattern: Selective Dependencies**

```typescript
// ✅ SOLUTION: Remove unnecessary dependencies
const { buildThumbnailUrl } = useResizeImage(); // Still gets fresh function

const handleMapMoveEnd = useCallback(async () => {
  // buildThumbnailUrl is still accessible and fresh here
  const url = buildThumbnailUrl(image); // Always works!
}, [map]); // 🎯 Removed buildThumbnailUrl from dependencies

useEffect(() => {
  // Only re-initializes when map actually changes
  return () => {
    // Cleanup only runs when truly necessary
  };
}, [map, handleMapMoveEnd]); // Much more stable
```

### **When Functions DON'T Need Dependencies:**

1. **Functions that don't capture component values**
2. **Functions that are always fresh but don't need to trigger re-runs**
3. **Stable functions (useCallback with empty deps)**

### **When Functions DO Need Dependencies:**

1. **Functions that capture changing values from component scope**
2. **Functions that should trigger re-runs when their logic changes**

---

## 📚 Standard React Patterns for Similar Issues

### **1. Event Suppression Pattern**

```typescript
const isProcessingRef = useRef(false);

const handleEvent = useCallback(() => {
  if (isProcessingRef.current) return; // Skip if processing

  isProcessingRef.current = true;
  try {
    // Handle event
  } finally {
    isProcessingRef.current = false;
  }
}, []);
```

**Use Cases:**

- Preventing duplicate API calls
- Suppressing events during animations
- Debouncing user interactions

### **2. Stable Reference Pattern**

```typescript
// For functions that don't need to trigger re-runs
const stableCallback = useCallback(() => {
  freshFunction(); // Always gets latest version
}, []); // Empty deps = stable reference
```

**Use Cases:**

- Event handlers passed to child components
- Third-party library callbacks
- Expensive operations that shouldn't re-run

### **3. Ref-Based Latest Value Pattern**

```typescript
const latestValueRef = useRef();
latestValueRef.current = currentValue;

const stableCallback = useCallback(() => {
  const value = latestValueRef.current; // Always latest
}, []); // No dependencies needed
```

**Use Cases:**

- When you need latest values but stable callback reference
- Complex async operations
- Third-party integrations

### **4. Conditional Effect Pattern**

```typescript
useEffect(() => {
  if (!shouldRun) return; // Guard clause

  // Effect logic
}, [dependency, shouldRun]);
```

**Use Cases:**

- Effects that should only run under certain conditions
- Preventing effects during loading states
- Feature flags and conditional logic

---

## 🛠️ Debugging Tools & Techniques

### **1. React DevTools Profiler**

- Identify unnecessary re-renders
- Track component update causes
- Measure performance impact

### **2. Console Logging Strategy**

```typescript
useEffect(() => {
  console.log('Effect running due to:', { dep1, dep2, dep3 });
}, [dep1, dep2, dep3]);
```

### **3. ESLint Rules**

- `react-hooks/exhaustive-deps`: Catches missing dependencies
- `react-hooks/rules-of-hooks`: Ensures proper hook usage

### **4. Custom Hook for Debugging**

```typescript
const useWhyDidYouUpdate = (name, props) => {
  const previous = useRef();
  useEffect(() => {
    if (previous.current) {
      const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
        if (previous.current[k] !== v) {
          ps[k] = [previous.current[k], v];
        }
        return ps;
      }, {});
      if (Object.keys(changedProps).length > 0) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }
    previous.current = props;
  });
};
```

---

## 🏆 Best Practices Summary

### **1. Dependency Management**

- ✅ Include all values from component scope that the effect uses
- ✅ Be selective - don't include functions that don't need to trigger re-runs
- ✅ Use ESLint but understand when to override it
- ✅ Document why certain dependencies are omitted

### **2. Performance Optimization**

- ✅ Measure first with React DevTools
- ✅ Only optimize when there's a real problem
- ✅ Understand the trade-offs of memoization
- ✅ Test thoroughly after optimizations

### **3. State Management**

- ✅ Follow React's unidirectional data flow
- ✅ Use refs for values that don't need to trigger re-renders
- ✅ Keep state as close to where it's used as possible
- ✅ Use atoms/context for truly global state

### **4. Third-Party Integration**

- ✅ Use refs to prevent unnecessary re-initializations
- ✅ Implement event suppression for programmatic operations
- ✅ Clean up resources properly in useEffect cleanup
- ✅ Handle edge cases and error states

---

## 💡 Key Takeaways

1. **These are standard React issues** - not unique to this codebase
2. **The solutions are well-established patterns** used throughout the React community
3. **Understanding React's re-render cycle is crucial** for debugging these issues
4. **Selective dependency management** is a key skill for React developers
5. **Measure before optimizing** - not all re-renders are problematic

> **Remember: The goal is not to prevent all re-renders, but to ensure they happen at the right times for the right reasons.**

---

## 📖 Further Reading

- [React Hooks FAQ - Stale Closures](https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function)
- [React useCallback Documentation](https://reactjs.org/docs/hooks-reference.html#usecallback)
- [React Performance Optimization Guide](https://reactjs.org/docs/optimizing-performance.html)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
