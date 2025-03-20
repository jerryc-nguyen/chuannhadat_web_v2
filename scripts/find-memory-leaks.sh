#!/bin/bash

echo "Memory Leak Detection Script"
echo "==========================="
echo ""
echo "This script helps identify potential memory leaks in the codebase."
echo ""

# Directories to search
SEARCH_DIRS="src"

# Search for event listeners without cleanup
echo "1. Searching for event listeners that might not be properly cleaned up..."
echo "-----------------------------------------------------------------"
grep -r --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "addEventListener" $SEARCH_DIRS | grep -v "removeEventListener" | grep -v "useCleanupEffect"
echo ""

# Search for setTimeouts without clearTimeout in useEffect
echo "2. Searching for setTimeout without clearTimeout in useEffect..."
echo "-----------------------------------------------------------------"
grep -rA 10 --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "useEffect" $SEARCH_DIRS | grep -A 5 "setTimeout" | grep -v "clearTimeout" | grep -v "useCleanupEffect"
echo ""

# Search for setInterval without clearInterval in useEffect
echo "3. Searching for setInterval without clearInterval in useEffect..."
echo "-----------------------------------------------------------------"
grep -rA 10 --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "useEffect" $SEARCH_DIRS | grep -A 5 "setInterval" | grep -v "clearInterval" | grep -v "useCleanupEffect"
echo ""

# Check for missing dependency arrays in useEffect
echo "4. Searching for useEffect without dependency array (runs on every render)..."
echo "-----------------------------------------------------------------"
grep -r --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "useEffect" $SEARCH_DIRS | grep -v "\[\]" | grep -v "\[[^\]]\+\]"
echo ""

echo "5. Searching for async operations in useEffect that might update state after unmount..."
echo "-----------------------------------------------------------------"
grep -rA 10 --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "useEffect" $SEARCH_DIRS | grep -A 5 "async" | grep -v "isMounted" | grep -v "useCleanupEffect"
echo ""

echo "Memory Leak Detection Complete!"
echo ""
echo "How to fix potential memory leaks:"
echo "1. Replace useEffect with useCleanupEffect from @hooks/useCleanupEffect"
echo "2. Use helpers.addEventListener() instead of window.addEventListener()"
echo "3. Use helpers.setTimeout() instead of setTimeout()"
echo "4. Use helpers.setInterval() instead of setInterval()"
echo "5. For async operations, check if component is still mounted with helpers.isMounted()"
echo ""
echo "Example:"
echo "import useCleanupEffect from '@hooks/useCleanupEffect';"
echo ""
echo "useCleanupEffect((helpers) => {"
echo "  // Safe event listener with automatic cleanup"
echo "  helpers.addEventListener(window, 'resize', handleResize);"
echo ""
echo "  // Safe timeout that won't execute if component unmounts"
echo "  helpers.setTimeout(() => { ... }, 1000);"
echo ""
echo "  // For async operations, check if still mounted"
echo "  const fetchData = async () => {"
echo "    const result = await api.getData();"
echo "    if (helpers.isMounted()) {"
echo "      setData(result); // Safe to update state"
echo "    }"
echo "  };"
echo "}, [dependencies]);"
echo "" 
