# Function Reference Changes Issue: The `buildThumbnailUrl` Case Study

## 🎯 The Problem

When hovering over listing items, each hover triggered multiple unnecessary API requests. The root cause was **function reference changes** causing dependency arrays to trigger effects unnecessarily.

## 🔍 Root Cause Analysis

### **The Problematic Chain:**

```typescript
// ❌ PROBLEMATIC CODE
export default function useResizeImage() {
  // This creates a NEW function on every render
  const buildThumbnailUrl = ({ imageUrl, width, ratio }) => {
    return resize({ imageUrl, sizes: { width, height, f: 'webp', q: 80 } });
  };

  return { buildThumbnailUrl }; // 🚨 NEW function reference every time!
}

// In our map hook:
const { buildThumbnailUrl } = useResizeImage(); // NEW function each render

const queryAndUpdateMarkers = useCallback(
  async (source = 'unknown') => {
    // buildThumbnailUrl works perfectly here
    const markers = await fetchMarkers(bounds, { businessType, categoryType });
    // Process markers with buildThumbnailUrl...
  },
  [map, businessType, categoryType, buildThumbnailUrl],
); // 🚨 Causes recreation!

// Filter change effect:
useEffect(() => {
  queryAndUpdateMarkers('FILTER_CHANGE');
}, [businessType, categoryType, map, queryAndUpdateMarkers]); // 🚨 Re-runs on every hover!
```

### **What Happened on Every Hover:**

```
1. User hovers → Component re-renders
2. useResizeImage() → Returns NEW buildThumbnailUrl function
3. queryAndUpdateMarkers → Recreated (buildThumbnailUrl dependency changed)
4. Filter effect → Re-runs (queryAndUpdateMarkers dependency changed)
5. API request → Triggered with FILTER_CHANGE
6. Highlight operations → Also trigger MAP_MOVE events
7. More API requests → Performance degradation
```

## 🛠️ The Solution

### **Remove Unnecessary Function Dependency:**

```typescript
// ✅ SOLUTION: Remove unnecessary function dependency
const queryAndUpdateMarkers = useCallback(
  async (source = 'unknown') => {
    // buildThumbnailUrl is still accessible and always fresh!
    const markers = await fetchMarkers(bounds, { businessType, categoryType });
    // Process markers with buildThumbnailUrl... (works perfectly!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },
  [map, businessType, categoryType],
); // Removed buildThumbnailUrl

// Now the filter effect is stable:
useEffect(() => {
  queryAndUpdateMarkers('FILTER_CHANGE');
}, [businessType, categoryType, map, queryAndUpdateMarkers]); // Only runs when needed!
```

### **Why This Fix Works:**

1. **Function is still fresh**: `buildThumbnailUrl` is always the latest version inside the callback
2. **Function works perfectly**: No functionality is lost
3. **No unnecessary re-runs**: Callback only recreates when map/filters actually change
4. **Performance restored**: No more API spam on hover

## 🔍 How to Detect Function Reference Issues

### **Method 1: Console Logging with useRef**

```typescript
import { useRef, useEffect } from 'react';

const DetectFunctionChanges = () => {
  const { buildThumbnailUrl } = useResizeImage();
  const previousFunctionRef = useRef(buildThumbnailUrl);

  useEffect(() => {
    if (previousFunctionRef.current !== buildThumbnailUrl) {
      console.log('🚨 buildThumbnailUrl function reference changed!');
      console.log('Previous:', previousFunctionRef.current);
      console.log('Current:', buildThumbnailUrl);
    } else {
      console.log('✅ buildThumbnailUrl function reference is stable');
    }

    previousFunctionRef.current = buildThumbnailUrl;
  }, [buildThumbnailUrl]);

  return <div>Check console for function reference changes</div>;
};
```

### **Method 2: Custom Debug Hook**

```typescript
const useWhyDidYouUpdate = (name: string, props: Record<string, any>) => {
  const previous = useRef<Record<string, any>>();

  useEffect(() => {
    if (previous.current) {
      const changedProps: Record<string, [any, any]> = {};

      Object.keys({ ...previous.current, ...props }).forEach((key) => {
        if (previous.current![key] !== props[key]) {
          changedProps[key] = [previous.current![key], props[key]];
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log('[why-did-you-update]', name, changedProps);

        // Special handling for functions
        Object.entries(changedProps).forEach(([key, [oldVal, newVal]]) => {
          if (typeof oldVal === 'function' && typeof newVal === 'function') {
            console.log(`🔄 Function "${key}" reference changed`);
          }
        });
      }
    }
    previous.current = props;
  });
};

// Usage:
const { buildThumbnailUrl } = useResizeImage();
useWhyDidYouUpdate('MyComponent', { buildThumbnailUrl });
```

### **Method 3: ESLint Warnings (And Why to Ignore Them)**

```typescript
// ESLint exhaustive-deps rule will warn:
const callback = useCallback(() => {
  buildThumbnailUrl(params);
}, []); // ⚠️ Warning: Missing dependency 'buildThumbnailUrl'

// ❌ DON'T blindly follow ESLint:
const callback = useCallback(() => {
  buildThumbnailUrl(params);
}, [buildThumbnailUrl]); // 🚨 Now callback recreates every render!

// ✅ DO ignore ESLint when you know better:
const callback = useCallback(() => {
  buildThumbnailUrl(params); // Always works, always fresh
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Intentionally omit buildThumbnailUrl
```

### **Why ESLint Gets It Wrong:**

1. **ESLint can't distinguish** between functions that capture state vs functions that don't
2. **ESLint assumes all dependencies matter** - but function references usually don't
3. **ESLint prioritizes correctness over performance** - but causes performance issues
4. **ESLint doesn't understand your intent** - you know when functions should trigger re-runs

