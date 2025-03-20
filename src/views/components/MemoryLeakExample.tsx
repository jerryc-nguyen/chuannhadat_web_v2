import React from 'react';
import useCleanupEffect from '@hooks/useCleanupEffect';

/**
 * Example component showing how to prevent memory leaks using the useCleanupEffect hook.
 * This component demonstrates proper cleanup of timers and event listeners.
 */
const MemoryLeakExample: React.FC = () => {
  // ❌ The problematic way - might cause memory leaks
  React.useEffect(() => {
    // This could leak if the component unmounts before the timeout completes
    const timer = setTimeout(() => {
      console.log('This might execute after unmount and cause issues');
    }, 5000);

    // This event listener might not be properly cleaned up
    window.addEventListener('resize', () => {
      console.log('Resize event that might leak');
    });

    // Even with cleanup, if not done properly, leaks can happen
    return () => {
      clearTimeout(timer);
      // Missing removeEventListener!
    };
  }, []);

  // ✅ The safe way using useCleanupEffect
  useCleanupEffect((helpers) => {
    // Safe timeout - won't execute if component unmounts
    helpers.setTimeout(() => {
      console.log('This will only run if the component is still mounted');
    }, 5000);

    // Safe event listener - automatically removed on unmount
    helpers.addEventListener(window, 'resize', () => {
      console.log('Safe resize event that cleans up properly');
    });

    // You can also use the isMounted check in async functions
    const fetchData = async () => {
      const response = await fetch('/api/data');

      // Check if component is still mounted before updating state
      if (helpers.isMounted()) {
        const data = await response.json();
        console.log('Safe to update state with:', data);
      }
    };

    fetchData();

    // Optional: return additional cleanup function if needed
    return () => {
      console.log('Additional cleanup logic if needed');
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold">Memory Leak Prevention Example</h2>
      <p className="mt-2">
        This component demonstrates how to prevent memory leaks by properly cleaning up resources.
      </p>
      <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
        <h3 className="font-semibold">Developer Note:</h3>
        <p>
          When fixing crashes in the application, use the useCleanupEffect hook instead of
          regular useEffect when dealing with timers, intervals, or event listeners to prevent memory leaks.
        </p>
      </div>
    </div>
  );
};

export default MemoryLeakExample; 
