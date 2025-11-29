# React Components Re-render Issue: Map Markers Disappearing

## 🎯 The Problem

When clicking on map markers, all other markers would disappear/blink. This is a **common React performance issue** that many developers encounter.

## 🔍 Root Cause Analysis

### What Was Happening:

1. **User clicks marker** → State changes in Jotai atom
2. **Component re-renders** → All hooks get fresh function references
3. **useResizeImage hook** → Returns new `buildThumbnailUrl` function reference
4. **useMapInteractionHook** → Detects dependency change and re-initializes
5. **Cleanup function runs** → Removes all markers from map
6. **New markers created** → But timing issues cause them to appear missing

### The Dependency Chain:

```typescript
// ❌ PROBLEMATIC CODE
const { buildThumbnailUrl } = useResizeImage(); // New function reference every render

const handleMapMoveEnd = useCallback(async () => {
  // ... marker logic
}, [map, buildThumbnailUrl]); // 🚨 This causes re-initialization!

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

## 🛠️ The Solution

### Standard React Optimization Pattern:

```typescript
// ✅ FIXED CODE
const { buildThumbnailUrl } = useResizeImage(); // Still gets fresh function

const handleMapMoveEnd = useCallback(async () => {
  // buildThumbnailUrl is still accessible and fresh here
}, [map]); // 🎯 Removed buildThumbnailUrl from dependencies

useEffect(() => {
  // Only re-initializes when map actually changes
  return () => {
    // Cleanup only runs when truly necessary
  };
}, [map, handleMapMoveEnd]); // Much more stable
```

## 📚 Key Learning Points for Beginners

### 1. **Function References in React**

```javascript
// Every render creates new functions
const MyComponent = () => {
  const handleClick = () => {}; // 🚨 New function every render

  // This causes child components to re-render unnecessarily
  return <Child onClick={handleClick} />;
};

// Solution: useCallback for stable references
const MyComponent = () => {
  const handleClick = useCallback(() => {}, []); // ✅ Stable reference
  return <Child onClick={handleClick} />;
};
```

### 2. **Dependency Arrays Matter**

```javascript
// ❌ Over-dependencies cause unnecessary re-runs
useEffect(() => {
  // Some effect
}, [value1, value2, functionThatChangesEveryRender]);

// ✅ Only include what actually matters
useEffect(() => {
  // functionThatChangesEveryRender is still accessible
  // but doesn't trigger re-runs
}, [value1, value2]);
```

### 3. **When Functions Don't Need to be Dependencies**

```javascript
const MyComponent = () => {
  const { someFunction } = useCustomHook(); // Changes every render

  useEffect(() => {
    // someFunction is fresh and works fine here
    someFunction();
  }, []); // ✅ Don't include someFunction if it doesn't need to trigger re-runs
};
```

## 🏷️ Issue Classification

### **Type: STANDARD React Performance Issue**

- ✅ Very common in React applications
- ✅ Happens with custom hooks that return functions
- ✅ Classic dependency array optimization problem
- ✅ Well-documented pattern in React community

### **Difficulty Level: Intermediate**

- **For Beginners**: Tricky to debug (effects seem unrelated to cause)
- **For Experienced**: Standard optimization pattern
- **Detection**: Requires understanding React's re-render cycle

## 🔧 Standard Solutions & Patterns

### 1. **Remove Unnecessary Dependencies**

```javascript
// If the function is always fresh and doesn't need to trigger re-runs
useEffect(() => {
  freshFunction(); // Still works!
}, []); // Remove freshFunction from deps
```

### 2. **Use useCallback for Stable References**

```javascript
const stableFunction = useCallback(originalFunction, [realDependencies]);
```

### 3. **Use useRef for Mutable References**

```javascript
const functionRef = useRef();
functionRef.current = freshFunction; // Always up to date

useEffect(() => {
  functionRef.current(); // Always calls latest version
}, []); // No dependencies needed
```

### 4. **Memoize Hook Results**

```javascript
const { expensiveFunction } = useCustomHook();
const memoizedFunction = useMemo(
  () => expensiveFunction,
  [
    /* real deps */
  ],
);
```

## 🎯 Prevention Tips

### **For Hook Authors:**

```javascript
// ✅ Return stable references when possible
export const useMyHook = () => {
  const stableFunction = useCallback((params) => {
    // implementation
  }, []); // Stable if no dependencies

  return { stableFunction };
};
```

### **For Hook Consumers:**

```javascript
// ✅ Be selective with dependencies
const { someFunction } = useMyHook();