### **When to Override ESLint:**

```typescript
// ✅ OVERRIDE ESLint for functions from hooks:
const { apiCall, buildUrl, processData } = useCustomHook();

useEffect(() => {
  const result = processData(apiCall(), buildUrl());
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // All functions are fresh, no need to include them

// ✅ FOLLOW ESLint for values that matter:
useEffect(() => {
  fetchData(userId, filters);
}, [userId, filters]); // These values should trigger re-runs
```

## 🎯 When to Include vs Omit Function Dependencies

> **💡 Key Insight: In 95% of cases, you should NOT include functions as dependencies!**

### **❌ Functions That DON'T Need Dependencies (Most Common):**

#### **1. Functions that don't capture component values:**

```typescript
const MyComponent = () => {
  const { apiCall } = useExternalHook(); // External function

  useEffect(() => {
    apiCall(); // Doesn't capture anything from component
  }, []); // Safe to omit apiCall
};
```

#### **2. Functions that are always fresh but don't need to trigger re-runs:**

```typescript
const MyComponent = () => {
  const { buildThumbnailUrl } = useResizeImage(); // Always fresh

  useEffect(() => {
    // buildThumbnailUrl is always the latest version
    const processMarkers = () => {
      markers.forEach((marker) => {
        const url = buildThumbnailUrl(marker.image); // Always works
      });
    };
  }, []); // Intentionally omit buildThumbnailUrl
};
```

#### **3. Stable functions (useCallback with empty deps):**

```typescript
const MyComponent = () => {
  const stableFunction = useCallback(() => {
    // No dependencies from component scope
  }, []);

  useEffect(() => {
    stableFunction();
  }, []); // Safe - function never changes
};
```

### **✅ Functions That DO Need Dependencies (Rare Cases):**

> **⚠️ Warning: These cases are RARE. Most functions should NOT be in dependency arrays!**

#### **1. Functions that capture changing values:**

```typescript
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

```typescript
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

## 🚨 Red Flags to Watch For

### **Code Patterns:**

```typescript
// 🚨 RED FLAGS:
const { someFunction } = useCustomHook(); // Function from hook
useEffect(() => {}, [someFunction]); // Function in dependency

const callback = useCallback(() => {}, [functionFromHook]); // Function dependency

// ✅ SAFE PATTERNS:
const stableFunction = useCallback(() => {}, []); // Empty deps
useEffect(() => {
  freshFunction();
}, []); // Function not in deps
```

### **Symptoms:**

- ✅ **Excessive re-renders** in React DevTools
- ✅ **Effects running too often**
- ✅ **API calls on every interaction**
- ✅ **Performance degradation**

## 🔧 Standard Solutions

### **Solution 1: Remove from Dependencies (Most Common)**

```typescript
// If the function is always fresh and doesn't need to trigger re-runs
useEffect(() => {
  freshFunction(); // Still works!
}, []); // Remove freshFunction from deps
```

### **Solution 2: Use useCallback for Stable References**

```typescript
const stableFunction = useCallback(originalFunction, [realDependencies]);
```

### **Solution 3: Use useRef Pattern**

```typescript
const functionRef = useRef();
functionRef.current = freshFunction; // Always up to date

useEffect(() => {
  functionRef.current(); // Always calls latest version
}, []); // No dependencies needed
```

### **Solution 4: Memoize Hook Results**

```typescript
const { expensiveFunction } = useCustomHook();
const memoizedFunction = useMemo(
  () => expensiveFunction,
  [
    /* real deps */
  ],
);
```

## 💡 Key Insights

### **The Core Principle:**

> **Just because a function changes doesn't mean that change should trigger side effects!**

### **Function Reference vs Function Freshness:**

- **Function Reference**: Whether `fn1 === fn2` (identity)
- **Function Freshness**: Whether the function has latest values/logic

### **The Simple Decision Rule:**

```typescript
// 🎯 SIMPLE RULE: Don't include functions in dependency arrays!

// ❌ WRONG (99% of the time):
useEffect(() => {
  someFunction();
}, [someFunction]); // Don't do this!

// ✅ CORRECT (99% of the time):
useEffect(() => {
  someFunction(); // Function is always fresh and works perfectly
}, []); // Omit the function

// 🤔 ONLY include functions if:
// 1. The function captures props/state that should trigger re-runs
// 2. You specifically WANT the effect to re-run when function logic changes
// 3. You're 100% sure this is intentional behavior
```

### **Why This Rule Works:**

1. **Functions from hooks are always fresh** - they work perfectly without being in deps
2. **Function reference changes are meaningless** - they don't indicate logic changes
3. **Including functions causes performance issues** - unnecessary re-runs
4. **React's closure system handles freshness** - you get latest values automatically

## 🏆 Best Practices

1. **Understand the difference** between "function needs to be fresh" vs "function change should trigger effect"
2. **Use React DevTools Profiler** to identify unnecessary re-renders
3. **Trust ESLint but understand when to override** with `eslint-disable-next-line`
4. **Document why** you're omitting dependencies
5. **Test thoroughly** to ensure functionality isn't broken

## 🎓 Lessons Learned

1. **Custom hooks that return functions** are common sources of this issue
2. **ESLint exhaustive-deps warnings** should be evaluated, not blindly followed
3. **Function reference stability** is different from **function freshness**
4. **Performance issues** can stem from seemingly unrelated dependency changes
5. **Debugging requires understanding** the entire re-render chain

---

## 📚 Related Issues

- **Stale Closures**: When functions capture old values → Include in deps
- **Excessive Re-renders**: When stable functions cause unnecessary updates → Remove from deps
- **Memory Leaks**: When effects don't clean up properly → Proper dependency management

This case study demonstrates why **understanding React's dependency system** is crucial for building performant applications.