useEffect(() => {
  someFunction(); // Fresh function, works fine
}, []); // Don't include someFunction unless it needs to trigger re-runs
```

## ❓ Why Functions in Dependencies? (Common Confusion)

### **The React Rule: "Include everything you use from component scope"**

```javascript
const MyComponent = ({ userId }) => {
  const [data, setData] = useState(null);

  // This function captures userId from props
  const fetchUserData = () => {
    api.getUser(userId).then(setData);
  };

  useEffect(() => {
    fetchUserData(); // Uses function from component scope
  }, [fetchUserData]); // ❓ Why include the function?

  return <div>{data?.name}</div>;
};
```

### **The Problem: Stale Closures**

```javascript
// ❌ DANGEROUS: Missing function dependency
const MyComponent = ({ userId }) => {
  const fetchUserData = () => {
    api.getUser(userId).then(setData); // userId might be stale!
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Missing fetchUserData dependency

  // When userId changes from 1 to 2:
  // - Component re-renders with new userId (2)
  // - fetchUserData gets new userId (2)
  // - But useEffect doesn't re-run (empty deps)
  // - Still using old fetchUserData that captures userId (1)
  // - Fetches wrong user data!
};
```

### **When Functions DON'T Need Dependencies**

#### **1. Functions that don't capture component values:**

```javascript
// ✅ No dependency needed - function doesn't use component values
const MyComponent = () => {
  const { apiCall } = useExternalHook(); // External function

  useEffect(() => {
    apiCall(); // Doesn't capture anything from component
  }, []); // Safe to omit apiCall
};
```

#### **2. Functions that are always fresh but don't need to trigger re-runs:**

```javascript
// ✅ Our map case - function is fresh but doesn't need to trigger effects
const MyComponent = () => {
  const { buildThumbnailUrl } = useResizeImage(); // Always fresh

  useEffect(() => {
    // buildThumbnailUrl is always the latest version
    // But we don't want to re-run effect when it changes
    const processMarkers = () => {
      markers.forEach((marker) => {
        const url = buildThumbnailUrl(marker.image); // Always works
      });
    };
  }, []); // Intentionally omit buildThumbnailUrl
};
```

#### **3. Stable functions (useCallback with empty deps):**

```javascript
// ✅ Stable function doesn't need dependency
const MyComponent = () => {
  const stableFunction = useCallback(() => {
    // No dependencies from component scope
  }, []);

  useEffect(() => {
    stableFunction();
  }, []); // Safe - function never changes
};
```

### **When Functions DO Need Dependencies**

#### **1. Functions that capture changing values:**

```javascript
// ✅ Function captures userId - needs dependency
const MyComponent = ({ userId }) => {
  const fetchUser = () => {
    api.getUser(userId); // Captures userId
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // Must include - userId might change
};
```

#### **2. Functions that should trigger re-runs:**

```javascript
// ✅ Want to re-run when validation logic changes
const MyComponent = ({ validationRules }) => {
  const validateData = (data) => {
    return validationRules.every((rule) => rule(data));
  };

  useEffect(() => {
    const isValid = validateData(currentData);
    setIsValid(isValid);
  }, [validateData]); // Re-validate when validation logic changes
};
```

## 🚨 Common Mistakes

1. **Blindly following ESLint exhaustive-deps rule** (sometimes you know better)
2. **Not understanding when functions actually need to trigger re-runs**
3. **Including functions that don't capture component values**
4. **Over-memoizing everything** (performance overhead)
5. **Not using React DevTools Profiler** to identify re-render causes

## 🏆 Best Practices

1. **Measure first** - Use React DevTools to identify actual performance issues
2. **Be selective** - Only optimize when there's a real problem
3. **Understand the trade-offs** - Memoization has its own costs
4. **Test thoroughly** - Ensure optimizations don't break functionality
5. **Document why** - Explain why certain dependencies are omitted

---

## 💡 Key Takeaway

> **The function reference changing every render is normal React behavior. The key is understanding when that change should trigger side effects and when it shouldn't.**

This is a **standard React optimization pattern** that every React developer should understand. The solution is **well-established** and **widely used** in the React community.
